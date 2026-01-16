"use client"

import { useEffect, useState } from "react"
import { PlantillaReceta } from "@/types"
import { plantillaService } from "@/features/recetas/services/plantilla.service"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Plus, Edit, Trash2, CheckCircle, FileText } from "lucide-react"
import Link from "next/link";
import { OfflineLink } from "@/shared/components/ui/OfflineLink";

import { useRouter } from "next/navigation";
import { useToast } from "@/shared/components/ui/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"

interface PlantillaListProps {
    defaultTab?: 'mine' | 'gallery';
}

import { PlantillaGallery } from "./PlantillaGallery";

export function PlantillaList({ defaultTab = 'mine' }: PlantillaListProps) {
    const [plantillas, setPlantillas] = useState<PlantillaReceta[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const { toast } = useToast()
    const router = useRouter()

    const [galleryTemplates, setGalleryTemplates] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState<'mine' | 'gallery'>(defaultTab)
    const [isGalleryLoading, setIsGalleryLoading] = useState(false)

    const loadPlantillas = async () => {
        setIsLoading(true)
        try {
            const data = await plantillaService.getAll()
            setPlantillas(data)
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "No se pudieron cargar las plantillas",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    // La lógica de carga de galería ha sido movida a PlantillaGallery.tsx

    useEffect(() => {
        loadPlantillas()
    }, [])

    // useEffect de galería movido a PlantillaGallery.tsx

    const handleActivate = async (id: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            await plantillaService.update(id, { activa: true })
            await loadPlantillas()
            toast({
                title: "Plantilla activada",
                description: "La plantilla se usará por defecto en las nuevas recetas."
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo activar la plantilla",
                variant: "destructive"
            })
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return
        try {
            await plantillaService.delete(deleteId)
            setDeleteId(null)
            await loadPlantillas()
            toast({
                title: "Plantilla eliminada",
                description: "La plantilla ha sido eliminada correctamente."
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo eliminar la plantilla",
                variant: "destructive"
            })
        }
    }

    /**
     * Importa una plantilla de la galería a las plantillas personales del usuario.
     * Crea una copia con la configuración base para que pueda ser editada.
     * 
     * @param template - Objeto de la plantilla seleccionada desde la galería
     */
    const handleImportTemplate = async (template: any) => {
        try {
            // Crear nueva plantilla basada en el JSON
            const newTemplateData: any = {
                ...template.content,
                nombre: `${template.nombre} (Copia)`,
                activa: true,
                id: undefined,
                tamanoPapel: template.tamanoPapel || template.content?.tamanoPapel?.replace('-', '_'),
                imagenFondo: template.imagenFondo || template.content?.imagenFondo
            };

            // Si el servicio devuelve el ID de la nueva plantilla:
            const id = await plantillaService.create(newTemplateData);

            toast({
                title: "Plantilla Importada y Activada",
                description: "La plantilla se ha añadido y activado. Puedes editarla en 'Mis Plantillas' para mejorar la precisión y el diseño personalizado."
            });

            // Recargar mis plantillas y cambiar tab
            await loadPlantillas();
            setActiveTab('mine');

            // Opcional: Redirigir al editor
            // router.push(`/recetas/plantillas/${id}`);
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "No se pudo importar la plantilla", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Plantillas de Receta</h2>
                    <p className="text-muted-foreground">
                        Diseñe y configure el formato de impresión de sus recetas.
                    </p>
                </div>
                <OfflineLink href="/recetas/plantillas/nueva">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Plantilla
                    </Button>
                </OfflineLink>
            </div>

            {/* Simulación de Tabs */}
            <div className="border-b border-slate-200">
                <div className="flex gap-6">
                    <button
                        onClick={() => setActiveTab('mine')}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'mine'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        Mis Plantillas ({plantillas.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('gallery')}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'gallery'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        Galería Prediseñada
                    </button>
                </div>
            </div>

            {activeTab === 'mine' ? (
                isLoading ? (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="animate-pulse h-64 bg-slate-50 border-slate-100" />
                        ))}
                    </div>
                ) : plantillas.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent className="flex flex-col items-center gap-4">
                            <FileText className="h-12 w-12 text-slate-300" />
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">No hay plantillas creadas</h3>
                                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                    Comience creando su primera plantilla personalizada para adaptar la impresión a sus necesidades.
                                </p>
                            </div>
                            <OfflineLink href="/recetas/plantillas/nueva">
                                <Button variant="outline">Crear mi primera plantilla</Button>
                            </OfflineLink>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {plantillas.map((plantilla) => (
                            <Card key={plantilla.id} className={`relative overflow-hidden transition-all hover:shadow-2xl border-slate-200 group hover:-translate-y-2 duration-300 bg-white ${plantilla.activa ? 'ring-2 ring-green-500/20 border-green-500/50 shadow-green-500/5' : ''}`}>
                                {plantilla.activa ? (
                                    <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl shadow-md z-20 flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3" />
                                        ACTIVA
                                    </div>
                                ) : (
                                    <div className="absolute top-0 right-0 bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-bl z-20">
                                        PERSONAL
                                    </div>
                                )}
                                <CardHeader className="p-5 pb-3">
                                    <CardTitle className="flex justify-between items-start text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                                        <span className="truncate pr-2" title={plantilla.nombre}>{plantilla.nombre}</span>
                                    </CardTitle>
                                    <CardDescription className="text-[10px] font-bold text-slate-500">
                                        {plantilla.tamanoPapel === 'carta' ? 'Tamaño Carta' : 'Media Carta'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-5 pt-0">
                                    <div className={`border rounded-lg flex items-center justify-center mb-6 relative overflow-hidden mx-auto bg-slate-50/50
                                        ${plantilla.tamanoPapel === 'carta' ? 'aspect-[8.5/11]' : 'aspect-[8.5/5.5]'} w-full shadow-inner group-hover:bg-white transition-colors duration-500`}
                                    >
                                        {plantilla.imagenFondo || (plantilla as any).content?.imagenFondo ? (
                                            <img
                                                src={plantilla.imagenFondo || (plantilla as any).content?.imagenFondo}
                                                alt="Previsualización"
                                                className="w-full h-full object-contain opacity-90 transition-opacity"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 text-slate-200">
                                                <FileText className="h-12 w-12 opacity-10" />
                                            </div>
                                        )}
                                        {/* Miniatura de campos sutil como galería */}
                                        <div className="absolute inset-0 p-1 overflow-hidden pointer-events-none opacity-40">
                                            {(plantilla.campos || (plantilla as any).content?.campos)?.filter((c: any) => c.visible).map((c: any) => (
                                                <div
                                                    key={c.id}
                                                    className="absolute bg-blue-400/10 border-[0.5px] border-blue-400/20 rounded-[0.5px]"
                                                    style={{
                                                        left: `${c.x}%`,
                                                        top: `${c.y}%`,
                                                        width: `${c.ancho}%`,
                                                        height: `${c.alto || 5}%`
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        {!plantilla.activa ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-9 px-4 text-xs font-semibold text-green-600 border-green-200 hover:bg-green-50 transition-all flex-grow justify-center"
                                                onClick={(e) => handleActivate(plantilla.id, e)}
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Activar
                                            </Button>
                                        ) : (
                                            <div className="flex-grow text-center text-[10px] font-bold text-green-600 bg-green-50 py-2 rounded-md border border-green-100">
                                                DISEÑO EN USO
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <OfflineLink href={`/recetas/plantillas/${plantilla.id}`}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-9 w-9 p-0 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm"
                                                    title="Editar diseño"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </OfflineLink>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-9 w-9 p-0 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
                                                onClick={() => setDeleteId(plantilla.id)}
                                                title="Eliminar plantilla"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-slate-500">
                        Seleccione una plantilla base para importarla a su colección y personalizarla.
                    </p>
                    <PlantillaGallery onSelectTemplate={handleImportTemplate} />
                </div>
            )
            }

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. La plantilla será eliminada permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    )
}
