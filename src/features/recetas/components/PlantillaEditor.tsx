"use client"

/**
 * Editor de Plantillas de Recetas Médicas
 * 
 * Herramienta visual tipo Drag & Drop para diseñar el formato de impresión de las recetas.
 * 
 * Funcionalidades principales:
 * - Lienzo interactivo (Canvas) con soporte para arrastrar y soltar.
 * - Barra lateral de herramientas con campos disponibles (datos médico, paciente, receta).
 * - Gestión de elementos decorativos (imágenes, textos estáticos, formas).
 * - Configuración de propiedades por elemento (tamaño, posición, fuente).
 * - Soporte para importación/exportación de plantillas (JSON).
 * - Integración con galería de plantillas predefinidas.
 */

import React, { useState, useEffect, useRef } from "react"
import { DndContext, useDraggable, useDroppable, DragEndEvent, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay, pointerWithin, Modifier } from "@dnd-kit/core"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import { PlantillaReceta, CampoPlantilla, PlantillaRecetaFormData, EspecialidadCatalogo } from "@/types"
import { plantillaService } from "@/features/recetas/services/plantilla.service"
import { medicoService } from "@/features/config-medico/services/medico.service"
import { db } from "@/shared/db/db.config"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Switch } from "@/shared/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/shared/components/ui/dialog"
import { ToggleLeft, Trash2, Copy, Download } from "lucide-react"
import { Loader2, Plus, Save, Layout, Type, GripVertical, Trash, ArrowLeft, Image as ImageIcon, Upload, ChevronDown, ChevronRight, Settings, UserCircle, FileText, Stethoscope, Minus, Square, Palette } from "lucide-react"
import { ToolbarPropiedades } from "./ToolbarPropiedades"
import { PlantillaGallery } from "./PlantillaGallery"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

/**
 * Obtiene el texto de ejemplo para un campo específico.
 * 
 * @param id - Identificador único del campo
 * @returns Texto de ejemplo representativo del contenido del campo
 */
/**
 * Obtiene el texto de ejemplo para un campo específico.
 * 
 * @param id - Identificador único del campo
 * @param medicoConfig - Configuración real del médico para datos dinámicos
 * @returns Texto de ejemplo representativo del contenido del campo
 */
