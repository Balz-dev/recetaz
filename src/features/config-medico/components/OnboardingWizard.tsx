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
    Layout
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

interface OnboardingWizardProps {
    /**
     * Callback que se ejecuta al finalizar exitosamente el proceso de onboarding.
     * @param redirectPath - Ruta opcional a la que redirigir tras cerrar el modal.
     */
    onComplete: (redirectPath?: string) => void;
}

const STEPS = [
    { title: 'Bienvenida', icon: <PlusSquare /> },
    { title: 'Identidad', icon: <User /> },
    { title: 'Logo', icon: <ImageIcon /> },
    { title: 'Consultorio', icon: <MapPin /> },
    { title: 'Diseño', icon: <Layout /> },
    { title: 'Finalizar', icon: <CheckCircle2 /> },
];

/**
 * Componente principal del Asistente de Configuración Inicial (Onboarding).
 * 
 * Guía al médico a través de los pasos necesarios para configurar su perfil profesional,
 * datos del consultorio, y diseño de la receta médica.
 * 
 * @param props - Propiedades del componente
 * @param props.onComplete - Función a ejecutar al completar todo el proceso
 * @returns Componente JSX con el wizard paso a paso
 */
/**
 * Asistente de Onboarding (Wizard)
 * 
 * Guía al médico paso a paso a través de la configuración inicial de su perfil
 * y consultorio.
 * 
 * Pasos:
 * 1. Bienvenida e Identidad (Nombre, Cédula, Especialidad).
 * 2. Logo (Opcional).
 * 3. Configuración de Consultorio (Dirección, Contacto).
 * 4. Diseño de Receta (Selección de plantilla inicial).
 * 
 * @param props - Propiedades del componente.
 * @param props.onComplete - Callback ejecutado al finalizar. Recibe ruta de redirección opcional.
 */
