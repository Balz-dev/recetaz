"use client"

/**
 * Editor de Plantillas de Recetas Médicas
 * 
 * Permite al usuario diseñar plantillas personalizadas mediante drag & drop,
 * configurando posición y tamaño de campos de datos médicos, de paciente y de receta.
 */

import React, { useState, useEffect, useRef } from "react"
import { DndContext, useDraggable, useDroppable, DragEndEvent, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay, pointerWithin, Modifier } from "@dnd-kit/core"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import { PlantillaReceta, CampoPlantilla, PlantillaRecetaFormData } from "@/types"
import { plantillaService } from "@/features/recetas/services/plantilla.service"
import { medicoService } from "@/features/config-medico/services/medico.service"
import { SPECIALTIES_CONFIG } from "@/shared/config/specialties"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Switch } from "@/shared/components/ui/switch"
import { Card, CardContent } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { Loader2, Save, Layout, Type, GripVertical, Trash, ArrowLeft, Image as ImageIcon, Upload, ChevronDown, ChevronRight, Settings, UserCircle, FileText, Stethoscope } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

/**
 * Obtiene el texto de ejemplo para un campo específico.
 * 
 * @param id - Identificador único del campo
 * @returns Texto de ejemplo representativo del contenido del campo
 */
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
        receta_folio: "12345",
        receta_fecha: "16/10/2025",
        diagnostico: "Infección respiratoria aguda (J00)",
        tratamiento_completo: "1. AMOXICILINA (Amoxil) - 500 mg\n   Cápsulas. Oral.\n   Tomar: 1 cápsula cada 8 horas por 7 días.\n   Indicaciones: Tomar con alimentos.\n\n2. PARACETAMOL - 500 mg\n   Tabletas. Oral.\n   Tomar: 1 tableta cada 6 horas si hay dolor.",
        instrucciones_generales: "RECOMENDACIONES:\n• Beber abundantes líquidos.\n• Reposo relativo por 3 días.\n• Evitar cambios bruscos de temperatura.\n• Si presenta fiebre mayor a 38°C acudir a urgencias."
    };

    // Fallback genérico para campos dinámicos
    if (!examples[id]) {
        if (id.startsWith('datos_personales_')) return "Dato Personal";
        if (id.startsWith('datos_medicos_')) return "Dato Médico";
        if (id.startsWith('exploracion_')) return "Exploración";
        if (id.startsWith('obstetricos_')) return "Dato Obstétrico";
        if (id.startsWith('gineco_')) return "Gineco-Obstétrico";
        if (id.startsWith('salud_')) return "Salud Mental";
        if (id.startsWith('antecedentes_')) return "Antecedente";
        return "Texto de Ejemplo";
    }

    return examples[id];
}

/**
 * Calcula el ancho óptimo de un campo basado en su texto de ejemplo.
 * 
 * @param id - Identificador del campo
 * @returns Ancho en porcentaje del canvas (mínimo: 5%, máximo: 95%)
 */
function calcularAnchoOptimo(id: string): number {
    const texto = getExampleText(id);
    // Aproximación: ~0.6% por carácter (considerando font-size 14px)
    const anchoPorCaracter = 0.6;
    const anchoCalculado = texto.length * anchoPorCaracter + 2; // +2% para padding

    // Límites razonables
    return Math.max(5, Math.min(95, anchoCalculado));
}

interface EditorFieldDef {
    id: string;
    etiqueta: string;
    tipo: 'texto' | 'imagen' | 'fecha' | 'lista';
    defaultW: number;
    defaultH: number;
    src?: string;
}

/**
 * Definición de campos BASE disponibles para agregar a la plantilla.
 * Los anchos se calculan automáticamente basándose en el contenido de ejemplo.
 */
