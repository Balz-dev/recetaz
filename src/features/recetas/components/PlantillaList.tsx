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

    useEffect(() => {
        loadPlantillas()
    }, [])

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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
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

            {isLoading ? (
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
                <div className="grid gap-6 md:grid-cols-2">
                    {plantillas.map((plantilla) => (
                        <Card key={plantilla.id} className={`relative overflow-hidden transition-all hover:shadow-md ${plantilla.activa ? 'border-green-500 ring-1 ring-green-500' : ''}`}>
                            {plantilla.activa && (
                                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl">
                                    Activa
                                </div>
                            )}
                            <CardHeader className="pb-4">
                                <CardTitle className="flex justify-between items-start">
                                    <span className="truncate pr-2">{plantilla.nombre}</span>
                                </CardTitle>
                                <CardDescription>
                                    Papel: {plantilla.tamanoPapel === 'carta' ? 'Carta' : 'Media Carta'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className={`border rounded flex items-center justify-center mb-4 relative overflow-hidden group mx-auto text-center bg-slate-50
                                    ${plantilla.tamanoPapel === 'carta' ? 'aspect-[8.5/11]' : 'aspect-[8.5/5.5]'} w-full max-w-[280px] shadow-sm`}
                                >
                                    {plantilla.imagenFondo ? (
                                        <img 
                                            src={plantilla.imagenFondo} 
                                            alt="Previsualización" 
                                            className="w-full h-full object-cover opacity-50"
                                        />
                                    ) : (
                                        <span className="text-xs text-slate-400">Sin fondo</span>
                                    )}
                                    {/* Miniatura de campos */}
                                    <div className="absolute inset-0 p-2">
                                        {plantilla.campos.filter(c => c.visible).map(c => (
                                            <div 
                                                key={c.id}
                                                className="absolute bg-blue-200/50 border border-blue-300 rounded-[1px]"
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
                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                            onClick={(e) => handleActivate(plantilla.id, e)}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Activar
                                        </Button>
                                    )}
                                    <div className="flex gap-2 ml-auto">
                                        <Link href={`/recetas/plantillas/${plantilla.id}`}>
                                            <Button variant="outline" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button 
                                            variant="outline" 
                                            size="icon"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => setDeleteId(plantilla.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
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