function getExampleText(id: string, medicoConfig?: any): string {
    const examples: Record<string, string> = {
        medico_nombre: medicoConfig?.nombre || "Dr. Juan Pérez",
        medico_especialidad: medicoConfig?.especialidad || "Cardiología Clínica",
        medico_institucion_gral: medicoConfig?.institucion_gral || "Universidad Nacional",
        medico_cedula_gral: medicoConfig?.cedula || "12345678",
        medico_institucion_esp: medicoConfig?.institucion_esp || "Hospital General",
        medico_cedula_esp: medicoConfig?.cedula_esp || "87654321",
        medico_domicilio: medicoConfig?.direccion || "Av. Reforma 123, Col. Centro, CDMX",
        medico_contacto: medicoConfig?.telefono || "55 1234 5678",
        medico_correo: medicoConfig?.correo || "dr.juan@email.com",
        medico_web: medicoConfig?.web || "www.drjuan.com",
        fecha: "16 Oct 2025",
        paciente_nombre: "María González López",
        paciente_edad: "34 años",
        paciente_peso: "68 kg",
        paciente_talla: "1.65 m",
        receta_folio: "12345",
        receta_fecha: "16/10/2025",
        diagnostico: "Infección respiratoria aguda (J00)",
        tratamiento_completo: "1. AMOXICILINA (Amoxil) - 500 mg\n   Cápsulas. Oral.\n   Tomar: 1 cápsula cada 8 horas por 7 días.\n   Indicaciones: Tomar con alimentos.\n\n2. PARACETAMOL - 500 mg\n   Tabletas. Oral.\n   Tomar: 1 tableta cada 6 horas si hay dolor.",
        instrucciones_generales: "RECOMENDACIONES GENERALES:\n• Beber abundantes líquidos. Reposo relativo por 3 días. Si presenta fiebre mayor a 38°C acudir a urgencias."
    };

    const lowerId = id.toLowerCase();

    // Signos Vitales y Medidas (Comunes y Específicos)
    if (lowerId.includes('presion') || lowerId.includes('t_a') || lowerId.includes('ta_brazo') || lowerId.includes('tension')) return "120/80 mmHg";
    if (lowerId.includes('temp')) return "36.5 °C";
    if (lowerId.includes('frecuenciacardiaca') || lowerId.includes('fc') || lowerId.includes('frecuencia_c')) return "75 lpm";
    if (lowerId.includes('frecuenciarespiratoria') || lowerId.includes('fr') || lowerId.includes('frecuencia_r')) return "18 rpm";
    if (lowerId.includes('sat') || lowerId.includes('oxigeno') || lowerId.includes('saturacion')) return "98%";
    if (lowerId.includes('glucosa')) return "95 mg/dL";
    if (lowerId.includes('talla') || lowerId.includes('estatura')) return "1.75 m";
    if (lowerId.includes('peso')) return "75 kg";
    if (lowerId.includes('perimetrocefalico')) return "45 cm";
    if (lowerId.includes('imc')) return "24.5";

    // Oftalmología
    if (lowerId.includes('av_od') || lowerId.includes('av_oi')) return "20/20";
    if (lowerId.includes('pio_od') || lowerId.includes('pio_oi')) return "15 mmHg";

    // Traumatología
    if (lowerId.includes('zonaafectada')) return "Rodilla Derecha";
    if (lowerId.includes('limitacionmovimiento')) return "Moderada";
    if (lowerId.includes('tipodolor')) return "Punzante";
    if (lowerId.includes('actividadfisica')) return "Sedentario";

    // Salud Mental
    if (lowerId.includes('estadoanimo')) return "Ansioso";
    if (lowerId.includes('riesgosuicida')) return "Bajo";
    if (lowerId.includes('alteracionessueno')) return "Insomnio de conciliación";

    // Antecedentes y Datos Médicos
    if (lowerId.includes('alergia')) return "Niega alergias conocidas";
    if (lowerId.includes('sangre') || lowerId.includes('gruposanguineo')) return "O Positivo";
    if (lowerId.includes('antecedentes') || lowerId.includes('factoresriesgo')) return "HAS controlada, DM2 en tratamiento";
    if (lowerId.includes('ocupacion')) return "Empleado de oficina";

    // Gineco-Obstetricia
    if (lowerId.includes('fum') || lowerId.includes('menstruacion') || lowerId.includes('fechaultimamenstruacion')) return "15/09/2025";
    if (lowerId.includes('gestas')) return "2";
    if (lowerId.includes('partos')) return "1";
    if (lowerId.includes('abortos')) return "0";
    if (lowerId.includes('cesareas')) return "1";
    if (lowerId.includes('sddg') || lowerId.includes('semanas')) return "34 SDG";

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
function calcularAnchoOptimo(id: string, medicoConfig?: any): number {
    const texto = getExampleText(id, medicoConfig);

    // Si hay saltos de línea, calculamos el ancho basado en la línea más larga
    const lineas = texto.split('\n');
    const maxLineLength = Math.max(...lineas.map(l => l.length));

    // Aproximación: ~0.85% por carácter (ajustado para fuentes proporcionales)
    const anchoPorCaracter = 0.85;
    const anchoCalculado = maxLineLength * anchoPorCaracter + 4; // +4% para padding seguro

    // Límites razonables (mínimo 10% para asegurar visibilidad)
    return Math.max(10, Math.min(95, anchoCalculado));
}

/**
 * Calcula el alto óptimo de un campo basado en su texto de ejemplo.
 * Usado para asegurar que el campo tenga altura suficiente para el contenido.
 */
function calcularAltoOptimo(id: string): number {
    const texto = getExampleText(id);
    const lineas = texto.split('\n').length;
    // Aproximación: 3.5% de altura por línea
    // Mínimo 4% para asegurar usabilidad y visibilidad
    return Math.max(4, Math.min(100, lineas * 3.5));
}

interface EditorFieldDef {
    id: string;
    etiqueta: string;
    tipo: 'texto' | 'imagen' | 'fecha' | 'lista' | 'linea' | 'cuadrado' | 'textoDecorativo';
    defaultW: number;
    defaultH: number;
    src?: string;
    color?: string; // Default color
    contenido?: string; // Default content
    grosor?: number;
    fontSize?: number;
    ajusteImagen?: 'contain' | 'cover';
}

const DECORATIVE_FIELDS: EditorFieldDef[] = [
    { id: 'decorativo_linea', etiqueta: 'Línea', tipo: 'linea', defaultW: 30, defaultH: 2, color: '#000000', grosor: 2 },
    { id: 'decorativo_cuadrado', etiqueta: 'Cuadrado', tipo: 'cuadrado', defaultW: 10, defaultH: 10, color: '#e5e7eb' },
    { id: 'decorativo_texto', etiqueta: 'Texto', tipo: 'textoDecorativo', defaultW: 20, defaultH: 5, color: '#000000', contenido: 'Texto', fontSize: 14 },
    { id: 'decorativo_imagen', etiqueta: 'Imagen', tipo: 'imagen', defaultW: 20, defaultH: 15, ajusteImagen: 'contain' }
];

/**
 * Definición de campos BASE disponibles para agregar a la plantilla.
 * Los anchos se calculan automáticamente basándose en el contenido de ejemplo.
 */
const BASE_FIELDS_DEF: EditorFieldDef[] = [
    // Datos del Médico (Visible en summary cerrado)
    { id: 'medico_nombre', etiqueta: 'Nombre del Médico', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, get defaultH() { return calcularAltoOptimo(this.id); } },
    { id: 'medico_especialidad', etiqueta: 'Especialidad', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, get defaultH() { return calcularAltoOptimo(this.id); } },
    { id: 'medico_institucion_gral', etiqueta: 'Institución (Gral)', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, get defaultH() { return calcularAltoOptimo(this.id); } },
    { id: 'medico_cedula_gral', etiqueta: 'Cédula (Gral)', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, get defaultH() { return calcularAltoOptimo(this.id); } },
    { id: 'medico_institucion_esp', etiqueta: 'Institución (Esp)', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, get defaultH() { return calcularAltoOptimo(this.id); } },
    { id: 'medico_cedula_esp', etiqueta: 'Cédula (Esp)', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, get defaultH() { return calcularAltoOptimo(this.id); } },
    { id: 'medico_domicilio', etiqueta: 'Domicilio Consultorio', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, get defaultH() { return calcularAltoOptimo(this.id); } },
    { id: 'medico_contacto', etiqueta: 'Número de Contacto', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, get defaultH() { return calcularAltoOptimo(this.id); } },
    { id: 'medico_correo', etiqueta: 'Correo Electrónico', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, get defaultH() { return calcularAltoOptimo(this.id); } },
    { id: 'medico_web', etiqueta: 'Sitio Web', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, get defaultH() { return calcularAltoOptimo(this.id); } },
    { id: 'medico_logo', etiqueta: 'Logo / Imagen', tipo: 'imagen', defaultW: 20, defaultH: 15 },

    // Datos del Paciente (Prioridad Alta)
    { id: 'fecha', etiqueta: 'Fecha de Consulta', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, get defaultH() { return calcularAltoOptimo(this.id); } },
    { id: 'paciente_nombre', etiqueta: 'Nombre Paciente', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, get defaultH() { return calcularAltoOptimo(this.id); } },
    { id: 'paciente_edad', etiqueta: 'Edad', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, get defaultH() { return calcularAltoOptimo(this.id); } },
    { id: 'paciente_peso', etiqueta: 'Peso', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, get defaultH() { return calcularAltoOptimo(this.id); } },
    { id: 'paciente_talla', etiqueta: 'Talla', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, get defaultH() { return calcularAltoOptimo(this.id); } },

    // Datos de la Receta / Cuerpo
    { id: 'receta_folio', etiqueta: 'Folio Receta', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, get defaultH() { return calcularAltoOptimo(this.id); } },
    { id: 'receta_fecha', etiqueta: 'Fecha de Emisión', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, get defaultH() { return calcularAltoOptimo(this.id); } },

    // Bloques Consolidados
    { id: 'diagnostico', etiqueta: 'Diagnóstico', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, get defaultH() { return calcularAltoOptimo(this.id); } },
    { id: 'tratamiento_completo', etiqueta: 'Tratamiento Completo', tipo: 'lista', get defaultW() { return calcularAnchoOptimo(this.id); }, get defaultH() { return calcularAltoOptimo(this.id); } },
    { id: 'instrucciones_generales', etiqueta: 'Instrucciones Generales', tipo: 'texto', get defaultW() { return calcularAnchoOptimo(this.id); }, get defaultH() { return calcularAltoOptimo(this.id); } },
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
function SidebarDraggableItem({ field, isAdded, onAdd }: { field: EditorFieldDef, isAdded: boolean, onAdd?: () => void }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `sidebar-${field.id}`,
        data: { type: 'sidebar', field }
    });

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className={cn("touch-none", isDragging && "opacity-50")}>
            <Button
                variant={isAdded ? "secondary" : "outline"}
                size="sm"
                className={cn(
                    "w-full justify-start text-xs h-auto py-2 px-2",
                    "cursor-grab active:cursor-grabbing border-slate-200 shadow-sm bg-white hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300",
                    isAdded && 'bg-blue-50/50 border-blue-200 text-blue-600 shadow-none opacity-70 hover:opacity-100 hover:bg-blue-50'
                )}
                onClick={(e) => {
                    // Si no estamos arrastrando (click simple), añadimos
                    // Dnd-kit a veces dispara click después de drag, pero con mouse sensors bien configurados es manejable.
                    // Para mayor seguridad podríamos chequear movimiento, pero por ahora onClick directo es UX standard.
                    onAdd && onAdd();
                }}
                title={field.etiqueta}
            >
                {isAdded ? <Layout className="mr-1.5 h-3 w-3 flex-shrink-0" /> : <Type className="mr-1.5 h-3 w-3 text-slate-400 flex-shrink-0" />}
                <span className="truncate">{field.etiqueta}</span>
            </Button>
        </div>
    )
}

