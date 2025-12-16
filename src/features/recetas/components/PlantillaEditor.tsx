"use client"

import React, { useState, useEffect, useRef } from "react"
import { DndContext, useDraggable, useDroppable, DragEndEvent, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay, pointerWithin } from "@dnd-kit/core"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import { PlantillaReceta, CampoPlantilla, PlantillaRecetaFormData } from "@/types"
import { plantillaService } from "@/features/recetas/services/plantilla.service"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Switch } from "@/shared/components/ui/switch"
import { Card, CardContent } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { Loader2, Save, Layout, Type, GripVertical, Trash, ArrowLeft, Image as ImageIcon, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Tipos de campos disponibles para agregar
const AVAILABLE_FIELDS_DEF = [
    // Datos del Médico
    { id: 'medico_nombre', etiqueta: 'Nombre del Médico', tipo: 'texto', defaultW: 40, defaultH: 5 },
    { id: 'medico_especialidad', etiqueta: 'Especialidad', tipo: 'texto', defaultW: 40, defaultH: 5 },
    { id: 'medico_institucion_gral', etiqueta: 'Institución (Gral)', tipo: 'texto', defaultW: 40, defaultH: 5 },
    { id: 'medico_cedula_gral', etiqueta: 'Cédula (Gral)', tipo: 'texto', defaultW: 20, defaultH: 5 },
    { id: 'medico_institucion_esp', etiqueta: 'Institución (Esp)', tipo: 'texto', defaultW: 40, defaultH: 5 },
    { id: 'medico_cedula_esp', etiqueta: 'Cédula (Esp)', tipo: 'texto', defaultW: 20, defaultH: 5 },
    { id: 'medico_domicilio', etiqueta: 'Domicilio Consultorio', tipo: 'texto', defaultW: 60, defaultH: 5 },
    { id: 'medico_contacto', etiqueta: 'Número de Contacto', tipo: 'texto', defaultW: 30, defaultH: 5 },
    { id: 'medico_correo', etiqueta: 'Correo Electrónico', tipo: 'texto', defaultW: 30, defaultH: 5 },
    { id: 'medico_web', etiqueta: 'Sitio Web', tipo: 'texto', defaultW: 30, defaultH: 5 },
    { id: 'medico_logo', etiqueta: 'Logo / Imagen', tipo: 'imagen', defaultW: 20, defaultH: 15 },

    // Datos del Paciente
    { id: 'fecha', etiqueta: 'Fecha de Consulta', tipo: 'fecha', defaultW: 20, defaultH: 5 },
    { id: 'paciente_nombre', etiqueta: 'Nombre Paciente', tipo: 'texto', defaultW: 50, defaultH: 5 },
    { id: 'paciente_edad', etiqueta: 'Edad', tipo: 'texto', defaultW: 10, defaultH: 5 },
    { id: 'paciente_peso', etiqueta: 'Peso', tipo: 'texto', defaultW: 10, defaultH: 5 },
    { id: 'paciente_talla', etiqueta: 'Talla', tipo: 'texto', defaultW: 10, defaultH: 5 },
    { id: 'diagnostico', etiqueta: 'Diagnóstico', tipo: 'texto', defaultW: 80, defaultH: 5 },
    { id: 'alergias', etiqueta: 'Alergias', tipo: 'texto', defaultW: 40, defaultH: 5 },

    // Datos de la Receta
    { id: 'receta_folio', etiqueta: 'Folio Receta', tipo: 'texto', defaultW: 20, defaultH: 5 },
    { id: 'receta_fecha', etiqueta: 'Fecha de Emisión', tipo: 'texto', defaultW: 20, defaultH: 5 },

    // Cuerpo de la Receta
    { id: 'medicamento_nombre', etiqueta: 'Medicamento', tipo: 'texto', defaultW: 30, defaultH: 5 },
    { id: 'medicamento_generico', etiqueta: 'Denominación Genérica', tipo: 'texto', defaultW: 30, defaultH: 5 },
    { id: 'medicamento_marca', etiqueta: 'Marca Comercial', tipo: 'texto', defaultW: 30, defaultH: 5 },
    { id: 'medicamento_forma', etiqueta: 'Forma Farmacéutica', tipo: 'texto', defaultW: 20, defaultH: 5 },
    { id: 'medicamento_dosis', etiqueta: 'Dosis/Concentración', tipo: 'texto', defaultW: 20, defaultH: 5 },
    { id: 'medicamento_presentacion', etiqueta: 'Presentación', tipo: 'texto', defaultW: 20, defaultH: 5 },
    { id: 'medicamento_via', etiqueta: 'Vía de Admin.', tipo: 'texto', defaultW: 20, defaultH: 5 },
    { id: 'medicamento_posologia', etiqueta: 'Posología (Instrucciones)', tipo: 'texto', defaultW: 60, defaultH: 10 },

    // Legacy / Composites
    { id: 'medicamentos_lista', etiqueta: 'Lista Completa (Tabla)', tipo: 'lista', defaultW: 90, defaultH: 40 },
    { id: 'instrucciones_lista', etiqueta: 'Instrucciones (Bloque)', tipo: 'texto', defaultW: 90, defaultH: 20 },
    { id: 'sugerencias', etiqueta: 'Sugerencias / Notas', tipo: 'texto', defaultW: 90, defaultH: 10 },
] as const;

// Componente Sidebar Draggable
function SidebarDraggableItem({ field, isAdded }: { field: typeof AVAILABLE_FIELDS_DEF[number], isAdded: boolean }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `sidebar-${field.id}`,
        data: { type: 'sidebar', field }
    });

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className={cn("touch-none", isDragging && "opacity-50")}>
            <Button
                variant={isAdded ? "secondary" : "outline"}
                className={cn(
                    "w-full justify-start cursor-grab active:cursor-grabbing",
                    isAdded && 'bg-blue-50 border-blue-200 text-blue-700'
                )}
            >
                {isAdded ? <Layout className="mr-2 h-4 w-4" /> : <Type className="mr-2 h-4 w-4" />}
                {field.etiqueta}
            </Button>
        </div>
    )
}