const BASE_FIELDS_DEF: EditorFieldDef[] = [
    // Datos del Médico (Visible en summary cerrado)
    { id: 'medico_nombre', etiqueta: 'Nombre del Médico', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, defaultH: 2.5 },
    { id: 'medico_especialidad', etiqueta: 'Especialidad', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, defaultH: 2.5 },
    { id: 'medico_institucion_gral', etiqueta: 'Institución (Gral)', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, defaultH: 2.5 },
    { id: 'medico_cedula_gral', etiqueta: 'Cédula (Gral)', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, defaultH: 2.5 },
    { id: 'medico_institucion_esp', etiqueta: 'Institución (Esp)', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, defaultH: 2.5 },
    { id: 'medico_cedula_esp', etiqueta: 'Cédula (Esp)', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, defaultH: 2.5 },
    { id: 'medico_domicilio', etiqueta: 'Domicilio Consultorio', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, defaultH: 5 },
    { id: 'medico_contacto', etiqueta: 'Número de Contacto', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, defaultH: 2.5 },
    { id: 'medico_correo', etiqueta: 'Correo Electrónico', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, defaultH: 2.5 },
    { id: 'medico_web', etiqueta: 'Sitio Web', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, defaultH: 2.5 },
    { id: 'medico_logo', etiqueta: 'Logo / Imagen', tipo: 'imagen', defaultW: 20, defaultH: 15 },

    // Datos del Paciente (Prioridad Alta)
    { id: 'fecha', etiqueta: 'Fecha de Consulta', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, defaultH: 2.5 },
    { id: 'paciente_nombre', etiqueta: 'Nombre Paciente', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, defaultH: 2.5 },
    { id: 'paciente_edad', etiqueta: 'Edad', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, defaultH: 2.5 },
    { id: 'paciente_peso', etiqueta: 'Peso', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, defaultH: 2.5 },
    { id: 'paciente_talla', etiqueta: 'Talla', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, defaultH: 2.5 },

    // Datos de la Receta / Cuerpo
    { id: 'receta_folio', etiqueta: 'Folio Receta', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, defaultH: 2.5 },
    { id: 'receta_fecha', etiqueta: 'Fecha de Emisión', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, defaultH: 2.5 },

    // Bloques Consolidados
    { id: 'diagnostico', etiqueta: 'Diagnóstico', tipo: 'texto', defaultW: 60, defaultH: 5 },
    { id: 'tratamiento_completo', etiqueta: 'Tratamiento Completo', tipo: 'lista', defaultW: 90, defaultH: 40 },
    { id: 'instrucciones_generales', etiqueta: 'Instrucciones Generales', tipo: 'texto', defaultW: 90, defaultH: 20 },
] as EditorFieldDef[];

/**
 * Componente de item arrastrable en el sidebar.
 * Muestra un campo disponible que puede ser arrastrado al canvas.
 * 
 * @param props - Propiedades del componente
 * @param props.field - Definición del campo con id, etiqueta, tipo y dimensiones por defecto
 * @param props.isAdded - Indica si el campo ya fue agregado al canvas
 * @returns Elemento JSX del botón arrastrable
 */