/**
 * Item de sidebar estilo icono (Photoshop-like) para elementos decorativos.
 */
function SidebarIconItem({ field, onAdd }: { field: EditorFieldDef, onAdd?: () => void }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `sidebar-${field.id}`,
        data: { type: 'sidebar', field }
    });

    const Icon = field.tipo === 'linea' ? Minus : field.tipo === 'cuadrado' ? Square : field.tipo === 'imagen' ? ImageIcon : Type;

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className={cn("touch-none", isDragging && "opacity-50")}>
            <div
                className="w-10 h-10 border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center rounded cursor-pointer hover:scale-105 shadow-sm transition-all"
                title={field.etiqueta}
                onClick={onAdd}
            >
                <Icon className="w-5 h-5 text-slate-700" />
            </div>
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
function CanvasDraggableField({ field, isSelected, onSelect, onResize, onUpdate, containerRef, isEditing, onToggleEditing, medicoConfig }: {
    field: CampoPlantilla,
    isSelected: boolean,
    onSelect: () => void,
    onResize: (id: string, widthPercent: number, heightPercent: number) => void
    onUpdate: (id: string, updates: Partial<CampoPlantilla>) => void
    containerRef: React.RefObject<HTMLDivElement | null>
    isEditing?: boolean
    onToggleEditing?: (editing: boolean) => void
    medicoConfig?: any
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: field.id,
        data: { type: 'canvas', field },
        disabled: isEditing // Deshabilitar DND nativamente si estamos editando
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

    // Auto-trigger upload if it's an image field and empty
    React.useEffect(() => {
        if (field.tipo === 'imagen' && !field.src && isSelected) {
            // Pequeño timeout para asegurar que el DOM está listo y no interferir con el drag
            const timer = setTimeout(() => {
                fileInputRef.current?.click();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [field.tipo, field.src, isSelected]);

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
        zIndex: isDragging ? 999 : (field.zIndex ?? 10),
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
            onDoubleClick={(e) => {
                e.preventDefault(); // Prevenir selección de texto nativa del navegador fuera del input
                e.stopPropagation();
                if (field.tipo === 'textoDecorativo') {
                    onSelect();
                    onToggleEditing && onToggleEditing(true);
                }
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
                {!isEditing && (
                    <div
                        className="absolute inset-0 cursor-grab active:cursor-grabbing hover:bg-blue-500/5 transition-colors"
                        style={{ zIndex: 20, touchAction: 'none' }}
                        {...listeners}
                        {...attributes}
                    />
                )}

                {/* Capa de interacción directa para Botones/Acciones (Z-30) - Encima del Drag */}
                {isSelected && field.tipo === 'imagen' && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                        <div
                            className="bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 shadow-md px-3 py-1.5 rounded cursor-pointer pointer-events-auto transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                            onMouseDown={(e) => e.stopPropagation()} // Stop drag ONLY on button
                            onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                            }}
                        >
                            <Upload className="w-3 h-3" />
                            <span className="text-xs font-bold">Cambiar Imagen</span>
                        </div>
                    </div>
                )}
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
                                <img
                                    src={field.src}
                                    alt="Logo"
                                    className="max-w-full max-h-full pointer-events-none"
                                    style={{
                                        objectFit: field.ajusteImagen || 'contain',
                                        width: '100%',
                                        height: '100%',
                                        transform: `rotate(${field.rotation || 0}deg)`
                                    }}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-slate-400">
                                    <ImageIcon className="h-6 w-6 mb-1" />
                                    <span className="text-[10px] text-center leading-tight">Logo</span>
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
                    ) : field.tipo === 'linea' ? (
                        <div className="w-full h-full flex items-center justify-center pointer-events-none">
                            <div
                                style={{
                                    width: '100%',
                                    height: `${field.grosor || 2}px`,
                                    backgroundColor: field.color || '#000000',
                                }}
                            />
                        </div>
                    ) : field.tipo === 'cuadrado' ? (
                        <div
                            className="w-full h-full pointer-events-none"
                            style={{
                                backgroundColor: field.color || '#e5e7eb',
                                borderRadius: '4px'
                            }}
                        />
                    ) : field.tipo === 'textoDecorativo' ? (
                        <div className="w-full h-full p-1 overflow-hidden pointer-events-auto" style={{ color: field.color || '#000000', cursor: isEditing ? 'text' : 'default' }}>
                            {isEditing ? (
                                <textarea
                                    autoFocus
                                    className="w-full h-full resize-none bg-transparent outline-none border-none p-0 m-0 z-50 relative focus:ring-0"
                                    style={{ fontSize: `${field.fontSize || 14}px`, fontFamily: 'inherit', fontWeight: 'bold' }}
                                    value={field.contenido}
                                    onChange={(e) => onUpdate(field.id, { contenido: e.target.value })}
                                    onBlur={() => onToggleEditing && onToggleEditing(false)}
                                    // Detener propagación para que puedas seleccionar texto sin arrastrar
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onFocus={(e) => e.target.select()} // Auto-seleccionar todo al enfocar
                                    ref={(input) => { if (input) input.focus(); }} // Forzar foco al montar
                                />
                            ) : (
                                <span
                                    className="text-sm font-bold whitespace-pre-wrap"
                                    style={{ fontSize: `${field.fontSize || 14}px` }}
                                >
                                    {field.contenido || 'Texto'}
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className={cn(
                            "w-full h-full",
                            // Ajustes para campos de texto (input vs textarea visual)
                            allowHeight ? "p-[2px]" : "flex items-end pb-[1px] px-[2px]"
                        )}>
                            {/* Renderizado simulado de texto tipo PDF */}
                            <span
                                style={{
                                    fontFamily: 'Helvetica, Arial, sans-serif',
                                    fontSize: field.fontSize ? `${field.fontSize}px` : '12px',
                                    lineHeight: '1.2',
                                    color: field.color || '#000000',
                                    whiteSpace: allowHeight ? 'pre-wrap' : 'nowrap',
                                    overflow: 'hidden',
                                    fontWeight: field.etiqueta ? 'bold' : 'normal' // Campos de datos suelen ser relevantes
                                }}
                                className="pointer-events-none block"
                            >
                                {getExampleText(field.id, medicoConfig)}
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
function DragItemOverlay({ field, medicoConfig }: { field: any, medicoConfig?: any }) {
    if (!field) return null;

    const text = getExampleText(field.id, medicoConfig);
    const textShort = text.length > 40 ? text.substring(0, 40) + "..." : text;

    return (
        // El DragOverlay de dnd-kit coloca el (0,0) del componente en la posición del puntero (con el modificador snapToCursor).
        // Usamos alineación Top-Left estándar para evitar desfases.
        <div className="flex flex-col items-start justify-start pointer-events-none opacity-90 origin-top-left">
            <div className="relative">
                {/* Ancla visual en la esquina SUPERIOR izquierda */}
                <div className="w-3 h-3 border-l-2 border-t-2 border-red-600 absolute -top-1 -left-1 z-50 rounded-tl-sm bg-transparent" />

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
                    className="bg-white/90 border border-slate-300 px-2 py-1 rounded shadow-sm mb-0.5 ml-1 mt-1"
                >
                    {textShort}
                </div>
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
    const [medicoConfig, setMedicoConfig] = useState<any>(null)
    const [campos, setCampos] = useState<CampoPlantilla[]>([])
    // Estado para importación
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

    // Cargar config del médico
    useEffect(() => {
        const loadMedicoConfig = async () => {
            const config = await medicoService.get();
            setMedicoConfig(config);

            // Actualizar campos disponibles con el logo real si existe
            if (config?.logo) {
                setAvailableFields(current => current.map(field => {
                    if (field.id === 'medico_logo') {
                        return { ...field, src: config.logo };
                    }
                    return field;
                }));
            }
        };
        loadMedicoConfig();
    }, []);

    // ... (rest of code)

    // Render DragItemOverlay
    // Change this: <DragItemOverlay field={activeDragItem.field} />
    // To: <DragItemOverlay field={activeDragItem.field} medicoConfig={medicoConfig} />

    // Render CanvasDraggableField
    // Change this: <CanvasDraggableField ... />
    // To: <CanvasDraggableField ... medicoConfig={medicoConfig} />
    const [availableFields, setAvailableFields] = useState<EditorFieldDef[]>(BASE_FIELDS_DEF)
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
    const [editingFieldId, setEditingFieldId] = useState<string | null>(null)
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
                        setCampos(data.campos || [])
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

    // Cargar campos dinámicos de la especialidad desde BD
    useEffect(() => {
        const loadSpecialtyFields = async () => {
            try {
                const config = await medicoService.get();
                if (config) {
                    const key = config.especialidadKey || 'general';
                    let specialtyConfig: EspecialidadCatalogo | undefined | null = null;

                    try {
                        specialtyConfig = await db.especialidades.get(key);
                        if (!specialtyConfig) {
                            specialtyConfig = await db.especialidades.get('general');
                        }
                    } catch (e) {
                        console.error("Error obteniendo especialidad de DB", e);
                    }

                    if (specialtyConfig) {
                        const newFields: EditorFieldDef[] = [];

                        // Mapear campos de paciente
                        specialtyConfig.patientFields?.forEach(f => {
                            const dynamicId = `datos_${f.id}`;
                            newFields.push({
                                id: dynamicId,
                                etiqueta: f.label,
                                tipo: 'texto',
                                get defaultW() { return calcularAnchoOptimo(this.id); },
                                get defaultH() { return calcularAltoOptimo(this.id); }
                            });
                        });

                        // Mapear campos de receta
                        specialtyConfig.prescriptionFields?.forEach(f => {
                            const dynamicId = `datos_${f.id}`;
                            newFields.push({
                                id: dynamicId,
                                etiqueta: f.label,
                                tipo: 'texto',
                                get defaultW() { return calcularAnchoOptimo(this.id); },
                                get defaultH() { return calcularAltoOptimo(this.id); }
                            });
                        });

                        setAvailableFields([...BASE_FIELDS_DEF, ...newFields]);
                    }
                }
            } catch (error) {
                console.error("Error al cargar campos de especialidad:", error);
            }
        };
        loadSpecialtyFields();
    }, []);




    // Teclado para movimiento preciso
    useEffect(() => {
        if (!selectedFieldId) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // FIX: Si estamos editando texto (editingFieldId no es null), NO interceptar teclas de borrado
            if (editingFieldId) {
                // Permitir que el evento fluya al textarea
                return;
            }

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
    }, [selectedFieldId, editingFieldId]);

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
            // dropX/Y corresponden a la posición del cursor, que gracias al snapToCursor y el overlay Top-Left
            // corresponden a la esquina SUPERIOR IZQUIERDA del elemento.
            const topPx = dropY - containerRect.top;
            const leftPx = dropX - containerRect.left;

            const fieldDef = active.data.current?.field;
            if (!fieldDef) return;

            // Altura por defecto del campo
            const targetHPercent = fieldDef.defaultH || (canResizeHeight({ ...fieldDef, id: fieldDef.id } as any) ? 10 : 2.5);

            // Convertir a %
            let xPercent = (leftPx / containerRect.width) * 100;
            let yPercent = (topPx / containerRect.height) * 100;

            xPercent = Math.max(0, Math.min(100 - (fieldDef.defaultW || 10), xPercent));
            yPercent = Math.max(0, Math.min(100 - targetHPercent, yPercent));

            const isDecorative = ['linea', 'cuadrado', 'textoDecorativo'].includes(fieldDef.tipo);
            const newId = isDecorative ? `${fieldDef.id}_${Date.now()}` : fieldDef.id;

            const newField: CampoPlantilla = {
                id: newId,
                etiqueta: fieldDef.etiqueta,
                tipo: fieldDef.tipo as any,
                visible: true,
                x: xPercent,
                y: yPercent,
                ancho: fieldDef.defaultW || 15,
                alto: targetHPercent,
                src: fieldDef.src,
                color: fieldDef.color,
                contenido: fieldDef.contenido
            };

            // Solo filtramos duplicados si NO es decorativo (los campos de datos deben ser únicos)
            let newCampos = campos;
            if (!isDecorative) {
                newCampos = campos.filter(c => c.id !== fieldDef.id);
            }

            setCampos([...newCampos, newField]);
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

    /**
     * Exporta la configuración actual de la plantilla a un archivo JSON.
     * Este archivo puede ser compartido o usado para crear copias de seguridad.
     * Descarga el archivo automáticamente en el dispositivo del usuario.
     */
    const handleExportJson = () => {
        const datosExportacion = {
            nombre,
            tamanoPapel,
            imagenFondo,
            imprimirFondo,
            campos,
            activa: false, // Por defecto al exportar, inactiva
        };

        const jsonString = JSON.stringify(datosExportacion, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${nombre.replace(/\s+/g, "_") || "plantilla"}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
            title: "Exportado",
            description: "Plantilla exportada a JSON correctamente.",
        });
    };

    /**
     * Maneja la importación de una plantilla desde un archivo JSON.
     * Lee el archivo seleccionado, valida su estructura básica y actualiza el estado del editor.
     * 
     * @param e - Evento de cambio del input de archivo
     */
    const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target?.result as string;
                const data = JSON.parse(content);

                // Validación básica de la estructura
                if (!data.campos || !Array.isArray(data.campos)) {
                    throw new Error("El archivo no tiene un formato de plantilla válido.");
                }

                // Cargar los datos al estado
                setNombre(data.nombre || `${nombre} (Importado)`);
                setTamanoPapel((data.tamanoPapel || 'media_carta').replace('-', '_'));
                setImagenFondo(data.imagenFondo);
                setImprimirFondo(!!data.imprimirFondo);
                setCampos(data.campos);
                setActiva(true);

                toast({
                    title: "Plantilla Importada y Activada",
                    description: "Los datos se han cargado en el editor. Puedes editarlos para mejorar la precisión y el diseño personalizado.",
                });
            } catch (error) {
                console.error("Error al importar plantilla:", error);
                toast({
                    title: "Error de Importación",
                    description: error instanceof Error ? error.message : "No se pudo leer el archivo JSON.",
                    variant: "destructive",
                });
            } finally {
                // Limpiar el input para permitir volver a subir el mismo archivo
                e.target.value = '';
                setIsImportDialogOpen(false); // Cerrar modal al tener éxito o error
            }
        };
        reader.readAsText(file);
    };

    /**
     * Importa una plantilla de la galería directamente al editor.
     */
    const handleSelectFromGallery = (template: any) => {
        const data = template.content;
        if (!data || !data.campos) {
            toast({ title: "Error", description: "Contenido de plantilla inválido", variant: "destructive" });
            return;
        }

        setNombre(data.nombre || `${template.nombre}`);
        setTamanoPapel((data.tamanoPapel || 'media_carta').replace('-', '_'));
        setImagenFondo(data.imagenFondo);
        setImprimirFondo(!!data.imprimirFondo);
        setCampos(data.campos);
        setActiva(true);

        toast({
            title: "Plantilla Cargada y Activada",
            description: `Se ha cargado la plantilla "${template.nombre}". Puedes editarla para mejorar la precisión y el diseño personalizado.`,
        });
        setIsImportDialogOpen(false);
    };

    /**
     * Añade un campo al centro del canvas (Click-to-Add).
     */
    const handleAddField = (def: EditorFieldDef) => {
        // Centro relativo (50% - mitad del ancho)
        const centerX = 50 - ((def.defaultW || 15) / 2);
        const centerY = 45 - ((def.defaultH || 5) / 2); // Un poco más arriba del centro absoluto

        const isDecorative = ['linea', 'cuadrado', 'textoDecorativo', 'imagen'].includes(def.tipo);
        const newId = isDecorative ? `${def.id}_${Date.now()}` : def.id;

        // Evitar duplicados para campos de datos
        if (!isDecorative && campos.some(c => c.id === newId)) {
            setSelectedFieldId(newId); // Si ya existe, solo seleccionarlo
            toast({ title: "Campo ya existe", description: "El campo ya está en la plantilla." });
            return;
        }

        const newField: CampoPlantilla = {
            id: newId,
            etiqueta: def.etiqueta,
            tipo: def.tipo as any,
            visible: true,
            x: centerX,
            y: centerY,
            ancho: def.defaultW || 15,
            alto: def.defaultH || 5, // Altura por defecto
            src: def.src,
            color: def.color,
            contenido: def.contenido,
            grosor: def.grosor,
            fontSize: def.fontSize,
            ajusteImagen: def.ajusteImagen,
            zIndex: isDecorative ? 20 : 10 // Decorativos un poco más arriba por defecto si se superponen
        };

        setCampos(prev => [...prev, newField]);
        setSelectedFieldId(newId);

        // Auto-activar edición para texto
        if (def.tipo === 'textoDecorativo') {
            // Pequeño delay para asegurar renderizado
            setTimeout(() => setEditingFieldId(newId), 50);
        }

        toast({ title: "Elemento Agregado", description: `${def.etiqueta} añadido al canvas.` });
    };

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8" /></div>;

    const paperAspect = tamanoPapel === 'carta'
        ? '8.5 / 11' // Ratio vertical estándar
        : '8.5 / 5.5'; // Media carta horizontal;

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
                        <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 shadow-md transition-all active:scale-95">
                            {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                            Guardar Plantilla
                        </Button>
                        <Button variant="outline" onClick={handleExportJson}>
                            <Download className="mr-2 h-4 w-4" />
                            Exportar Plantilla
                        </Button>
                    </div>
                </div>

                {/* Modal de Selección de Importación */}
                <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
                        <div className="bg-white flex flex-col h-full">
                            <DialogHeader className="p-6 pb-2">
                                <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                    <Layout className="h-6 w-6 text-blue-600" />
                                    Galería de Diseños Profesionales
                                </DialogTitle>
                                <DialogDescription className="text-sm font-medium text-slate-400">
                                    Selecciona una base para comenzar tu diseño o importa un archivo local.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex-grow overflow-y-auto px-6 py-4 custom-scrollbar">
                                <div className="space-y-8">
                                    {/* Sección de Importación Local compacta */}
                                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-600 p-2 rounded-lg shadow-blue-200 shadow-md">
                                                <Upload className="h-4 w-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 leading-tight">¿Tienes un diseño offline?</p>
                                                <p className="text-[11px] font-medium text-blue-600/70">Sube tu archivo .json exportado previamente</p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="w-full md:w-auto font-bold bg-white text-blue-600 border-blue-200 hover:bg-blue-50 shadow-sm"
                                            onClick={() => document.getElementById('import-plantilla-file')?.click()}
                                        >
                                            Explorar Archivos
                                        </Button>
                                    </div>

                                    {/* Separador Visual */}
                                    <div className="flex items-center gap-4">
                                        <div className="h-px bg-slate-100 flex-grow" />
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">O elige de la galería</span>
                                        <div className="h-px bg-slate-100 flex-grow" />
                                    </div>

                                    <PlantillaGallery onSelectTemplate={handleSelectFromGallery} />
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 border-t flex justify-end">
                                <Button variant="ghost" onClick={() => setIsImportDialogOpen(false)} className="font-bold text-slate-400 hover:text-slate-600">
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow overflow-hidden">
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
                                <div className="space-y-2 border-t pt-2">
                                    <Label>Cargar imagen de receta membretada</Label>
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

                        <div className="flex items-center justify-between border p-3 rounded-lg bg-white shadow-sm hover:border-blue-200 transition-colors">
                            <Label htmlFor="active" className="cursor-pointer font-medium text-slate-700 leading-tight pr-4">
                                Hacer ésta plantilla principal para sus impresiones PDF
                            </Label>
                            <Switch id="active" checked={activa} onCheckedChange={setActiva} />
                        </div>



                        <SidebarAccordion
                            title="Datos del Paciente"
                            icon={<UserCircle className="h-4 w-4" />}
                            defaultOpen={true}
                        >
                            <div className="grid grid-cols-2 gap-2">
                                {availableFields.filter(f =>
                                    f.id.startsWith('paciente_') || f.id.startsWith('datos_') || f.id === 'fecha'
                                ).map(def => {
                                    const isAdded = (campos || []).some(c => c.id === def.id);
                                    return <SidebarDraggableItem key={def.id} field={def} isAdded={isAdded} onAdd={() => handleAddField(def)} />;
                                })}
                            </div>
                        </SidebarAccordion>

                        <SidebarAccordion
                            title="Cuerpo de la Receta"
                            icon={<FileText className="h-4 w-4" />}
                            defaultOpen={true}
                        >
                            <div className="grid grid-cols-2 gap-2">
                                {availableFields.filter(f =>
                                    ['tratamiento_completo', 'instrucciones_generales', 'receta_folio', 'receta_fecha', 'diagnostico'].includes(f.id)
                                ).map(def => {
                                    const isAdded = (campos || []).some(c => c.id === def.id);
                                    return <SidebarDraggableItem key={def.id} field={def} isAdded={isAdded} onAdd={() => handleAddField(def)} />;
                                })}
                            </div>
                        </SidebarAccordion>

                        <SidebarAccordion
                            title="Datos del Médico"
                            icon={<Stethoscope className="h-4 w-4" />}
                            defaultOpen={true}
                        >
                            <div className="grid grid-cols-2 gap-2">
                                {availableFields.filter(f =>
                                    f.id.startsWith('medico_')
                                ).map(def => {
                                    const isAdded = (campos || []).some(c => c.id === def.id);
                                    return <SidebarDraggableItem key={def.id} field={def} isAdded={isAdded} onAdd={() => handleAddField(def)} />;
                                })}
                            </div>
                        </SidebarAccordion>


                    </div>

                    {/* Canvas Area Container */}
                    <div className="lg:col-span-3 flex flex-col gap-4 overflow-hidden">
                        {/* Barra de Herramientas de Diseño Superior */}
                        <div
                            className="p-2 rounded-xl border border-slate-700 shadow-2xl flex flex-wrap items-center justify-center gap-4 mx-2 md:mx-0"
                            style={{ backgroundColor: 'rgba(80, 80, 80, 1)' }}
                        >
                            <div className="flex items-center gap-1 pr-4 border-r border-slate-700 mb-2 md:mb-0 w-full md:w-auto justify-center md:justify-start">
                                <Settings className="h-4 w-4 text-blue-400 mr-2" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Caja de Herramientas</span>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                {DECORATIVE_FIELDS.map(def => (
                                    <div key={def.id} className="group relative">
                                        <SidebarIconItem field={def} onAdd={() => handleAddField(def)} />
                                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-700">
                                            Agregar {def.etiqueta} al canvas
                                        </div>
                                    </div>
                                ))}

                                {/* Separador interno */}
                                <div className="h-8 w-px bg-slate-700 mx-2" />

                                {/* Botón de Ver Galería */}
                                <div className="group relative">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-10 h-10 bg-slate-800 border border-slate-700 text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 shadow-sm"
                                        onClick={() => setIsImportDialogOpen(true)}
                                    >
                                        <Layout className="h-5 w-5" />
                                    </Button>
                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-700">
                                        Ver galería de plantillas
                                    </div>
                                </div>

                                {/* Botón de Exportar (Guardar Configuración) */}
                                <div className="group relative">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-10 h-10 bg-slate-800 border border-slate-700 text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 shadow-sm"
                                        onClick={handleExportJson}
                                    >
                                        <Download className="h-5 w-5" />
                                    </Button>
                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-700">
                                        Guardar configuración de plantilla
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Drop / Viewport Area */}
                        <div
                            className="flex-grow bg-slate-100 rounded-lg border shadow-inner overflow-auto p-8 flex items-start justify-center relative touch-none"
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
                                        isEditing={editingFieldId === field.id}
                                        onToggleEditing={(isEd) => setEditingFieldId(isEd ? field.id : null)}
                                        containerRef={containerRef}
                                        medicoConfig={medicoConfig}
                                    />
                                ))}

                                {campos.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 pointer-events-none">
                                        <div className="text-center space-y-4">
                                            <div className="relative">
                                                <Layout className="h-16 w-16 mx-auto mb-2 opacity-20" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Plus className="h-6 w-6 text-blue-400 animate-pulse" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-slate-400 font-medium">El lienzo está vacío</p>
                                                <p className="text-xs text-slate-300 mb-4">Comienza arrastrando campos o...</p>
                                            </div>
                                            <Button
                                                variant="secondary"
                                                className="pointer-events-auto shadow-md border border-blue-100 hover:border-blue-300 transition-all"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsImportDialogOpen(true);
                                                }}
                                            >
                                                <Layout className="mr-2 h-4 w-4 text-blue-500" />
                                                Elegir de la Galería
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Toolbar Contextual */}
                                {selectedFieldId && (() => {
                                    const selected = campos.find(c => c.id === selectedFieldId);
                                    if (!selected) return null;
                                    return (
                                        <ToolbarPropiedades
                                            key={`toolbar-${selected.id}`}
                                            field={selected}
                                            onUpdate={(vals) => handleFieldUpdate(selected.id, vals)}
                                            onEdit={() => {
                                                // Activar modo edición explícitamente
                                                setEditingFieldId(selected.id);
                                            }}
                                            onDelete={() => {
                                                setCampos(prev => prev.filter(c => c.id !== selected.id));
                                                setSelectedFieldId(null);
                                            }}
                                            onDuplicate={() => {
                                                const copy: CampoPlantilla = {
                                                    ...selected,
                                                    id: `${selected.id}_copy_${Date.now()}`,
                                                    x: Math.min(90, selected.x + 2),
                                                    y: Math.min(90, selected.y + 2)
                                                };
                                                setCampos(prev => [...prev, copy]);
                                                setSelectedFieldId(copy.id);
                                            }}
                                            containerRef={containerRef}
                                        />
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay para arrastre visual suave */}
            <DragOverlay modifiers={[snapToCursor]} style={{ zIndex: 9999 }} dropAnimation={null}>
                {activeDragItem ? <DragItemOverlay field={activeDragItem} medicoConfig={medicoConfig} /> : null}
            </DragOverlay>
        </DndContext>
    )
}