// Helper para texto de ejemplo
function getExampleText(id: string): string {
    const examples: Record<string, string> = {
        medico_nombre: "Dr. Juan Pérez",
        medico_especialidad: "Cardiología Clínica",
        medico_institucion_gral: "Universidad Nacional",
        medico_cedula_gral: "12345678",
        medico_institucion_esp: "Hospital General",
        medico_cedula_esp: "87654321",
        medico_domicilio: "Av. Reforma 123, Col. Centro, CDMX",
        medico_contacto: "55 1234 5678",
        medico_correo: "dr.juan@email.com",
        medico_web: "www.drjuan.com",
        fecha: "16 Oct 2025",
        paciente_nombre: "María González López",
        paciente_edad: "34 años",
        paciente_peso: "68 kg",
        paciente_talla: "1.65 m",
        diagnostico: "Infección Respiratoria Aguda",
        alergias: "Penicilina, Sulfa",
        receta_folio: "12345",
        receta_fecha: "16/10/2025",
        medicamento_nombre: "Amoxicilina",
        medicamento_generico: "Amoxicilina",
        medicamento_marca: "Amoxil",
        medicamento_forma: "Cápsulas",
        medicamento_dosis: "500 mg",
        medicamento_presentacion: "Caja con 12",
        medicamento_via: "Oral",
        medicamento_posologia: "Tomar 1 cápsula cada 8 horas por 7 días...",
        medicamentos_lista: "• Amoxicilina - 500mg\n• Paracetamol - 500mg",
        instrucciones_lista: "Beber abundantes líquidos.\nReposo relativo.",
        sugerencias: "Evitar cambios bruscos de temperatura."
    };
    return examples[id] || "Texto de ejemplo";
}