function SidebarDraggableItem({ field, isAdded }: { field: EditorFieldDef, isAdded: boolean }) {
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



/**
 * Determina si un campo debe permitir redimensionamiento en altura.
 * Los campos de imagen, lista y multilinea permiten ajustar su altura.
 * 
 * @param field - Campo de plantilla a evaluar
 * @returns true si el campo permite redimensionar altura, false en caso contrario
 */
function canResizeHeight(field: CampoPlantilla): boolean {
    if (field.tipo === 'imagen') return true;
    if (field.tipo === 'lista') return true;

    // Lista explícita de campos multilinea
    const MULTILINE_IDS = [
        'diagnostico',
        'tratamiento_completo',
        'instrucciones_generales',
        'medico_domicilio',
        // Dinámicos tipo textarea
        'datos_factoresRiesgo',
        'datos_antecedentes'
    ];

    return MULTILINE_IDS.includes(field.id);
}

/**
 * Componente de campo arrastrable y redimensionable en el canvas.
 * Permite mover, seleccionar, redimensionar y actualizar campos de la plantilla.
 * 
 * @param props - Propiedades del componente
 * @param props.field - Campo de plantilla a renderizar
 * @param props.isSelected - Indica si el campo está actualmente seleccionado
 * @param props.onSelect - Callback al seleccionar el campo
 * @param props.onResize - Callback al redimensionar el campo (id, anchoPercent, altoPercent)
 * @param props.onUpdate - Callback al actualizar propiedades del campo (id, updates)
 * @param props.containerRef - Referencia al contenedor canvas para cálculos de posición
 * @returns Elemento JSX del campo arrastrable
 */
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
    // Permitir redimensionar en ambos ejes para mejorar flexibilidad del editor
    const allowHeight = true;

    /**
     * Maneja el evento de redimensionamiento del campo EN TIEMPO REAL.
     * Convierte dimensiones de píxeles a porcentajes del canvas.
     * Se llama tanto durante el resize (onResize) como al finalizar (onResizeStop).
     */
    const handleResize = (e: React.SyntheticEvent, data: ResizeCallbackData) => {
        if (!containerRef.current) return;
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;

        const newWidthPercent = (data.size.width / containerWidth) * 100;
        const newHeightPercent = (data.size.height / containerHeight) * 100;

        onResize(field.id, newWidthPercent, newHeightPercent);
    };

    /**
     * Maneja la carga de imagen para campos de tipo 'imagen'.
     * Convierte la imagen a Base64 y actualiza el campo.
     */
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

    /**
     * Convierte las dimensiones del campo de porcentajes a píxeles.
     * Necesario para el componente ResizableBox que trabaja con píxeles.
     */
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
            className={cn(
                "absolute hover:z-20",
                isSelected && "z-50"
            )}
        >
            <ResizableBox
                width={dims.width}
                height={dims.height}
                axis={allowHeight ? 'both' : 'x'}
                onResize={handleResize}
                onResizeStop={handleResize}
                resizeHandles={isSelected ? ['se'] : []}
                minConstraints={[50, 20]}
                maxConstraints={[800, 600]}
                // Manija de redimensionamiento personalizada
                handle={
                    isSelected ? (
                        <div
                            className="react-resizable-handle react-resizable-handle-se absolute bottom-0 right-0 w-6 h-6 z-[70] cursor-se-resize"
                            style={{ pointerEvents: 'auto' }}
                        >
                            {/* Indicador visual de la manija */}
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-600 shadow-lg border-2 border-white rounded-tl-lg" />
                        </div>
                    ) : undefined
                }
                className={cn(
                    "flex items-start p-0 select-none overflow-hidden h-full w-full relative transition-colors duration-200 group",
                    // Solo mostramos borde si está seleccionado o arrastrando, o hover suave
                    isDragging ? 'opacity-80 shadow-2xl scale-105 border border-blue-500 bg-blue-50/50' : '',
                    isSelected ? 'border-2 border-blue-500 bg-blue-50/10 ring-2 ring-blue-300/30' : 'hover:bg-slate-50/50 hover:border hover:border-dashed hover:border-slate-300'
                )}
            >
                {/* Capa para drag (Invisible Overlay) - ENCIMA del contenido, DEBAJO de la manija */}
                <div
                    className="absolute inset-0 cursor-grab active:cursor-grabbing hover:bg-blue-500/5 transition-colors"
                    style={{ zIndex: 20, touchAction: 'none' }}
                    {...listeners}
                    {...attributes}
                />
                {/* Visual Anchor Point (Esquina INFERIOR izquierda - Baseline) */}
                <div className={cn(
                    "absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-red-600 z-50 -translate-x-[1px] translate-y-[1px]",
                    !isSelected && "opacity-0 group-hover:opacity-50"
                )} />

                {/* Etiqueta flotante */}
                <div className={cn(
                    "absolute -top-4 -left-1 text-[9px] font-bold text-white bg-blue-600/90 px-1.5 py-0.5 rounded shadow-sm pointer-events-none whitespace-nowrap z-50",
                    !isSelected && "hidden"
                )}>
                    {field.etiqueta}
                </div>

                <div className="flex w-full h-full overflow-hidden relative" style={{ zIndex: 10 }}>
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
                                    onMouseDown={(e) => e.stopPropagation()} // Stop drag to allow click
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
                        <div className={cn(
                            "w-full h-full",
                            // Ajustes para campos de texto (input vs textarea visual)
                            allowHeight ? "p-[2px]" : "flex items-end pb-[1px] px-[2px]" // Para una linea, alineamos al 'baseline' visualmente
                        )}>
                            {/* Renderizado simulado de texto tipo PDF */}
                            <span
                                style={{
                                    fontFamily: 'Helvetica, Arial, sans-serif',
                                    fontSize: '14px',
                                    lineHeight: '1.1',
                                    color: '#000',
                                    whiteSpace: allowHeight ? 'pre-wrap' : 'nowrap',
                                    overflow: 'hidden'
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

/**
 * Componente de sección colapsable "Accordion" para el Sidebar.
 */
function SidebarAccordion({ title, icon, children, defaultOpen = false }: { title: string, icon: React.ReactNode, children: React.ReactNode, defaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <Card className="overflow-hidden">
            <div
                className="flex items-center justify-between p-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors border-b"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center font-medium text-sm text-slate-700">
                    <span className="mr-2 text-slate-500">{icon}</span>
                    {title}
                </div>
                {isOpen ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
            </div>

            {isOpen && (
                <div className="p-3 bg-white animate-in slide-in-from-top-1 duration-200">
                    {children}
                </div>
            )}
        </Card>
    );
}

/**
 * Overlay visual que se muestra durante el arrastre de un campo.
 * Muestra una vista previa minimalista con el texto de ejemplo y un ancla visual.
 * 
 * @param props - Propiedades del componente
 * @param props.field - Campo siendo arrastrado
 * @returns Elemento JSX del overlay o null si no hay campo
 */
function DragItemOverlay({ field }: { field: any }) {
    if (!field) return null;

    const text = getExampleText(field.id);
    const textShort = text.length > 40 ? text.substring(0, 40) + "..." : text;

    return (
        // El DragOverlay de dnd-kit coloca el (0,0) del componente en la posición del puntero.
        // Desplazamos el contenido hacia arriba el 100% de su altura para que
        // la esquina inferior izquierda coincida con el cursor.
        <div className="flex flex-col items-start justify-end pointer-events-none opacity-90 origin-bottom-left"
            style={{ transform: 'translate(0, -100%)' }}
        >
            <div className="relative">
                {/* Vista previa del contenido */}
                <div
                    style={{
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontSize: '12px',
                        lineHeight: '1',
                        color: '#000',
                        whiteSpace: 'pre-wrap',
                        maxWidth: '200px'
                    }}
                    className="bg-white/90 border border-slate-300 px-2 py-1 rounded shadow-sm mb-0.5"
                >
                    {textShort}
                </div>

                {/* Ancla visual en la esquina inferior izquierda */}
                <div className="w-3 h-3 border-l-2 border-b-2 border-red-600 absolute -bottom-1 -left-1 z-50 rounded-bl-sm bg-transparent" />
            </div>
        </div>
    )
}

/**
 * Propiedades del componente PlantillaEditor.
 */
interface PlantillaEditorProps {
    /** ID de la plantilla a editar (opcional, undefined para nueva plantilla) */
    plantillaId?: string;
}

/**
 * Componente principal del editor de plantillas de recetas.
 * Permite diseñar plantillas mediante drag & drop con las siguientes funcionalidades:
 * - Arrastrar campos desde el sidebar al canvas
 * - Posicionar campos con precisión
 * - Redimensionar campos manualmente
 * - Configurar imagen de fondo y opciones de impresión
 * - Guardar/actualizar plantillas en IndexedDB
 * 
 * @param props - Propiedades del componente
 * @param props.plantillaId - ID de plantilla existente para editar, o undefined para crear nueva
 * @returns Componente JSX del editor de plantillas
 */
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
    const [availableFields, setAvailableFields] = useState<EditorFieldDef[]>(BASE_FIELDS_DEF)
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
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

    // Cargar campos dinámicos de la especialidad
    useEffect(() => {
        const loadSpecialtyFields = async () => {
            const config = await medicoService.get();
            if (config) {
                const key = config.especialidadKey || 'general';
                const specialtyConfig = SPECIALTIES_CONFIG[key];

                if (specialtyConfig) {
                    const newFields: EditorFieldDef[] = [];

                    // Mapear campos de paciente
                    specialtyConfig.patientFields?.forEach(f => {
                        newFields.push({
                            id: `datos_${f.id}`, // Convención: datos_ + id de especialidad
                            etiqueta: f.label,
                            tipo: 'texto',
                            defaultW: 20,
                            defaultH: f.type === 'textarea' ? 5 : 2.5
                        });
                    });

                    // Mapear campos de receta
                    specialtyConfig.prescriptionFields?.forEach(f => {
                        newFields.push({
                            id: `datos_${f.id}`,
                            etiqueta: f.label,
                            tipo: 'texto',
                            defaultW: 20,
                            defaultH: f.type === 'textarea' ? 5 : 2.5
                        });
                    });

                    setAvailableFields([...BASE_FIELDS_DEF, ...newFields]);
                }
            }
        };
        loadSpecialtyFields();
    }, []);




    // Teclado para movimiento preciso
    useEffect(() => {
        if (!selectedFieldId) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                setCampos(prev => prev.map(f => {
                    if (f.id === selectedFieldId) {
                        const step = e.shiftKey ? 1.0 : 0.1; // Shift para mover más rápido
                        let { x, y } = f;

                        // Ajustamos x/y
                        if (e.key === 'ArrowUp') y -= step;
                        if (e.key === 'ArrowDown') y += step;
                        if (e.key === 'ArrowLeft') x -= step;
                        if (e.key === 'ArrowRight') x += step;

                        // Límites
                        x = Math.max(0, Math.min(100 - f.ancho, x));
                        y = Math.max(0, Math.min(100 - (f.alto || 5), y));

                        return { ...f, x, y };
                    }
                    return f;
                }));
            }

            // Delete key to remove field
            if (e.key === 'Delete' || e.key === 'Backspace') {
                // Confirmación podría ser molesta si es accidental, pero es estándar en editores
                setCampos(prev => prev.filter(f => f.id !== selectedFieldId));
                setSelectedFieldId(null);
                toast({ title: "Campo eliminado" });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedFieldId]);

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

    const cursorStartRef = useRef<{ x: number, y: number } | null>(null);

    // Modificador para alinear la esquina inferior izquierda al cursor
    // ESTRATEGIA: Calcular el offset constante entre el cursor y el elemento al inicio.
    // Sumar ese offset al delta normal.
    // Transform Final = Delta + (CursorInicio - ElementoInicioTopLeft)
    // Resultado: El TopLeft visual del overlay viaja "con el cursor" pero desplazado por el offset para que parezca que el cursor está en la esquina inf-izq. (Esto depende del CSS translate(0, -100%)) 
    // WAIT: Si queremos que el cursor este en la esquina INFERIOR IZQUIERDA del elemento.
    // Overlay tiene translate(0, -100%). O sea, visualmente "sube". Su pivote visual es su esquina inferior izquierda.
    // Entonces queremos que el pivote visual (Overlay 0,0) esté en el Cursor.
    // Por defecto, Overlay 0,0 está en ElementoInicioTopLeft.
    // Queremos mover Overlay 0,0 a Cursor.
    // Cursor = ElementoInicioTopLeft + OffsetAlHacerClick + Delta.
    // Entonces el Transform debe ser: (Cursor - ElementoInicioTopLeft).
    // = (ElementoInicioTopLeft + OffsetAlHacerClick + Delta) - ElementoInicioTopLeft
    // = OffsetAlHacerClick + Delta.
    // Dnd-kit nos da Delta en `transform`.
    // Solo necesitamos sumar `OffsetAlHacerClick`.
    // `OffsetAlHacerClick` lo calculamos en el modifier usando `activatorEvent` (que es el Start Event).

    const snapToCursor = React.useCallback<Modifier>(({ transform, activatorEvent, draggingNodeRect }) => {
        if (activatorEvent && draggingNodeRect) {
            // Unificar eventos de mouse y touch (del evento INICIAL)
            let startClientX = 0;
            let startClientY = 0;

            if ('clientX' in activatorEvent) {
                startClientX = (activatorEvent as MouseEvent).clientX;
                startClientY = (activatorEvent as MouseEvent).clientY;
            } else if ('touches' in activatorEvent && (activatorEvent as TouchEvent).touches.length > 0) {
                startClientX = (activatorEvent as TouchEvent).touches[0].clientX;
                startClientY = (activatorEvent as TouchEvent).touches[0].clientY;
            } else {
                return transform;
            }

            // Offset constante = CursorInicio - ElementoInicio
            const offsetX = startClientX - draggingNodeRect.left;
            const offsetY = startClientY - draggingNodeRect.top;

            // Retornamos Delta + OffsetConstante
            return {
                ...transform,
                x: transform.x + offsetX,
                y: transform.y + offsetY,
            };
        }
        return transform;
    }, []);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;

        // Capturar posición inicial del cursor es complicado obtener directamente del evento DragStartEvent de dnd-kit limpio
        // pero podemos inferirla si fuera necesario. Sin embargo, para Drop logic:
        // DropPos = StartCursor + Delta.
        // Necesitamos StartCursor.
        // Lo podemos obtener del `activatorEvent` dentro del evento, si es PointerEvent.

        let startX = 0;
        let startY = 0;
        if (event.activatorEvent) {
            if ('clientX' in event.activatorEvent) {
                startX = (event.activatorEvent as MouseEvent).clientX;
                startY = (event.activatorEvent as MouseEvent).clientY;
            } else if ('touches' in event.activatorEvent && (event.activatorEvent as TouchEvent).touches.length > 0) {
                startX = (event.activatorEvent as TouchEvent).touches[0].clientX;
                startY = (event.activatorEvent as TouchEvent).touches[0].clientY;
            }
        }
        cursorStartRef.current = { x: startX, y: startY };

        // Identificar qué se está arrastrando para el Overlay visual
        if (String(active.id).startsWith('sidebar-')) {
            setActiveDragItem(active.data.current?.field);
        } else {
            setActiveDragItem(null);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        setActiveDragItem(null);

        // Si soltamos fuera del contexto válido
        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();

        // CASO 1: Nuevo Item desde Sidebar
        if (String(active.id).startsWith('sidebar-')) {
            // Calcular posición de soltado usando CursorInicio + Delta
            if (!cursorStartRef.current) return;

            const dropX = cursorStartRef.current.x + delta.x;
            const dropY = cursorStartRef.current.y + delta.y;

            // Coordenadas relativas al canvas.
            // El dropX, dropY corresponden a la posición del cursor (que es la esquina inferior izquierda visual)
            const baselineY = dropY - containerRect.top;
            const baselineX = dropX - containerRect.left;

            const fieldDef = active.data.current?.field;
            if (!fieldDef) return;

            // Altura por defecto del campo
            const targetHPercent = fieldDef.defaultH || (canResizeHeight({ ...fieldDef, id: fieldDef.id } as any) ? 10 : 2.5);
            const fieldHeightPx = (targetHPercent / 100) * containerRect.height;

            // Field.y (Top) = BaselineY - Height
            const topPx = baselineY - fieldHeightPx;

            // Convertir a %
            let xPercent = (baselineX / containerRect.width) * 100;
            let yPercent = (topPx / containerRect.height) * 100;

            xPercent = Math.max(0, Math.min(100 - (fieldDef.defaultW || 10), xPercent));
            yPercent = Math.max(0, Math.min(100 - targetHPercent, yPercent));

            const newField: CampoPlantilla = {
                id: fieldDef.id,
                etiqueta: fieldDef.etiqueta,
                tipo: fieldDef.tipo,
                visible: true,
                x: xPercent,
                y: yPercent,
                ancho: fieldDef.defaultW || 15,
                alto: targetHPercent,
                src: fieldDef.src
            };

            const filtered = campos.filter(c => c.id !== fieldDef.id);
            setCampos([...filtered, newField]);
            // Seleccionar el campo recién agregado
            setSelectedFieldId(newField.id);
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
                        <SidebarAccordion
                            title="Configuración General"
                            icon={<Settings className="h-4 w-4" />}
                            defaultOpen={true}
                        >
                            <div className="space-y-4 pt-2">
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
                                    <Label htmlFor="active" className="cursor-pointer font-normal">Activa</Label>
                                    <Switch id="active" checked={activa} onCheckedChange={setActiva} />
                                </div>
                                <div className="space-y-2 border-t pt-2">
                                    <Label>Fondo</Label>
                                    <div className="flex flex-col gap-2">
                                        {!imagenFondo ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full border-dashed"
                                                onClick={() => document.getElementById('bg-image-upload')?.click()}
                                            >
                                                <Upload className="h-3 w-3 mr-2" />
                                                Subir Imagen
                                            </Button>
                                        ) : (
                                            <div className="flex items-center justify-between bg-slate-50 p-2 rounded">
                                                <span className="text-xs text-blue-600 truncate max-w-[120px]">Imagen Cargada</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 text-red-500"
                                                    onClick={() => setImagenFondo(undefined)}
                                                >
                                                    <Trash className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        )}
                                        <Input id="bg-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="print-bg" className="text-xs">Imprimir Fondo</Label>
                                            <Switch id="print-bg" checked={imprimirFondo} onCheckedChange={setImprimirFondo} className="scale-75 origin-right" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SidebarAccordion>

                        <SidebarAccordion
                            title="Datos del Paciente"
                            icon={<UserCircle className="h-4 w-4" />}
                            defaultOpen={true}
                        >
                            <div className="grid grid-cols-1 gap-2">
                                {availableFields.filter(f =>
                                    f.id.startsWith('paciente_') || f.id.startsWith('datos_') || f.id === 'fecha'
                                ).map(def => {
                                    const isAdded = campos.some(c => c.id === def.id);
                                    return <SidebarDraggableItem key={def.id} field={def} isAdded={isAdded} />;
                                })}
                            </div>
                        </SidebarAccordion>

                        <SidebarAccordion
                            title="Cuerpo de la Receta"
                            icon={<FileText className="h-4 w-4" />}
                            defaultOpen={true}
                        >
                            <div className="grid grid-cols-1 gap-2">
                                {availableFields.filter(f =>
                                    ['tratamiento_completo', 'instrucciones_generales', 'receta_folio', 'receta_fecha'].includes(f.id)
                                ).map(def => {
                                    const isAdded = campos.some(c => c.id === def.id);
                                    return <SidebarDraggableItem key={def.id} field={def} isAdded={isAdded} />;
                                })}
                            </div>
                        </SidebarAccordion>

                        <SidebarAccordion
                            title="Datos del Médico"
                            icon={<Stethoscope className="h-4 w-4" />}
                            defaultOpen={false}
                        >
                            <div className="grid grid-cols-1 gap-2">
                                {availableFields.filter(f =>
                                    f.id.startsWith('medico_')
                                ).map(def => {
                                    const isAdded = campos.some(c => c.id === def.id);
                                    return <SidebarDraggableItem key={def.id} field={def} isAdded={isAdded} />;
                                })}
                            </div>
                        </SidebarAccordion>

                        {/* <SidebarAccordion
                            title="Configuración General"
                            icon={<Settings className="h-4 w-4" />}
                            defaultOpen={false}
                        >
                            <div className="space-y-4 pt-2">
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
                                    <Label htmlFor="active" className="cursor-pointer font-normal">Activa</Label>
                                    <Switch id="active" checked={activa} onCheckedChange={setActiva} />
                                </div>
                                <div className="space-y-2 border-t pt-2">
                                    <Label>Fondo</Label>
                                    <div className="flex flex-col gap-2">
                                        {!imagenFondo ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full border-dashed"
                                                onClick={() => document.getElementById('bg-image-upload')?.click()}
                                            >
                                                <Upload className="h-3 w-3 mr-2" />
                                                Subir Imagen
                                            </Button>
                                        ) : (
                                            <div className="flex items-center justify-between bg-slate-50 p-2 rounded">
                                                <span className="text-xs text-blue-600 truncate max-w-[120px]">Imagen Cargada</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 text-red-500"
                                                    onClick={() => setImagenFondo(undefined)}
                                                >
                                                    <Trash className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        )}
                                        <Input id="bg-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="print-bg" className="text-xs">Imprimir Fondo</Label>
                                            <Switch id="print-bg" checked={imprimirFondo} onCheckedChange={setImprimirFondo} className="scale-75 origin-right" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SidebarAccordion> */}
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
                            )}
                            style={{
                                width: '100%',
                                maxWidth: '800px',
                                aspectRatio: paperAspect
                            }}
                            onClick={() => {
                                setSelectedFieldId(null)
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
                                    isSelected={selectedFieldId === field.id}
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
            <DragOverlay modifiers={[snapToCursor]} style={{ zIndex: 9999 }} dropAnimation={null}>
                {activeDragItem ? <DragItemOverlay field={activeDragItem} /> : null}
            </DragOverlay>
        </DndContext>
    )
}