export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [especialidades, setEspecialidades] = useState<EspecialidadCatalogo[]>([]);
    const [goToEditor, setGoToEditor] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

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

    // Estado para diseño de receta
    const [customDesign, setCustomDesign] = useState<string | null>(null);
    const [selectedGalleryTemplate, setSelectedGalleryTemplate] = useState<any>(null);

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
    }, []);

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    /**
     * Maneja la carga de archivos (logo o diseño de receta).
     * Valida el tamaño del archivo (máx 1MB) y lo convierte a Base64.
     * 
     * @param e - Evento del input file
     * @param type - Tipo de archivo a cargar: 'logo' o 'design'
     */
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
            if (type === 'logo') setFormData(prev => ({ ...prev, logo: base64 }));
            else setCustomDesign(base64);
        };
        reader.readAsDataURL(file);
    };

    /**
     * Guarda toda la configuración y finaliza el proceso.
     * 1. Guarda los datos del médico
     * 2. Crea/Configura la plantilla de receta
     * 3. Redirige al usuario según su elección
     */
    /**
     * Guarda la configuración completa del médico y finaliza el onboarding.
     * 
     * Acciones:
     * 1. Guarda/Actualiza los datos del médico (perfil, consultorio).
     * 2. Gestiona la creación de la plantilla de receta inicial:
     *    - Si se eligió galería: Clona la plantilla seleccionada incluyendo todos sus campos.
     *    - Si es diseño manual: Crea una plantilla básica en blanco o por defecto.
     * 3. Determina la ruta de redirección según la preferencia del usuario (ir al editor o al dashboard).
     * 4. Ejecuta el callback `onComplete` con la ruta destino.
     */
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
                // Si seleccionó de galería, crearla/activarla
                // FIX: Las plantillas de galería vienen con una propiedad 'content' que tiene la config real
                const templateData = selectedGalleryTemplate.content || selectedGalleryTemplate;

                createdPlantillaId = await plantillaService.create({
                    ...templateData,
                    activa: true,
                    updatedAt: new Date()
                });
            }

            toast({ title: "¡Configuración exitosa!", description: "Bienvenido a RecetaZ" });

            // Finalizar proceso de onboarding pasando la ruta de redirección
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

    /**
     * Renderiza el contenido del paso actual del wizard.
     */
    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Bienvenida
                return (
                    <div className="space-y-6 text-center py-4">
                        <div className="flex justify-center">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full text-blue-600 animate-bounce">
                                <Stethoscope size={64} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold">¡Bienvenido a RecetaZ!</h2>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                Estamos emocionados de ayudarte a digitalizar tu consultorio de forma segura.
                            </p>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-200 text-sm flex gap-3 items-start text-left">
                            <Info size={20} className="shrink-0 mt-0.5" />
                            <p>
                                <strong>Sus datos son privados:</strong> Toda la información que ingrese se guarda únicamente en su dispositivo. No la enviamos a ningún servidor.
                            </p>
                        </div>
                        <Button size="lg" className="w-full h-14 text-lg" onClick={nextStep}>
                            Comenzar configuración profesional
                        </Button>
                    </div>
                );

            case 1: // Identidad
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Perfil Profesional</h2>
                            <p className="text-slate-500 text-sm">Estos datos aparecerán en el encabezado de sus recetas.</p>
                        </div>
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

            case 2: // Logo
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Identidad Institucional</h2>
                            <p className="text-slate-500 text-sm">Suba el logo que desea que aparezca en el formato de sus recetas (Opcional).</p>
                        </div>
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

            case 3: // Consultorio
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Ubicación y Contacto</h2>
                            <p className="text-slate-500 text-sm">Dirección del consultorio y datos de contacto.</p>
                        </div>
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

            case 4: // Diseño
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Diseño de Receta</h2>
                            <p className="text-slate-500 text-sm">Elija una plantilla de nuestra galería o suba su propio diseño de hoja membretada.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className={`cursor-pointer transition-all ${!customDesign && selectedGalleryTemplate ? 'ring-2 ring-blue-500' : ''}`} onClick={() => setCustomDesign(null)}>
                                <CardContent className="p-4 flex flex-col items-center text-center gap-2 pt-6">
                                    <Layout className="text-blue-500" size={32} />
                                    <h3 className="font-bold">Usar Galería</h3>
                                    <p className="text-xs text-slate-500">Elija entre diseños predeterminados profesionales.</p>
                                </CardContent>
                            </Card>
                            <Card className={`cursor-pointer transition-all ${customDesign ? 'ring-2 ring-blue-500 shadow-lg' : ''}`} onClick={() => document.getElementById('design-input')?.click()}>
                                <input id="design-input" type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, 'design')} />
                                <CardContent className="p-4 flex flex-col items-center text-center gap-2 pt-6">
                                    <Upload className="text-green-500" size={32} />
                                    <h3 className="font-bold">Subir Mi Diseño</h3>
                                    <p className="text-xs text-slate-500">Cargue una imagen de su propia hoja membretada.</p>
                                </CardContent>
                            </Card>
                        </div>

                        {customDesign && (
                            <div className="relative w-full aspect-[8.5/11] border rounded-lg bg-slate-50 overflow-hidden">
                                <Image src={customDesign} alt="Background design" fill className="object-contain" />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <Button size="sm" variant="destructive" onClick={() => setCustomDesign(null)}>Eliminar</Button>
                                </div>
                            </div>
                        )}

                        {!customDesign && (
                            <div className="max-h-[300px] overflow-y-auto border rounded-xl p-4 bg-slate-50 dark:bg-slate-900/50">
                                <PlantillaGallery onSelectTemplate={(t) => setSelectedGalleryTemplate(t)} />
                            </div>
                        )}

                        {/* Toggle de Edición Completa */}
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

            case 5: // Finalizar
                return (
                    <div className="space-y-8 text-center py-6">
                        <div className="flex justify-center">
                            <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-full text-green-600 animate-in zoom-in-50 duration-500">
                                <CheckCircle2 size={64} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">¡Todo listo!</h2>
                            <p className="text-slate-500 dark:text-slate-400">
                                Hemos configurado su entorno profesional. Podrá cambiar estos datos en cualquier momento desde el panel de ajustes.
                            </p>
                        </div>
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

    return (
        <div className="max-w-2xl mx-auto min-h-[500px] flex flex-col">
            {/* Header / Stepper Progress */}
            <div className="mb-8 pt-4">
                <div className="flex items-center justify-between mb-2">
                    {STEPS.map((step, idx) => (
                        <div
                            key={idx}
                            className={`flex flex-col items-center transition-all ${idx <= currentStep ? 'text-blue-600 opacity-100' : 'text-slate-300 opacity-50'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 border-2 transition-all ${idx === currentStep ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : idx < currentStep ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-300'}`}>
                                {idx < currentStep ? <CheckCircle2 size={18} /> : React.cloneElement(step.icon as any, { size: 18 })}
                            </div>
                            <span className="text-[10px] font-bold hidden sm:block uppercase tracking-wider">{step.title}</span>
                        </div>
                    ))}
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                        transition={{ ease: "easeInOut", duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Content Area with Animation */}
            <div className="flex-1 overflow-hidden relative p-1">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                    >
                        {renderStepContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