// Componente de Campo Arrastrable en Canvas
function CanvasDraggableField({ field, isSelected, onSelect, onResize, onUpdate, containerRef }: {
    field: CampoPlantilla,
    isSelected: boolean,
    onSelect: () => void,
    onResize: (id: string, widthPercent: number, heightPercent: number) => void
    onUpdate: (id: string, updates: Partial<CampoPlantilla>) => void
    containerRef: React.RefObject<HTMLDivElement | null>
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: field.id,
        data: { type: 'canvas', field }
    });

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleResize = (e: React.SyntheticEvent, data: ResizeCallbackData) => {
        if (!containerRef.current) return;
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;

        const newWidthPercent = (data.size.width / containerWidth) * 100;
        const newHeightPercent = (data.size.height / containerHeight) * 100;

        onResize(field.id, newWidthPercent, newHeightPercent);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdate(field.id, { src: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    // Convertir porcentajes a pixeles
    const getPixelDimensions = () => {
        if (!containerRef.current) return { width: 100, height: 30 };
        return {
            width: (field.ancho / 100) * containerRef.current.offsetWidth,
            height: ((field.alto || 5) / 100) * containerRef.current.offsetHeight
        };
    };

    const dims = getPixelDimensions();

    const style: React.CSSProperties = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        position: 'absolute',
        left: `${field.x}%`,
        top: `${field.y}%`,
        zIndex: isDragging ? 100 : (isSelected ? 50 : 10),
        touchAction: 'none'
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            className="absolute"
        >
            <ResizableBox
                width={dims.width}
                height={dims.height}
                onResizeStop={handleResize}
                draggableOpts={{ enableUserSelectHack: false }}
                minConstraints={[50, 20]}
                maxConstraints={[800, 600]}
                // Manijas
                handle={
                    isSelected ? (
                        <div
                            className="react-resizable-handle react-resizable-handle-se absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-50 flex items-center justify-center p-1 bg-transparent"
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                        >
                            <div className="w-full h-full bg-blue-500 rounded-tl-lg shadow-sm border border-white" />
                        </div>
                    ) : <span />
                }
                className={cn(
                    "flex items-start p-0 select-none overflow-hidden h-full w-full relative transition-colors duration-200 group",
                    // Solo mostramos borde si está seleccionado o arrastrando, o hover suave
                    isDragging ? 'opacity-80 shadow-2xl scale-105 border border-blue-500 bg-blue-50/50' : '',
                    isSelected ? 'border border-primary bg-primary/5 ring-1 ring-primary/20' : 'hover:bg-slate-50/50 hover:border hover:border-dashed hover:border-slate-300'
                )}
            >
                {/* Visual Anchor Point (Esquina superior izquierda, donde empieza a renderizar el PDF) */}
                <div className={cn(
                    "absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-red-500 z-50 -translate-x-[1px] -translate-y-[1px]",
                    !isSelected && "opacity-0 group-hover:opacity-50"
                )} />
                <div className={cn(
                    "absolute -top-3 -left-1 text-[8px] text-red-500 bg-white px-1 rounded shadow-sm pointer-events-none whitespace-nowrap",
                    !isSelected && "hidden"
                )}>
                    {field.etiqueta}
                </div>

                <div className="flex w-full h-full overflow-hidden relative">
                    {/* Grip handle solo visible en hover/selection para no ensuciar la vista */}
                    <div {...listeners} {...attributes} className={cn(
                        "cursor-move absolute top-0 right-0 p-1 touch-none z-20 opacity-0 group-hover:opacity-100 transition-opacity",
                        isSelected && "opacity-100"
                    )}>
                        <GripVertical className="h-4 w-4 text-slate-400 bg-white/80 rounded" />
                    </div>

                    {field.tipo === 'imagen' ? (
                        <div className="flex-grow h-full flex items-center justify-center border border-dashed border-slate-300 m-1 bg-slate-50/50">
                            {field.src ? (
                                <img src={field.src} alt="Logo" className="max-w-full max-h-full object-contain pointer-events-none" />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-slate-400">
                                    <ImageIcon className="h-6 w-6 mb-1" />
                                    <span className="text-[10px] text-center leading-tight">Logo</span>
                                </div>
                            )}

                            {isSelected && (
                                <div
                                    className="absolute inset-0 bg-blue-500/10 cursor-pointer flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <span className="bg-white text-xs px-2 py-1 rounded shadow text-blue-600 font-medium">Cambiar Imagen</span>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleLogoUpload}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full p-[2px]">
                            {/* Renderizado simulado de texto tipo PDF */}
                            <span
                                style={{
                                    fontFamily: 'Helvetica, Arial, sans-serif',
                                    fontSize: '10px', // Aproximando el tamaño 10pt del PDF
                                    lineHeight: '1.2',
                                    color: '#000',
                                    whiteSpace: 'pre-wrap'
                                }}
                                className="pointer-events-none block"
                            >
                                {getExampleText(field.id)}
                            </span>
                        </div>
                    )}
                </div>
            </ResizableBox>
        </div>
    );
}

// Draggable Overlay para visualización mientras se arrastra
function DragItemOverlay({ field }: { field: any }) {
    if (!field) return null;
    return (
        <div className="bg-white/90 border-2 border-primary shadow-xl rounded p-2 px-4 flex items-center gap-2 w-[200px] cursor-grabbing z-[999] pointer-events-none">
            <GripVertical className="h-4 w-4 text-slate-400" />
            <span className="font-medium text-sm truncate">{field.etiqueta}</span>
        </div>
    )
}

interface PlantillaEditorProps {
    plantillaId?: string;
}

export function PlantillaEditor({ plantillaId }: PlantillaEditorProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Estado del Formulario
    const [nombre, setNombre] = useState("")
    const [tamanoPapel, setTamanoPapel] = useState<'carta' | 'media_carta'>('media_carta')
    const [imagenFondo, setImagenFondo] = useState<string | undefined>(undefined)
    const [activa, setActiva] = useState(false)
    const [imprimirFondo, setImprimirFondo] = useState(false)

    // Estado del Editor
    const [campos, setCampos] = useState<CampoPlantilla[]>([])
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
    const [pendingResizeFieldId, setPendingResizeFieldId] = useState<string | null>(null)
    const [activeDragItem, setActiveDragItem] = useState<any>(null) // Para el Overlay

    const containerRef = useRef<HTMLDivElement>(null)

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
    )

    // Droppable para el canvas (para recibir los items del sidebar)
    const { setNodeRef: setDroppableRef } = useDroppable({
        id: 'canvas-drop-area'
    });

    // Cargar datos
    useEffect(() => {
        if (plantillaId) {
            const loadData = async () => {
                setIsLoading(true)
                try {
                    const data = await plantillaService.getById(plantillaId)
                    if (data) {
                        setNombre(data.nombre)
                        setTamanoPapel(data.tamanoPapel)
                        setImagenFondo(data.imagenFondo)
                        setActiva(data.activa)
                        setImprimirFondo(data.imprimirFondo)
                        setCampos(data.campos)
                    } else {
                        toast({ title: "Error", description: "Plantilla no encontrada", variant: "destructive" })
                        router.push('/recetas/plantillas')
                    }
                } catch (error) {
                    toast({ title: "Error", description: "Error al cargar plantilla", variant: "destructive" })
                } finally {
                    setIsLoading(false)
                }
            }
            loadData()
        }
    }, [plantillaId, router, toast])

    // Lógica "Drop-to-Resize" (Move & Second Click)
    useEffect(() => {
        if (!pendingResizeFieldId) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const fieldIndex = campos.findIndex(c => c.id === pendingResizeFieldId);
            if (fieldIndex === -1) return;
            const field = campos[fieldIndex];

            const containerRect = containerRef.current.getBoundingClientRect();

            // Posición Top-Left del campo en pixeles absolutos
            const fieldLeftPx = (field.x / 100) * containerRect.width;
            const fieldTopPx = (field.y / 100) * containerRect.height;

            // Posición del mouse relativa al contenedor
            const mouseRelX = e.clientX - containerRect.left;
            const mouseRelY = e.clientY - containerRect.top;

            // Calcular nuevo ancho/alto asegurando mínimos
            // Permitimos "estirar" hacia derecha y abajo por simplicidad
            const newWidthPx = Math.max(30, mouseRelX - fieldLeftPx);
            const newHeightPx = Math.max(20, mouseRelY - fieldTopPx);

            // Convertir a porcentajes
            const newWidthPercent = (newWidthPx / containerRect.width) * 100;
            const newHeightPercent = (newHeightPx / containerRect.height) * 100;

            // Actualizar estado (sin disparar re-render de todo si es posible, pero React necesita state update)
            setCampos(prev => prev.map(f => {
                if (f.id === pendingResizeFieldId) {
                    return { ...f, ancho: newWidthPercent, alto: newHeightPercent };
                }
                return f;
            }));
        };

        const handleClick = (e: MouseEvent) => {
            // El segundo click finaliza el redimensionado
            e.stopPropagation();
            setPendingResizeFieldId(null);
            setSelectedFieldId(pendingResizeFieldId); // Dejarlo seleccionado
            toast({ title: "Campo colocado", description: "Puede ajustar la posición o tamaño manualmente ahora.", duration: 2000 });
        };

        // Delay para evitar que el 'MouseUp' del drop dispare inmediatamente el click (aunque click es MouseDown+Up)
        // Agregamos listeners con un pequeño timeout
        const timer = setTimeout(() => {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('click', handleClick, { capture: true, once: true });
        }, 100);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick, { capture: true });
        };
    }, [pendingResizeFieldId, campos]); // deps updated

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => setImagenFondo(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const handleResize = (id: string, widthPercent: number, heightPercent: number) => {
        setCampos(prev => prev.map(f => f.id === id ? { ...f, ancho: widthPercent, alto: heightPercent } : f));
    }

    const handleFieldUpdate = (id: string, updates: Partial<CampoPlantilla>) => {
        setCampos(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    }

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        // Identificar qué se está arrastrando para el Overlay visual
        if (String(active.id).startsWith('sidebar-')) {
            setActiveDragItem(active.data.current?.field);
        } else {
            // Es un campo del canvas
            setActiveDragItem(active.data.current?.field);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta, over } = event;
        setActiveDragItem(null);

        // Si soltamos fuera del contexto válido, verificar si estamos sobre el canvas
        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();

        // CASO 1: Nuevo Item desde Sidebar
        if (String(active.id).startsWith('sidebar-')) {
            // Si no detectamos 'over', pero el mouse está geométricamente dentro del canvas, lo aceptamos manual.
            const isOverCanvas = over && over.id === 'canvas-drop-area';

            if (!isOverCanvas) {
                // Check geometry fallback
                // active.rect.current.translated es la posición final del elemento DRAGGED
                const finalRect = active.rect.current?.translated;
                if (!finalRect) return;

                // Verificar intersección simple con el canvas
                const isInsideX = finalRect.left + finalRect.width / 2 >= containerRect.left && finalRect.left + finalRect.width / 2 <= containerRect.right;
                const isInsideY = finalRect.top + finalRect.height / 2 >= containerRect.top && finalRect.top + finalRect.height / 2 <= containerRect.bottom;

                if (!isInsideX || !isInsideY) return;
            }

            const fieldDef = active.data.current?.field;
            if (!fieldDef) return;

            // Calcular posición de dropeo relativa al canvas
            const dropRect = active.rect.current?.translated;

            if (dropRect) {
                const relativeX = dropRect.left - containerRect.left;
                const relativeY = dropRect.top - containerRect.top;

                // Convertir a %
                let xPercent = (relativeX / containerRect.width) * 100;
                let yPercent = (relativeY / containerRect.height) * 100;

                xPercent = Math.max(0, Math.min(95, xPercent));
                yPercent = Math.max(0, Math.min(95, yPercent));

                // Crear el nuevo campo
                const newField: CampoPlantilla = {
                    id: fieldDef.id, // Allow multiple logos? No, ID must be unique but fieldDef.id for logo isn't unique if we want multiples. But logic says replace if exists. For logo, let's treat it as Singleton for now or standard. Standard logic replaces by ID. User might want only one logo. Logic below: "fields.filter(c => c.id !== fieldDef.id)". So singleton.
                    etiqueta: fieldDef.etiqueta,
                    tipo: fieldDef.tipo,
                    visible: true,
                    x: xPercent,
                    y: yPercent,
                    ancho: fieldDef.defaultW || 15,
                    alto: fieldDef.defaultH || 5,
                    src: fieldDef.src // Inherit if any
                };

                // Si ya existe, lo reemplazamos
                const filtered = campos.filter(c => c.id !== fieldDef.id);
                setCampos([...filtered, newField]);

                // Activar modo Resize
                setPendingResizeFieldId(newField.id);
            }
            return;
        }

        // CASO 2: Mover Item Existente en Canvas
        const deltaXPercent = (delta.x / containerRect.width) * 100;
        const deltaYPercent = (delta.y / containerRect.height) * 100;

        setCampos(prev => prev.map(field => {
            if (field.id === active.id) {
                let newX = Math.max(0, Math.min(100 - field.ancho, field.x + deltaXPercent));
                let newY = Math.max(0, Math.min(100 - (field.alto || 5), field.y + deltaYPercent));
                return { ...field, x: newX, y: newY };
            }
            return field;
        }));
    };

    const handleSave = async () => {
        if (!nombre.trim()) {
            toast({ title: "Falta nombre", description: "Por favor asigne un nombre a la plantilla", variant: "destructive" })
            return
        }
        if (campos.length === 0) {
            toast({ title: "Sin campos", description: "Agregue al menos un campo a la plantilla", variant: "destructive" })
            return
        }
        setIsSaving(true)
        try {
            const formData: PlantillaRecetaFormData = {
                nombre, tamanoPapel, imagenFondo, activa, imprimirFondo, campos
            }
            if (plantillaId) {
                await plantillaService.update(plantillaId, formData)
                toast({ title: "Actualizado", description: "Plantilla actualizada correctamente" })
            } else {
                await plantillaService.create(formData)
                toast({ title: "Creado", description: "Nueva plantilla creada exitosamente" })
            }
            router.push('/recetas/plantillas')
        } catch (error) {
            console.error(error)
            toast({ title: "Error", description: "No se pudo guardar la plantilla", variant: "destructive" })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8" /></div>;

    const paperAspect = tamanoPapel === 'carta' ? '8.5/11' : '8.5/5.5';

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin} // Usa detección simple por puntero
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="h-[calc(100vh-100px)] flex flex-col gap-4">
                <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-4">
                        <Link href="/recetas/plantillas">
                            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold">{plantillaId ? "Editar Plantilla" : "Diseñar Nueva Plantilla"}</h2>
                            <div className="text-sm text-slate-500">
                                Drag & Drop: Suelte el campo y mueva el mouse para ajustar tamaño. Click para fijar.
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/recetas/plantillas">
                            <Button variant="outline">Cancelar</Button>
                        </Link>
                        <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600">
                            {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                            Guardar Plantilla
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow overflow-hidden">
                    <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2 pb-10">
                        {/* Config Panels */}
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div className="space-y-2">
                                    <Label>Nombre de Plantilla</Label>
                                    <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Receta Privada" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tamaño de Papel</Label>
                                    <Select value={tamanoPapel} onValueChange={(v: any) => setTamanoPapel(v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="carta">Carta (8.5 x 11 in)</SelectItem>
                                            <SelectItem value="media_carta">Media Carta (8.5 x 5.5 in)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center justify-between border p-2 rounded">
                                    <Label htmlFor="active" className="cursor-pointer">Plantilla Activa</Label>
                                    <Switch id="active" checked={activa} onCheckedChange={setActiva} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <h3 className="font-semibold flex items-center"><Layout className="mr-2 h-4 w-4" /> Imagen de Fondo</h3>
                                <div className="space-y-2">
                                    <Label>Imagen de la Plantilla</Label>
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            variant="outline"
                                            className="w-full h-auto py-4 border-dashed border-2 flex flex-col gap-2 items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 transition-colors"
                                            onClick={() => document.getElementById('bg-image-upload')?.click()}
                                        >
                                            <Upload className="h-8 w-8 mb-1" />
                                            <span className="text-sm font-medium">Seleccionar imagen de fondo</span>
                                            <span className="text-xs text-slate-400">Clic para subir (JPG, PNG)</span>
                                        </Button>
                                        <Input
                                            id="bg-image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between border p-2 rounded bg-slate-50">
                                    <div className="flex flex-col">
                                        <Label htmlFor="print-bg" className="text-sm font-medium">Imprimir Fondo</Label>
                                        <span className="text-[10px] text-muted-foreground">{imprimirFondo ? "Se imprimirá en el PDF final" : "Solo visible en editor"}</span>
                                    </div>
                                    <Switch id="print-bg" checked={imprimirFondo} onCheckedChange={setImprimirFondo} />
                                </div>
                                {imagenFondo && (
                                    <div className="mt-2 relative group rounded-md overflow-hidden border shadow-sm">
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                            <span className="text-white text-xs font-medium">Vista Previa</span>
                                        </div>
                                        <img src={imagenFondo} alt="Fondo" className="w-full h-32 object-cover bg-white" />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-7 w-7 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => setImagenFondo(undefined)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6 space-y-2">
                                <h3 className="font-semibold flex items-center mb-4"><Type className="mr-2 h-4 w-4" /> Datos Paciente y Tratamiento</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {AVAILABLE_FIELDS_DEF.filter(f =>
                                        f.id.startsWith('paciente_') ||
                                        ['diagnostico', 'alergias', 'medicamento_posologia', 'medicamentos_lista', 'instrucciones_lista', 'sugerencias'].includes(f.id)
                                    ).map(def => {
                                        const isAdded = campos.some(c => c.id === def.id);
                                        return <SidebarDraggableItem key={def.id} field={def} isAdded={isAdded} />;
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6 space-y-2">
                                <h3 className="font-semibold flex items-center mb-4"><Type className="mr-2 h-4 w-4" /> Datos Médico y Receta</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {AVAILABLE_FIELDS_DEF.filter(f =>
                                        !f.id.startsWith('paciente_') &&
                                        !['diagnostico', 'alergias', 'medicamento_posologia', 'medicamentos_lista', 'instrucciones_lista', 'sugerencias'].includes(f.id)
                                    ).map(def => {
                                        const isAdded = campos.some(c => c.id === def.id);
                                        return <SidebarDraggableItem key={def.id} field={def} isAdded={isAdded} />;
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Canvas Area */}
                    <div
                        className="lg:col-span-2 bg-slate-100 rounded-lg border shadow-inner overflow-auto p-8 flex items-start justify-center relative touch-none"
                    >
                        {/* Wrapper for Droppable */}
                        <div
                            ref={(node) => {
                                containerRef.current = node;
                                setDroppableRef(node);
                            }}
                            className={cn(
                                "relative bg-white shadow-lg transition-all duration-300",
                                pendingResizeFieldId && "cursor-crosshair ring-2 ring-blue-400 ring-offset-4" // Visual cue for resizing
                            )}
                            style={{
                                width: '100%',
                                maxWidth: '800px',
                                aspectRatio: paperAspect
                            }}
                            onClick={() => {
                                if (!pendingResizeFieldId) setSelectedFieldId(null)
                            }}
                        >
                            {imagenFondo && (
                                <img src={imagenFondo} className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-50" alt="Guía" />
                            )}

                            <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 pointer-events-none opacity-10">
                                {[...Array(10)].map((_, i) => <div key={`v-${i}`} className="border-r border-black h-full" />)}
                                {[...Array(10)].map((_, i) => <div key={`h-${i}`} className="border-b border-black w-full" />)}
                            </div>

                            {campos.map(field => (
                                <CanvasDraggableField
                                    key={field.id}
                                    field={field}
                                    isSelected={selectedFieldId === field.id || pendingResizeFieldId === field.id}
                                    onSelect={() => setSelectedFieldId(field.id)}
                                    onResize={handleResize}
                                    onUpdate={handleFieldUpdate}
                                    containerRef={containerRef}
                                />
                            ))}

                            {campos.length === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-300 pointer-events-none">
                                    <div className="text-center">
                                        <Layout className="h-16 w-16 mx-auto mb-2" />
                                        <p>Arrastre campos aquí</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay para arrastre visual suave */}
            <DragOverlay>
                {activeDragItem ? <DragItemOverlay field={activeDragItem} /> : null}
            </DragOverlay>
        </DndContext>
    )
}
