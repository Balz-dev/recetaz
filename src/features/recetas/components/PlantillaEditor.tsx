"use client"

import React, { useState, useEffect, useRef } from "react"
import { DndContext, useDraggable, useDroppable, DragEndEvent, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors, Modifier } from "@dnd-kit/core"
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
import { Loader2, Save, Upload, Layout, Type, GripVertical, Trash, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Tipos de campos disponibles para agregar
const AVAILABLE_FIELDS_DEF = [
    { id: 'fecha', etiqueta: 'Fecha', tipo: 'fecha', defaultW: 20, defaultH: 5 },
    { id: 'paciente_nombre', etiqueta: 'Nombre Paciente', tipo: 'texto', defaultW: 50, defaultH: 5 },
    { id: 'paciente_edad', etiqueta: 'Edad', tipo: 'texto', defaultW: 10, defaultH: 5 },
    { id: 'diagnostico', etiqueta: 'Diagnóstico', tipo: 'texto', defaultW: 80, defaultH: 5 },
    { id: 'medicamentos', etiqueta: 'Lista de Medicamentos', tipo: 'lista', defaultW: 80, defaultH: 40 },
    { id: 'instrucciones', etiqueta: 'Instrucciones', tipo: 'texto', defaultW: 80, defaultH: 15 },
] as const;

// Componente de Campo Arrastrable y Redimensionable
function DraggableField({ field, isSelected, onSelect, onResize, containerRef }: { 
    field: CampoPlantilla, 
    isSelected: boolean, 
    onSelect: () => void,
    onResize: (id: string, widthPercent: number, heightPercent: number) => void
    containerRef: React.RefObject<HTMLDivElement | null>
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: field.id,
        data: field
    });

    const handleResize = (e: React.SyntheticEvent, data: ResizeCallbackData) => {
        if (!containerRef.current) return;
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        
        const newWidthPercent = (data.size.width / containerWidth) * 100;
        const newHeightPercent = (data.size.height / containerHeight) * 100;
        
        onResize(field.id, newWidthPercent, newHeightPercent);
    };

    // Convertir porcentajes a pixeles para visualización inicial en ResizableBox
    const getPixelDimensions = () => {
        if (!containerRef.current) return { width: 100, height: 30 };
        return {
            width: (field.ancho / 100) * containerRef.current.offsetWidth,
            height: ((field.alto || 5) / 100) * containerRef.current.offsetHeight
        };
    };
    
    // Si el contenedor no está listo, usamos valores por defecto seguros
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
            // NO aplicar listeners/attributes al contenedor principal, solo al grip
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
                // Manijas de redimensionamiento
                handle={
                    isSelected ? (
                        <div 
                            className="react-resizable-handle react-resizable-handle-se absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-50 flex items-center justify-center p-1 bg-transparent"
                            // Detener propagación para evitar iniciar drag al intentar resize
                            onMouseDown={(e) => e.stopPropagation()} 
                            onTouchStart={(e) => e.stopPropagation()}
                        >
                            <div className="w-full h-full bg-blue-500 rounded-tl-lg shadow-sm border border-white" />
                        </div>
                    ) : <span />
                }
                className={`
                    flex items-center p-0 rounded 
                    border-2 select-none overflow-hidden h-full w-full relative
                    ${isDragging ? 'opacity-80 shadow-2xl scale-105 border-blue-500 bg-blue-50' : ''}
                    ${isSelected ? 'border-primary bg-primary/10 ring-2 ring-offset-1 ring-primary/50' : 'border-dashed border-slate-400 bg-white/80 hover:border-slate-600'}
                `}
            >
                {/* Zona de contenido y Drag Handle */}
                <div className="flex items-center w-full h-full overflow-hidden p-2">
                    {/* El Icono es el Activador del Drag */}
                    <div 
                        {...listeners} 
                        {...attributes} 
                        className="cursor-move mr-2 touch-none flex-shrink-0"
                    >
                        <GripVertical className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                    </div>
                    
                    <span className="text-xs font-medium truncate flex-grow text-slate-900 pointer-events-none select-none">
                        {field.etiqueta}
                    </span>
                </div>
            </ResizableBox>
        </div>
    );
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
    const containerRef = useRef<HTMLDivElement>(null)

    // Configuración de Sensores DnD
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
    )

    // Cargar datos si es edición
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

    // Manejo de Imagen
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagenFondo(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    // Manejo de Campos
    const toggleField = (fieldDefId: string) => {
        const existingIndex = campos.findIndex(c => c.id === fieldDefId)
        
        if (existingIndex >= 0) {
            // Eliminar campo
            const newCampos = [...campos]
            newCampos.splice(existingIndex, 1)
            setCampos(newCampos)
            if (selectedFieldId === fieldDefId) setSelectedFieldId(null)
        } else {
            // Agregar campo
            const def = AVAILABLE_FIELDS_DEF.find(f => f.id === fieldDefId)
            if (def) {
                setCampos([...campos, {
                    id: def.id,
                    etiqueta: def.etiqueta,
                    tipo: def.tipo as any,
                    visible: true,
                    x: 10, // Posición inicial por defecto
                    y: 10 + (campos.length * 10),
                    ancho: def.defaultW,
                    alto: def.defaultH
                }])
            }
        }
    }

    // Manejo de Resizing
    const handleResize = (id: string, widthPercent: number, heightPercent: number) => {
        setCampos(prev => prev.map(f => {
            if (f.id === id) {
                return { ...f, ancho: widthPercent, alto: heightPercent };
            }
            return f;
        }));
    };

    // Manejo de Drag End
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        
        if (!containerRef.current) return;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        
        // Convertir delta (px) a porcentaje relativo al contenedor
        const deltaXPercent = (delta.x / containerRect.width) * 100;
        const deltaYPercent = (delta.y / containerRect.height) * 100;

        setCampos(prev => prev.map(field => {
            if (field.id === active.id) {
                // Calcular nueva posición limitando entre 0 y 100 (aprox)
                let newX = Math.max(0, Math.min(100 - field.ancho, field.x + deltaXPercent));
                let newY = Math.max(0, Math.min(100 - (field.alto || 5), field.y + deltaYPercent));
                
                return { ...field, x: newX, y: newY };
            }
            return field;
        }));
    };

    // Guardar
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
                nombre,
                tamanoPapel,
                imagenFondo,
                activa,
                imprimirFondo,
                campos
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

    // Dimensiones del papel (Relación de aspecto)
    // Carta: 8.5 x 11 (0.77), Media Carta: 5.5 x 8.5 (0.647)
    // Usamos style inline para mayor precisión y compatibilidad


    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8" /></div>;

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col gap-4">
            {/* Header de Acciones */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center gap-4">
                    <Link href="/recetas/plantillas">
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold">{plantillaId ? "Editar Plantilla" : "Diseñar Nueva Plantilla"}</h2>
                        <div className="text-sm text-slate-500">Arrastre los campos para coincidir con su papel membretado</div>
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
                {/* Panel Izquierdo: Configuración */}
                <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2 pb-10">
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label>Nombre de Plantilla</Label>
                                <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Receta Privada 2024" />
                            </div>

                            <div className="space-y-2">
                                <Label>Tamaño de Papel</Label>
                                <Select value={tamanoPapel} onValueChange={(v: any) => setTamanoPapel(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="carta">Carta (8.5 x 11 in)</SelectItem>
                                        <SelectItem value="media_carta">Media Carta - Horizontal (8.5 x 5.5 in)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between space-x-2 border p-2 rounded">
                                <div className="flex flex-col">
                                    <Label className="cursor-pointer" htmlFor="active-mode">Plantilla Activa</Label>
                                    <span className="text-xs text-muted-foreground">Usar por defecto</span>
                                </div>
                                <Switch id="active-mode" checked={activa} onCheckedChange={setActiva} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <h3 className="font-semibold flex items-center"><Layout className="mr-2 h-4 w-4" /> Imagen de Fondo</h3>
                            
                            <div className="space-y-2">
                                <Label>Subir imagen (escaneo de receta)</Label>
                                <Input type="file" accept="image/*" onChange={handleImageUpload} />
                                <p className="text-xs text-muted-foreground">Suba una foto o escaneo de su hoja pre-impresa.</p>
                            </div>

                            <div className="flex items-center justify-between space-x-2 border p-2 rounded">
                                <div className="flex flex-col">
                                    <Label className="cursor-pointer" htmlFor="print-bg">Imprimir Fondo</Label>
                                    <span className="text-xs text-muted-foreground">
                                        {imprimirFondo ? "Se imprimirá la imagen" : "Solo guía visual (hoja pre-impresa)"}
                                    </span>
                                </div>
                                <Switch id="print-bg" checked={imprimirFondo} onCheckedChange={setImprimirFondo} />
                            </div>

                            {imagenFondo && (
                                <div className="mt-2 relative group">
                                    <img src={imagenFondo} alt="Fondo" className="w-full h-32 object-cover rounded border" />
                                    <Button 
                                        variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => setImagenFondo(undefined)}
                                    >
                                        <Trash className="h-3 w-3" />
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6 space-y-2">
                            <h3 className="font-semibold flex items-center mb-4"><Type className="mr-2 h-4 w-4" /> Campos Disponibles</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {AVAILABLE_FIELDS_DEF.map(def => {
                                    const isAdded = campos.some(c => c.id === def.id);
                                    return (
                                        <Button
                                            key={def.id}
                                            variant={isAdded ? "secondary" : "outline"}
                                            className={`justify-start ${isAdded ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}`}
                                            onClick={() => toggleField(def.id)}
                                        >
                                            {isAdded ? <Layout className="mr-2 h-4 w-4" /> : <Type className="mr-2 h-4 w-4" />}
                                            {def.etiqueta}
                                            {isAdded && <span className="ml-auto text-xs text-blue-500">Agregado</span>}
                                        </Button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Área Central: Canvas */}
                <div className="lg:col-span-2 bg-slate-100 rounded-lg border shadow-inner overflow-auto p-8 flex items-start justify-center relative">
                    <DndContext 
                        sensors={sensors}
                        modifiers={[restrictToParentElement]}
                        onDragEnd={handleDragEnd}
                    >
                        <div 
                            ref={containerRef}
                            className="relative bg-white shadow-lg transition-all duration-300"
                            style={{ 
                                width: '100%', 
                                maxWidth: '800px', 
                                aspectRatio: tamanoPapel === 'carta' ? '8.5/11' : '8.5/5.5'
                            }}
                            onClick={() => setSelectedFieldId(null)}
                        >
                            {/* Imagen de Fondo */}
                            {imagenFondo && (
                                <img 
                                    src={imagenFondo} 
                                    className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-50" 
                                    alt="Guía de fondo"
                                />
                            )}
                            
                            {/* Grid / Guías (Opcional) */}
                            <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 pointer-events-none opacity-10">
                                {[...Array(10)].map((_, i) => <div key={`v-${i}`} className="border-r border-black h-full" />)}
                                {[...Array(10)].map((_, i) => <div key={`h-${i}`} className="border-b border-black w-full" />)}
                            </div>

                            {/* Campos Draggable */}
                            {campos.map(field => (
                                <DraggableField 
                                    key={field.id} 
                                    field={field} 
                                    isSelected={selectedFieldId === field.id}
                                    onSelect={() => setSelectedFieldId(field.id)}
                                    onResize={handleResize}
                                    containerRef={containerRef}
                                />
                            ))}

                            {campos.length === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-300 pointer-events-none">
                                    <div className="text-center">
                                        <Layout className="h-16 w-16 mx-auto mb-2" />
                                        <p>Agregue campos desde el panel izquierdo</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </DndContext>
                </div>
            </div>
        </div>
    )
}
