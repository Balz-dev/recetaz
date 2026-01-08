"use client"

import { useEffect, useState } from "react"
import { PlantillaReceta } from "@/types"
import { plantillaService } from "@/features/recetas/services/plantilla.service"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Plus, Edit, Trash2, CheckCircle, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/shared/components/ui/use-toast"
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

export function PlantillaList() {
    const [plantillas, setPlantillas] = useState<PlantillaReceta[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const { toast } = useToast()
    const router = useRouter()

    const [galleryTemplates, setGalleryTemplates] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState<'mine' | 'gallery'>('mine')
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

    /**
     * Carga la galería de plantillas desde el manifiesto estático JSON.
     * Esto permite el funcionamiento offline/estático sin depender de una API Routes.
     */
    const loadGallery = async () => {
        if (galleryTemplates.length > 0) return; // Cache simple
        setIsGalleryLoading(true);
        try {
            // Fetch al manifiesto estático en public/plantillas/manifest.json
            const res = await fetch('/plantillas/manifest.json');
            if (res.ok) {
                const manifest = await res.json();

                // Mapear el manifiesto y, si es necesario, cargar contenido adicional
                // En este caso, asumimos que el manifiesto puede tener metadata suficiente, 
                // o cargamos el contenido bajo demanda al importar.
                // Para simplificar la vista previa, cargamos los JSONs individuales si están en el manifiesto.

                const templatesWithContent = await Promise.all(manifest.map(async (item: any) => {
                    try {
                        const contentRes = await fetch(`/plantillas/${item.filename}`);
                        if (contentRes.ok) {
                            const content = await contentRes.json();
                            return {
                                ...item,
                                content // Guardamos el contenido completo para la previsualización
                            };
                        }
                        return item;
                    } catch (e) {
                        console.error(`Error loading template ${item.filename}`, e);
                        return item;
                    }
                }));

                setGalleryTemplates(templatesWithContent);
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Error al cargar la galería", variant: "destructive" });
        } finally {
            setIsGalleryLoading(false);
        }
    };

    useEffect(() => {
        loadPlantillas()
    }, [])

    useEffect(() => {
        if (activeTab === 'gallery') {
            loadGallery();
        }
    }, [activeTab])

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
            const newTemplateData = {
                ...template.content,
                nombre: `${template.nombre} (Copia)`,
                activa: false, // Importar como inactiva
                id: undefined // Dejar que el servicio genere ID
            };

            // Si el servicio devuelve el ID de la nueva plantilla:
            const id = await plantillaService.create(newTemplateData);

            toast({
                title: "Plantilla Importada",
                description: "La plantilla se ha añadido a tu colección."
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
                <Link href="/recetas/plantillas/nueva">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Plantilla
                    </Button>
                </Link>
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
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="animate-pulse h-48 bg-slate-100" />
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
                            <Link href="/recetas/plantillas/nueva">
                                <Button variant="outline">Crear mi primera plantilla</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {plantillas.map((plantilla) => (
                            <Card key={plantilla.id} className={`relative overflow-hidden transition-all hover:shadow-md ${plantilla.activa ? 'border-green-500 ring-1 ring-green-500' : ''}`}>
                                {plantilla.activa && (
                                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl z-10">
                                        Activa
                                    </div>
                                )}
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex justify-between items-start text-base">
                                        <span className="truncate pr-2" title={plantilla.nombre}>{plantilla.nombre}</span>
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Papel: {plantilla.tamanoPapel === 'carta' ? 'Carta' : 'Media Carta'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className={`border rounded flex items-center justify-center mb-4 relative overflow-hidden group mx-auto text-center bg-slate-50
                                        ${plantilla.tamanoPapel === 'carta' ? 'aspect-[8.5/11]' : 'aspect-[8.5/5.5]'} w-full shadow-sm`}
                                    >
                                        {plantilla.imagenFondo ? (
                                            <img
                                                src={plantilla.imagenFondo}
                                                alt="Previsualización"
                                                className="w-full h-full object-cover opacity-50"
                                            />
                                        ) : (
                                            <div className="text-xs text-slate-400">Sin fondo</div>
                                        )}
                                        {/* Miniatura de campos */}
                                        <div className="absolute inset-0 p-2 overflow-hidden pointer-events-none">
                                            {plantilla.campos.filter(c => c.visible).map(c => (
                                                <div
                                                    key={c.id}
                                                    className="absolute bg-blue-200/50 border border-blue-300/50 rounded-[1px]"
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

                                    <div className="flex justify-between gap-2">
                                        {!plantilla.activa && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8 text-xs px-2"
                                                onClick={(e) => handleActivate(plantilla.id, e)}
                                            >
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Activar
                                            </Button>
                                        )}
                                        <div className="flex gap-2 ml-auto">
                                            <Link href={`/recetas/plantillas/${plantilla.id}`}>
                                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                                                onClick={() => setDeleteId(plantilla.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )
            ) : (
                /* Gallery Tab UI */
                <div className="space-y-4">
                    <p className="text-sm text-slate-500">
                        Seleccione una plantilla base para importarla a su colección y personalizarla.
                    </p>
                    {isGalleryLoading ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {[1].map((i) => <Card key={i} className="animate-pulse h-48 bg-slate-100" />)}
                        </div>
                    ) : galleryTemplates.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            No hay plantillas públicas disponibles por el momento.
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {galleryTemplates.map((template, idx) => (
                                <Card key={idx} className="relative overflow-hidden transition-all hover:shadow-md border-slate-200">
                                    <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-bl">
                                        GALERÍA
                                    </div>
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex justify-between items-start text-base">
                                            <span className="truncate pr-2" title={template.nombre}>{template.nombre}</span>
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Papel: {template.tamanoPapel === 'carta' ? 'Carta' : 'Media Carta'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className={`border rounded flex items-center justify-center mb-4 relative overflow-hidden mx-auto text-center bg-slate-50
                                            ${template.tamanoPapel === 'carta' ? 'aspect-[8.5/11]' : 'aspect-[8.5/5.5]'} w-full shadow-sm`}
                                        >
                                            {template.imagenFondo || template.content?.imagenFondo ? (
                                                <img
                                                    src={template.imagenFondo || template.content?.imagenFondo}
                                                    alt="Previsualización"
                                                    className="w-full h-full object-cover opacity-50"
                                                />
                                            ) : (
                                                <div className="text-xs text-slate-400">Sin fondo</div>
                                            )}
                                            <div className="absolute inset-0 p-2 overflow-hidden pointer-events-none">
                                                {template.content?.campos?.filter((c: any) => c.visible).map((c: any) => (
                                                    <div
                                                        key={c.id}
                                                        className="absolute bg-slate-400/30 border border-slate-500/30 rounded-[1px]"
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

                                        <Button
                                            className="w-full"
                                            variant="secondary"
                                            onClick={() => handleImportTemplate(template)}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Importar a Mis Plantillas
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

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
        </div>
    )
}
