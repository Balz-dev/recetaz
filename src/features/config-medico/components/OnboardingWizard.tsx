"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    ChevronLeft,
    User,
    Stethoscope,
    MapPin,
    Image as ImageIcon,
    CheckCircle2,
    PlusSquare,
    Upload,
    X,
    Info,
    Layout,
    Palette,
    Shield,
    Lock,
    Smartphone,
    Monitor,
    Check,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useToast } from '@/shared/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { medicoService } from '@/features/config-medico/services/medico.service';
import { plantillaService } from '@/features/recetas/services/plantilla.service';
import { db } from '@/shared/db/db.config';
import { EspecialidadCatalogo, MedicoConfigFormData } from '@/types';
import { PlantillaGallery } from '@/features/recetas/components/PlantillaGallery';
import { SpecialtySelect } from '@/shared/components/catalog/SpecialtySelect';
import Image from 'next/image';
import { usePWA } from '@/shared/providers/PWAProvider';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { DraZoylaAvatar } from './DraZoylaAvatar';
import { Bocadillo } from './Bocadillo';
import { useMetrics } from '@/shared/hooks/useMetrics';
import { useAuth } from '@/shared/hooks/useAuth';

interface OnboardingWizardProps {
    /**
     * Callback que se ejecuta al finalizar exitosamente el proceso de onboarding.
     * @param redirectPath - Ruta opcional a la que redirigir tras cerrar el modal.
     */
    onComplete: (redirectPath?: string) => void;
}

const STEPS = [
    { title: 'Bienvenida', description: 'Inicio', icon: <PlusSquare /> },
    { title: 'Instalación', description: 'App', icon: <Monitor /> },
    { title: 'Identidad', description: 'Perfil', icon: <User /> },
    { title: 'Logo', description: 'Marca', icon: <ImageIcon /> },
    { title: 'Consultorio', description: 'Ubicación', icon: <MapPin /> },
    { title: 'Diseño Receta', description: 'Receta', icon: <Palette /> },
    { title: 'Cuenta', description: 'Seguridad', icon: <Shield /> },
    { title: 'Finalizar', description: 'Listo', icon: <CheckCircle2 /> },
];

/**
 * Configuración de Dra. Zoyla para cada paso.
 */
const ZOYLA_CONFIG: Record<number, { pose: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10, text: React.ReactNode, direction: 'left' | 'right' | 'top' | 'bottom', flipped?: boolean }> = {
    0: { // Bienvenida
        pose: 1, // Saludo
        text: "¡Hola! Soy la Dra. Zoyla, tu asistente virtual. Estoy aquí para ayudarte a configurar tu consultorio digital en RecetaZ. ¡Es súper fácil y rápido!",
        direction: 'right'
    },
    1: { // Instalación
        pose: 9, // Entusiasmo
        text: "¿Te gustaría entrar más rápido? Puedo instalar un acceso directo en tu pantalla de inicio. ¡Así estaré siempre a un toque de distancia!",
        direction: 'right'
    },
    2: { // Identidad
        pose: 2, // Apunta Izquierda
        text: "Tus pacientes necesitan saber quién los atiende. Escribe tu nombre y especialidad exactamente como quieres que aparezcan impresos en el encabezado de tus recetas.",
        direction: 'right'
    },
    3: { // Logo
        pose: 5, // Apunta Derecha Sutil (Invertido apuntará a la izquierda, hacia el form)
        flipped: true,
        text: "¿Tienes un logotipo? ¡Súbelo aquí! Si no, no te preocupes, podemos dejarlo para después. Lo importante es que tu receta hable bien de ti.",
        direction: 'right'
    },
    4: { // Consultorio
        pose: 6, // Apunta Abajo (o izquierda)
        text: "La dirección y el teléfono son vitales para que tus pacientes te contacten. Estos datos se imprimirán e incluirán automáticamente en todos tus reportes y recetas.",
        direction: 'right'
    },
    5: { // Diseño
        pose: 9, // Entusiasmo
        text: "¡La parte divertida! Elige el diseño de tu receta. Selecciona una de nuestras plantillas profesionales o sube tu propio diseño membretado.",
        direction: 'right'
    },
    6: { // Cuenta
        pose: 3, // Sutil
        text: "Esto es opcional, pero muy útil. Si creas una cuenta (es gratis), puedo guardar copias de seguridad cifradas en tu Google Drive. ¡Seguridad ante todo!",
        direction: 'right'
    },
    7: { // Finalizar
        pose: 9, // OK
        text: "¡Increíble! Ya está todo listo. Tu consultorio digital ha quedado perfecto. ¿Empezamos a crear tu primera receta?",
        direction: 'right'
    }
};

/**
 * Componente principal del Asistente de Configuración Inicial (Onboarding).
 */
export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [especialidades, setEspecialidades] = useState<EspecialidadCatalogo[]>([]);
    const [goToEditor, setGoToEditor] = useState(true);
    const { toast } = useToast();
    const router = useRouter();
    const { installApp, isInstalled, isIOS, hasPrompt } = usePWA();
    const { track, trackMarketing } = useMetrics();

    // Estado del formulario
    const [formData, setFormData] = useState<MedicoConfigFormData>({
        nombre: '',
        especialidad: '',
        especialidadKey: 'general',
        cedula: '',
        telefono: '',
        direccion: '',
        logo: undefined,
    });

    // Estado para autenticación
    const { signUp, loading: authLoading } = useAuth();
    const [authData, setAuthData] = useState({
        email: '',
        password: '',
    });
    const [authError, setAuthError] = useState<string | null>(null);

    // Responsividad del bocadillo
    // Desktop: 'right' (apunta a la derecha hacia Dra. Zoyla que está en col derecha)
    // Mobile: 'top' (apunta arriba hacia Dra. Zoyla que está arriba)
    const [bocadilloDirection, setBocadilloDirection] = useState<'right' | 'top'>('top');

    useEffect(() => {
        const handleResize = () => {
            setBocadilloDirection(window.innerWidth >= 768 ? 'right' : 'top');
        };

        handleResize(); // Initial
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Estado para diseño de receta
    const [customDesign, setCustomDesign] = useState<string | null>(null);
    const [selectedGalleryTemplate, setSelectedGalleryTemplate] = useState<any>(null);
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
    const [stepStartTime, setStepStartTime] = useState<number>(Date.now());

    // Track vista de paso cada vez que cambia el currentStep
    useEffect(() => {
        const stepName = STEPS[currentStep].title.toLowerCase().replace(/\s+/g, '_');
        trackMarketing('onboarding_step_viewed', {
            step: STEPS[currentStep].title,
            stepIndex: currentStep,
            stepName
        });
        setStepStartTime(Date.now());
    }, [currentStep]);

    // Cargar datos existentes y especialidades
    useEffect(() => {
        const init = async () => {
            const specs = await db.especialidades.toArray();
            setEspecialidades(specs);

            const existing = await medicoService.get();
            if (existing) {
                setFormData({
                    nombre: existing.nombre,
                    especialidad: existing.especialidad,
                    especialidadKey: existing.especialidadKey || 'general',
                    cedula: existing.cedula,
                    telefono: existing.telefono,
                    direccion: existing.direccion || '',
                    logo: existing.logo,
                });
            } else if (specs.length > 0) {
                const defaultSpec = specs.find(s => s.id === 'general') || specs[0];
                setFormData(prev => ({
                    ...prev,
                    especialidad: defaultSpec.label,
                    especialidadKey: defaultSpec.id,
                }));
            }
        };
        init();

        // Track inicio de onboarding
        trackMarketing('onboarding_started');
    }, []);

    const nextStep = () => {
        const nextIdx = currentStep + 1;
        const duration = Math.round((Date.now() - stepStartTime) / 1000);

        // Track hito de paso completado con duración
        track('onboarding_step_completed', {
            step: STEPS[currentStep].title,
            stepIndex: currentStep,
            nextStep: STEPS[nextIdx]?.title || 'Finalizar',
            durationSeconds: duration
        }, 'marketing');

        if (currentStep + 1 === 1 && isInstalled) {
            setCurrentStep(prev => Math.min(prev + 2, STEPS.length - 1));
            return;
        }
        setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    };

    const prevStep = () => {
        const duration = Math.round((Date.now() - stepStartTime) / 1000);
        track('onboarding_step_back', {
            fromStep: STEPS[currentStep].title,
            fromIndex: currentStep,
            durationBeforeBack: duration
        });
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    // Navegación directa por click en header
    const goToStep = (stepIndex: number) => {
        // Permitimos navegar a cualquier paso ya visitado o al siguiente inmediato
        // O simplificamos permitiendo navegar libremente ya que es un wizard de config inicial
        // Para mejor UX, permitamos volver atrás libremente, y adelante solo si los datos requeridos están.

        // Simplemente actualizamos estado
        setCurrentStep(stepIndex);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'design') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 1024 * 1024) {
            toast({ title: "Archivo demasiado grande", description: "El límite es 1MB", variant: "destructive" });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            if (type === 'logo') {
                setFormData(prev => ({ ...prev, logo: base64 }));
                track('onboarding_logo_uploaded', { size: file.size }, 'user_action');
            } else {
                setCustomDesign(base64);
                track('onboarding_custom_design_uploaded', { size: file.size }, 'user_action');
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSaveAndComplete = async () => {
        setIsLoading(true);
        try {
            // 1. Guardar datos del médico
            await medicoService.save(formData);

            let createdPlantillaId = '';

            // 2. Manejar plantilla
            if (customDesign) {
                createdPlantillaId = await plantillaService.create({
                    nombre: 'Mi Diseño Personalizado',
                    activa: true,
                    tamanoPapel: 'media_carta',
                    imagenFondo: customDesign,
                    imprimirFondo: true,
                    campos: [
                        { id: 'paciente', etiqueta: 'Paciente', x: 10, y: 30, ancho: 80, visible: true, tipo: 'texto' },
                        { id: 'fecha', etiqueta: 'Fecha', x: 70, y: 20, ancho: 20, visible: true, tipo: 'texto' },
                        { id: 'prescripcion', etiqueta: 'Prescripción', x: 10, y: 45, ancho: 80, alto: 40, visible: true, tipo: 'texto' },
                    ]
                });
            } else if (selectedGalleryTemplate) {
                const templateData = selectedGalleryTemplate.content || selectedGalleryTemplate;
                createdPlantillaId = await plantillaService.create({
                    ...templateData,
                    activa: true,
                    updatedAt: new Date()
                });
            }

            toast({ title: "¡Configuración exitosa!", description: "Bienvenido a RecetaZ" });

            // Track éxito total (Conversión)
            trackMarketing('onboarding_completed', {
                especialidad: formData.especialidad,
                hasLogo: !!formData.logo,
                templateSource: customDesign ? 'upload' : (selectedGalleryTemplate ? 'gallery' : 'none'),
                goToEditor
            });

            onComplete(
                goToEditor
                    ? (createdPlantillaId ? `/recetas/plantillas/${createdPlantillaId}` : '/recetas/plantillas/nueva')
                    : '/dashboard'
            );
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "No se pudieron guardar los datos", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Bienvenida
                return (
                    <div className="space-y-6 text-center py-4">
                        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-200 text-sm flex gap-3 items-start text-left mt-4">
                            <Info size={20} className="shrink-0 mt-0.5" />
                            <p>
                                <strong>Sus datos son privados:</strong> Toda la información que ingrese se guarda únicamente en su dispositivo. No la enviamos a ningún servidor.
                            </p>
                        </div>
                        <Button size="lg" className="w-full h-14 text-lg mt-8" onClick={nextStep}>
                            Comenzar configuración
                        </Button>
                    </div>
                );

            case 1: // Instalación PWA
                return (
                    <div className="space-y-6 animate-in slide-in-from-right duration-500">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                            {isInstalled ? (
                                <div className="text-center space-y-4">
                                    <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
                                        <Check className="w-5 h-5" />
                                        <span>¡Ya tiene el acceso rápido habilitado!</span>
                                    </div>
                                    <Button className="w-full" onClick={nextStep}>Continuar</Button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {isIOS ? (
                                        <div className="text-sm text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                            <p className="font-bold mb-2 text-blue-700 dark:text-blue-300">Para iPad/iPhone:</p>
                                            <ol className="list-decimal list-inside space-y-1">
                                                <li>Toque el botón <strong>Compartir</strong> del navegador.</li>
                                                <li>Seleccione <strong>"Agregar a Inicio"</strong>.</li>
                                            </ol>
                                        </div>
                                    ) : hasPrompt ? (
                                        <Button className="w-full h-14 text-lg font-bold shadow-lg shadow-blue-200 dark:shadow-none animate-pulse" onClick={installApp}>
                                            Sí, agregar icono
                                        </Button>
                                    ) : (
                                        <div className="text-center space-y-4 relative">
                                            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-4 rounded-lg text-amber-800 dark:text-amber-200 text-sm">
                                                <p className="font-bold mb-1 flex items-center justify-center gap-2">
                                                    <Info size={16} />
                                                    Instalación manual
                                                </p>
                                                <p>
                                                    Busca la opción <strong>"Instalar aplicación"</strong> en el menú del navegador.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-2 text-center">
                                        <Button variant="ghost" className="text-slate-400 hover:text-slate-600" onClick={() => {
                                            track('onboarding_installation_skipped', {}, 'marketing');
                                            nextStep();
                                        }}>
                                            No por ahora, continuar en navegador
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 2: // Identidad
                return (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nombre completo (con título)</label>
                                <Input
                                    placeholder="Dr. Manuel Estrada"
                                    value={formData.nombre}
                                    onChange={e => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cédula Profesional</label>
                                <Input
                                    placeholder="12345678"
                                    value={formData.cedula}
                                    onChange={e => setFormData(prev => ({ ...prev, cedula: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Especialidad</label>
                                <SpecialtySelect
                                    value={formData.especialidadKey}
                                    onValueChange={(key: string, label: string) => {
                                        setFormData(prev => ({ ...prev, especialidadKey: key, especialidad: label }));
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <Button variant="ghost" onClick={prevStep}>Atrás</Button>
                            <Button className="flex-1" onClick={nextStep} disabled={!formData.nombre || !formData.cedula || !formData.especialidadKey}>Continuar</Button>
                        </div>
                    </div>
                );

            case 3: // Logo
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:border-blue-400 transition-colors cursor-pointer" onClick={() => document.getElementById('logo-input')?.click()}>
                            <input id="logo-input" type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, 'logo')} />
                            {formData.logo ? (
                                <div className="relative w-40 h-40 group">
                                    <Image src={formData.logo} alt="Logo" fill className="object-contain" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                                        <X className="text-white bg-red-500 rounded-full p-1" size={24} onClick={(e) => { e.stopPropagation(); setFormData(prev => ({ ...prev, logo: undefined })); }} />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-2">
                                    <ImageIcon className="mx-auto text-slate-400" size={48} />
                                    <p className="text-sm font-medium text-slate-600">Presione para subir su logo</p>
                                    <p className="text-xs text-slate-400">JPG, PNG o WEBP (Máx 1MB)</p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4 pt-4">
                            <Button variant="ghost" onClick={prevStep}>Atrás</Button>
                            <Button className="flex-1" onClick={nextStep}>Continuar</Button>
                        </div>
                    </div>
                );

            case 4: // Consultorio
                return (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Teléfono de contacto</label>
                                <Input
                                    placeholder="+52 55..."
                                    value={formData.telefono}
                                    onChange={e => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Domicilio completo (Opcional)</label>
                                <Textarea
                                    placeholder="Av. Paseo de los Leones #123..."
                                    value={formData.direccion}
                                    onChange={e => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                                    className="resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <Button variant="ghost" onClick={prevStep}>Atrás</Button>
                            <Button className="flex-1" onClick={nextStep}>Continuar</Button>
                        </div>
                    </div>
                );

            case 5: // Diseño
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                className={`h-auto py-3 border-2 flex flex-col sm:flex-row items-center justify-center gap-2 ${!customDesign && selectedGalleryTemplate ? 'border-blue-500 bg-blue-50/50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-slate-50'}`}
                                onClick={() => {
                                    setCustomDesign(null);
                                    setIsGalleryModalOpen(true);
                                }}
                            >
                                <Layout size={20} className={!customDesign && selectedGalleryTemplate ? "text-blue-500" : "text-slate-400"} />
                                <span className="font-bold text-xs sm:text-sm">Galería</span>
                            </Button>

                            <Button
                                variant="outline"
                                className={`h-auto py-3 border-2 flex flex-col sm:flex-row items-center justify-center gap-2 ${customDesign ? 'border-green-500 bg-green-50/50 text-green-700' : 'border-slate-200 text-slate-600 hover:border-green-300 hover:bg-slate-50'}`}
                                onClick={() => document.getElementById('design-input')?.click()}
                            >
                                <input id="design-input" type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, 'design')} />
                                <Upload size={20} className={customDesign ? "text-green-500" : "text-slate-400"} />
                                <span className="font-bold text-xs sm:text-sm">Subir Propia</span>
                            </Button>
                        </div>

                        {customDesign && (
                            <div className="relative w-full aspect-[8.5/11] border rounded-lg bg-slate-50 overflow-hidden shadow-sm">
                                <Image src={customDesign} alt="Background design" fill className="object-contain" />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <Button size="sm" variant="destructive" className="h-8 text-xs" onClick={() => setCustomDesign(null)}>Eliminar</Button>
                                </div>
                            </div>
                        )}

                        {!customDesign && selectedGalleryTemplate && (
                            <div className="border rounded-xl p-4 bg-blue-50/30 dark:bg-blue-900/5 flex flex-col items-center gap-2 border-blue-100 dark:border-blue-900/20">
                                <div className="flex items-center gap-2 mb-1">
                                    <CheckCircle2 size={16} className="text-blue-500" />
                                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Diseño seleccionado</span>
                                </div>
                                <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{selectedGalleryTemplate.name || selectedGalleryTemplate.filename}</div>
                                <Button variant="ghost" size="sm" onClick={() => setIsGalleryModalOpen(true)} className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-100/50 mt-1">
                                    Cambiar diseño
                                </Button>
                            </div>
                        )}

                        {!customDesign && !selectedGalleryTemplate && (
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-slate-50/50 dark:bg-slate-900/20">
                                <Palette size={32} className="text-slate-300 dark:text-slate-700" />
                                <p className="text-sm text-slate-500 font-medium">No has seleccionado ningún diseño</p>
                                <Button variant="secondary" size="sm" onClick={() => setIsGalleryModalOpen(true)}>
                                    Abrir galería
                                </Button>
                            </div>
                        )}

                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl space-y-3 border border-blue-100 dark:border-blue-900/30">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="goToEditor" className="text-sm font-bold text-blue-900 dark:text-blue-300">
                                        Perfeccionar diseño al finalizar
                                    </Label>
                                    <p className="text-xs text-blue-700/70 dark:text-blue-400/70">
                                        Se abrirá el editor para ajustar márgenes y campos.
                                    </p>
                                </div>
                                <Switch
                                    id="goToEditor"
                                    checked={goToEditor}
                                    onCheckedChange={setGoToEditor}
                                />
                            </div>
                            {!goToEditor && (
                                <p className="text-[11px] text-amber-600 dark:text-amber-400 italic flex gap-1 items-center">
                                    <Info size={12} />
                                    Podrá editar este diseño después desde el menú de Plantillas.
                                </p>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button variant="ghost" onClick={prevStep}>Atrás</Button>
                            <Button className="flex-1" onClick={nextStep} disabled={!customDesign && !selectedGalleryTemplate}>
                                Finalizar configuración
                            </Button>
                        </div>
                    </div>
                );

            case 6: // Cuenta (Registro Opcional)
                return (
                    <div className="space-y-6 animate-in slide-in-from-right duration-500">
                        <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <CardContent className="p-6 space-y-4">
                                {authError && (
                                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg flex gap-3 items-start text-xs text-red-800 dark:text-red-300 animate-in fade-in slide-in-from-top-1">
                                        <AlertCircle size={14} className="mt-0.5 shrink-0" />
                                        <p>{authError}</p>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="auth-email">Correo Electrónico</Label>
                                        <Input
                                            id="auth-email"
                                            type="email"
                                            placeholder="doctor@ejemplo.com"
                                            value={authData.email}
                                            onChange={e => setAuthData(prev => ({ ...prev, email: e.target.value }))}
                                            autoComplete="email"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="auth-password">Contraseña</Label>
                                        <Input
                                            id="auth-password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={authData.password}
                                            onChange={e => setAuthData(prev => ({ ...prev, password: e.target.value }))}
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl flex gap-3 items-start text-[11px] leading-relaxed text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30">
                                    <Shield size={16} className="mt-0.5 shrink-0 text-blue-500" />
                                    <div>
                                        <p className="font-bold mb-1">Tu privacidad es nuestra prioridad</p>
                                        <p>
                                            Tus pacientes y recetas permanecen <strong>100% locales</strong>.
                                            La cuenta solo se usa para habilitar copias de seguridad y sincronización en la nube.
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-12 font-bold transition-all active:scale-[0.98]"
                                    onClick={async () => {
                                        if (!authData.email || !authData.password) {
                                            setAuthError("Por favor, ingresa tu correo y contraseña.");
                                            return;
                                        }
                                        if (authData.password.length < 6) {
                                            setAuthError("La contraseña debe tener al menos 6 caracteres.");
                                            return;
                                        }

                                        setAuthError(null);
                                        const { error } = await signUp(authData.email, authData.password, {
                                            nombre: formData.nombre,
                                            especialidad: formData.especialidad
                                        });

                                        if (error) {
                                            setAuthError(error.message);
                                            track('onboarding_account_failed', { error: error.message });
                                        } else {
                                            track('onboarding_account_created', { email: authData.email });
                                            toast({ title: "¡Cuenta creada!", description: "Has vinculado tu consultorio exitosamente." });
                                            nextStep();
                                        }
                                    }}
                                    disabled={authLoading}
                                >
                                    {authLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Creando cuenta...</span>
                                        </div>
                                    ) : 'Vincular Consultorio a la Nube'}
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="text-center pt-2">
                            <Button
                                variant="ghost"
                                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
                                onClick={() => {
                                    track('onboarding_account_skipped', {}, 'marketing');
                                    nextStep();
                                }}
                                disabled={authLoading}
                            >
                                Continuar sin cuenta (Solo Local)
                            </Button>
                        </div>
                    </div>
                );

            case 7: // Finalizar
                return (
                    <div className="space-y-8 text-center py-6">
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl text-left space-y-3">
                            <h4 className="font-bold text-blue-900 dark:text-blue-300">Resumen profesional:</h4>
                            <div className="text-sm space-y-1 text-blue-800 dark:text-blue-200">
                                <p><strong>Médico:</strong> {formData.nombre}</p>
                                <p><strong>Cédula:</strong> {formData.cedula}</p>
                                <p><strong>Especialidad:</strong> {formData.especialidad}</p>
                                <p><strong>Formato:</strong> {customDesign ? 'Diseño proporcionado' : (selectedGalleryTemplate?.nombre || 'Predeterminado')}</p>
                                <p><strong>Siguiente paso:</strong> {goToEditor ? 'Personalizar en el editor' : 'Ir al Dashboard'}</p>
                            </div>
                        </div>
                        <Button size="lg" className="w-full h-14 text-lg font-bold" onClick={handleSaveAndComplete} disabled={isLoading}>
                            {isLoading ? 'Guardando...' : goToEditor ? 'Guardar y personalizar diseño' : 'Comenzar a emitir recetas'}
                        </Button>
                    </div>
                );
            default:
                return null;
        }
    };

    const zoylaState = ZOYLA_CONFIG[currentStep] || ZOYLA_CONFIG[0];

    return (
        <div className="w-full max-w-full h-auto flex flex-col p-0 overflow-hidden">
            {/* Header / Stepper Progress - Mejorado y Clickable */}
            <div className="mb-4 pt-2">
                <div className="hidden md:flex items-center justify-between mb-4 px-2">
                    {STEPS.map((step, idx) => {
                        const isCompleted = idx < currentStep;
                        const isCurrent = idx === currentStep;
                        const isClickable = true; // Habilitamos navegación libre por diseño de wizard moderno

                        return (
                            <div
                                key={idx}
                                className={`flex flex-col items-center gap-2 relative group cursor-pointer transition-all`}
                                onClick={() => isClickable && goToStep(idx)}
                            >
                                {/* Línea de conexión */}
                                {idx < STEPS.length - 1 && (
                                    <div className={`absolute top-5 left-1/2 w-full h-[2px] transition-colors -z-10 ${idx < currentStep ? 'bg-blue-600' : 'bg-slate-200'
                                        }`} />
                                )}

                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isCurrent ? 'bg-blue-600 text-white border-blue-600 scale-110 shadow-lg' :
                                    isCompleted ? 'bg-white text-blue-600 border-blue-600' :
                                        'bg-white text-slate-300 border-slate-200'
                                    }`}>
                                    {isCompleted ? <Check size={20} /> : React.cloneElement(step.icon as any, { size: 20 })}
                                </div>
                                <div className="text-center">
                                    <span className={`text-xs font-bold block ${isCurrent ? 'text-blue-700' : 'text-slate-500'}`}>
                                        {step.title}
                                    </span>
                                    <span className="text-[10px] text-slate-400 hidden lg:block">
                                        {step.description}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Header Móvil Simple */}
                <div className="md:hidden flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-500">Paso {currentStep + 1} de {STEPS.length}</span>
                    <span className="text-sm font-bold text-blue-600">{STEPS[currentStep].title}</span>
                </div>
                <div className="flex md:hidden h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                        transition={{ ease: "easeInOut", duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Main Layout con Dra. Zoyla */}
            {/* INVERTIDO: Columna Izquierda = Formulario, Columna Derecha = Avatar */}
            <div className="flex flex-col-reverse md:flex-row gap-6 items-start mt-2 w-full max-w-full overflow-hidden">
                {/* Columna Izquierda: Bocadillo + Formulario */}
                <div className="w-full md:w-2/3 flex flex-col gap-4 min-w-0">
                    {/* Bocadillo en flujo normal */}
                    <div className="w-full md:max-w-[90%]">
                        <Bocadillo
                            direction={bocadilloDirection}
                            className="text-sm md:text-base shadow-sm border-blue-100"
                        >
                            <p className="font-medium leading-relaxed">
                                {zoylaState.text}
                            </p>
                        </Bocadillo>
                    </div>

                    <div className="bg-white dark:bg-black/20 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm min-w-0 w-full flex flex-col">
                        <div className="mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                {STEPS[currentStep].icon}
                                {STEPS[currentStep].title}
                            </h2>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full min-w-0 flex-1"
                            >
                                {renderStepContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Columna Derecha: Dra. Zoyla */}
                <div className="w-full md:w-1/3 flex flex-col items-center sticky top-4 min-w-0 overflow-hidden">
                    <div className="relative">
                        {/* Personaje */}
                        <div className="transform scale-[0.6] md:scale-[0.85] origin-top md:origin-top-center -mt-8 md:mt-0">
                            <DraZoylaAvatar
                                pose={zoylaState.pose}
                                className={zoylaState.flipped ? "scale-x-[-1]" : ""}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Galería de Plantillas */}
            <Dialog open={isGalleryModalOpen} onOpenChange={setIsGalleryModalOpen}>
                <DialogContent className="max-w-[95vw] w-full lg:max-w-4xl p-0 overflow-hidden bg-white dark:bg-slate-950 border-none shadow-2xl z-[300]">
                    <DialogHeader className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Layout className="text-blue-500" size={24} />
                            Selecciona tu diseño profesional
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-6 overflow-x-hidden">
                        <div className="mb-4 text-sm text-slate-500">
                            Elige el estilo que mejor represente tu práctica médica. Podrás personalizarlo más adelante.
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/30 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                            <PlantillaGallery
                                onSelectTemplate={(t) => {
                                    setSelectedGalleryTemplate(t);
                                    setCustomDesign(null);
                                    // No cerramos inmediatamente para que vea la selección, o cerramos tras un pequeño delay
                                    setTimeout(() => setIsGalleryModalOpen(false), 400);
                                }}
                                selectedTemplate={selectedGalleryTemplate}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
