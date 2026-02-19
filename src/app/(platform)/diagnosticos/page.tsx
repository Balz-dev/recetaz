
"use client"

import { useState, useEffect } from "react"
import { Plus, Search, ChevronLeft, ChevronRight, Activity, Stethoscope, LayoutGrid, List, Layers, ArrowRight, Hash, Clock, Pencil, Trash2, Package } from "lucide-react"
import { DiagnosticoCatalogo } from "@/types"
import { diagnosticoService } from "@/features/diagnosticos/services/diagnostico.service"
import { DiagnosticoDialog } from "@/features/diagnosticos/components/DiagnosticoDialog"
import { useToast } from "@/shared/components/ui/use-toast"
import { Badge } from "@/shared/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { CatalogHeader } from "@/shared/components/catalog/CatalogHeader"
import { StatsCards } from "@/shared/components/catalog/StatsCards"
import { CatalogFilters } from "@/shared/components/catalog/CatalogFilters"
import { TableActions } from "@/shared/components/catalog/TableActions"

export default function DiagnosticosPage() {
    const [diagnosticos, setDiagnosticos] = useState<DiagnosticoCatalogo[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [ordenPor, setOrdenPor] = useState<'nombre' | 'uso' | 'reciente'>('uso')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedDiagnostico, setSelectedDiagnostico] = useState<DiagnosticoCatalogo | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [diagnosticoToDelete, setDiagnosticoToDelete] = useState<number | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'list'>('list')
    const [paginaActual, setPaginaActual] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [itemsPorPagina, setItemsPorPagina] = useState(20)

    // Actualizar itemsPorPagina automáticamente según el modo de vista
    useEffect(() => {
        const modeSizes = {
            grid: 12,
            compact: 28,
            list: 20
        };
        setItemsPorPagina(modeSizes[viewMode]);
        setPaginaActual(1);
    }, [viewMode]);
    const [estadisticas, setEstadisticas] = useState<{
        total: number
        especialidades: string[]
        masUsados: DiagnosticoCatalogo[]
    } | null>(null)

    const { toast } = useToast()

    const loadDiagnosticos = async () => {
        setLoading(true)
        try {
            const offset = (paginaActual - 1) * itemsPorPagina
            const { items, total } = await diagnosticoService.getAll(offset, itemsPorPagina, ordenPor, searchTerm)
            setDiagnosticos(items)
            setTotalItems(total)
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "No se pudieron cargar los diagnósticos.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const loadEstadisticas = async () => {
        try {
            const stats = await diagnosticoService.getEstadisticas()
            setEstadisticas(stats)
        } catch (error) {
            console.error(error)
        }
    }

    // Cargar estadísticas al montar
    useEffect(() => {
        loadEstadisticas()
    }, [])

    // Cargar diagnósticos cuando cambian los filtros o la página
    useEffect(() => {
        const timer = setTimeout(() => {
            loadDiagnosticos()
        }, 500)
        return () => clearTimeout(timer)
    }, [searchTerm, ordenPor, paginaActual])

    // Reiniciar a la primera página si cambia la búsqueda
    useEffect(() => {
        setPaginaActual(1)
    }, [searchTerm])

    const handleCreate = () => {
        setSelectedDiagnostico(null)
        setIsDialogOpen(true)
    }

    const handleEdit = (diagnostico: DiagnosticoCatalogo) => {
        setSelectedDiagnostico(diagnostico)
        setIsDialogOpen(true)
    }

    const confirmDelete = (id: number) => {
        setDiagnosticoToDelete(id)
        setIsDeleteDialogOpen(true)
    }

    const handleSubmit = async (data: Omit<DiagnosticoCatalogo, 'id'>) => {
        try {
            if (selectedDiagnostico?.id) {
                await diagnosticoService.update(selectedDiagnostico.id, data)
                toast({ title: "Diagnóstico actualizado exitosamente" })
            } else {
                await diagnosticoService.create(data)
                toast({ title: "Diagnóstico creado exitosamente" })
            }
            loadDiagnosticos()
            loadEstadisticas()
        } catch (error) {
            console.error(error)
            toast({
                title: "Error al guardar",
                description: "Verifica que el código no esté duplicado.",
                variant: "destructive"
            })
        }
    }

    const handleDelete = async () => {
        if (!diagnosticoToDelete) return
        try {
            await diagnosticoService.delete(diagnosticoToDelete)
            toast({ title: "Diagnóstico eliminado" })
            loadDiagnosticos()
            loadEstadisticas()
        } catch (error) {
            toast({ title: "Error al eliminar", variant: "destructive" })
        } finally {
            setIsDeleteDialogOpen(false)
            setDiagnosticoToDelete(null)
        }
    }


    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <CatalogHeader
                    title="Catálogo de Diagnósticos"
                    description="Gestiona los códigos CIE-11 y diagnósticos frecuentes."
                />
                <div className="flex items-center gap-2">
                    {/* Selector de modo de vista */}
                    <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mr-2">
                        <Button
                            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-8 w-8 p-0 rounded-md"
                            onClick={() => setViewMode('grid')}
                            title="Vista de tarjetas"
                        >
                            <LayoutGrid size={16} />
                        </Button>
                        <Button
                            variant={viewMode === 'compact' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-8 w-8 p-0 rounded-md"
                            onClick={() => setViewMode('compact')}
                            title="Vista compacta"
                        >
                            <Layers size={16} />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-8 w-8 p-0 rounded-md"
                            onClick={() => setViewMode('list')}
                            title="Vista de lista"
                        >
                            <List size={16} />
                        </Button>
                    </div>

                    <Button
                        className="flex-1 md:flex-none gap-2 bg-blue-600 hover:bg-blue-700 h-10 rounded-xl px-4"
                        onClick={handleCreate}
                    >
                        <Plus size={18} />
                        <span>Nuevo Diagnóstico</span>
                    </Button>
                </div>
            </div>

            {/* Estadísticas */}
            {estadisticas && (
                <StatsCards
                    stats={[
                        {
                            title: "Total Diagnósticos",
                            value: estadisticas.total,
                            icon: Package
                        },
                        {
                            title: "Especialidades",
                            value: estadisticas.especialidades.length,
                            icon: Package
                        },
                        {
                            title: "Más Usados",
                            value: estadisticas.masUsados.length,
                            icon: Package
                        }
                    ]}
                />
            )}

            {/* Filtros */}
            <CatalogFilters
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Buscar por código, nombre o especialidad..."
            >
                <Select value={ordenPor} onValueChange={(value: any) => setOrdenPor(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="nombre">Nombre</SelectItem>
                        <SelectItem value="uso">Más usados</SelectItem>
                        <SelectItem value="reciente">Más recientes</SelectItem>
                    </SelectContent>
                </Select>
            </CatalogFilters>

            {/* Contenedor de Diagnósticos */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium animate-pulse">Cargando diagnósticos...</p>
                </div>
            ) : diagnosticos.length === 0 ? (
                <Card className="text-center py-16 border-dashed bg-slate-50/50">
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="bg-slate-100 p-6 rounded-3xl dark:bg-slate-800">
                            <Activity size={64} className="text-slate-300" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Sin diagnósticos</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                No se encontraron diagnósticos registrados con los criterios de búsqueda.
                            </p>
                        </div>
                        <Button variant="outline" className="mt-4 rounded-xl" onClick={handleCreate}>
                            Agregar Primer Diagnóstico
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {/* Vista de Tarjetas (Grid) */}
                    {viewMode === 'grid' && (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {diagnosticos.map((diag) => (
                                <Card key={diag.id} className="group relative overflow-hidden hover:border-blue-500/50 hover:shadow-md transition-all h-full rounded-2xl border-slate-200 dark:border-slate-800">
                                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                                <Stethoscope className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <CardTitle className="text-sm font-bold group-hover:text-blue-600 transition-colors truncate" title={diag.nombre}>
                                                    {diag.nombre}
                                                </CardTitle>
                                                <p className="text-[10px] text-muted-foreground truncate">
                                                    Código: {diag.codigo || '---'}
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex flex-wrap gap-1">
                                            {diag.especialidad && diag.especialidad.length > 0 ? (
                                                diag.especialidad.slice(0, 2).map((esp, i) => (
                                                    <Badge key={i} variant="info" className="text-[9px] h-4">
                                                        {esp}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-[10px] text-slate-400 italic">General</span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-3 border-t border-slate-100">
                                            <div className="flex items-center gap-1">
                                                <span className="font-bold flex items-center gap-1">
                                                    <Activity className="h-3 w-3 text-orange-500" />
                                                    {diag.vecesUsado || 0} usos
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                                                    onClick={() => handleEdit(diag)}
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-lg hover:bg-red-50 hover:text-red-600"
                                                    onClick={() => confirmDelete(diag.id!)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Vista Compacta */}
                    {viewMode === 'compact' && (
                        <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {diagnosticos.map((diag) => (
                                <div key={diag.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-300 transition-colors shadow-sm group">
                                    <div className="flex items-center gap-3 text-left min-w-0">
                                        <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <Activity size={16} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-bold text-[11px] truncate">{diag.nombre}</h4>
                                            <p className="text-[9px] text-slate-500 truncate">
                                                {diag.codigo || 'S/C'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEdit(diag)}>
                                                <Pencil size={12} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Vista de Lista (Tabla) */}
                    {viewMode === 'list' && (
                        <Card className="rounded-2xl overflow-hidden border-slate-100 shadow-sm">
                            <Table>
                                <TableHeader className="bg-slate-50/50 dark:bg-slate-800/30">
                                    <TableRow>
                                        <TableHead className="w-[100px] font-black text-[10px] uppercase text-slate-500">Código</TableHead>
                                        <TableHead className="font-black text-[10px] uppercase text-slate-500">Nombre</TableHead>
                                        <TableHead className="hidden md:table-cell font-black text-[10px] uppercase text-slate-500">Especialidad</TableHead>
                                        <TableHead className="text-center font-black text-[10px] uppercase text-slate-500">Usos</TableHead>
                                        <TableHead className="text-right font-black text-[10px] uppercase text-slate-500">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {diagnosticos.map((diag) => (
                                        <TableRow key={diag.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                            <TableCell className="font-medium font-mono text-xs text-slate-500 group-hover:text-blue-600 transition-colors">
                                                {diag.codigo}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-bold text-slate-900 dark:text-slate-100">{diag.nombre}</div>
                                                {diag.sinonimos && diag.sinonimos.length > 0 && (
                                                    <div className="text-[10px] text-slate-500 truncate max-w-[300px]">
                                                        {diag.sinonimos.join(", ")}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex gap-1 flex-wrap">
                                                    {diag.especialidad?.slice(0, 2).map((esp, i) => (
                                                        <Badge key={i} variant="info" className="text-[9px] font-bold">
                                                            {esp}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                                                    {diag.vecesUsado || 0}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <TableActions
                                                    onEdit={() => handleEdit(diag)}
                                                    onDelete={() => confirmDelete(diag.id!)}
                                                    editLabel="Editar diagnóstico"
                                                    deleteLabel="Eliminar diagnóstico"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    )}
                </div>
            )}

            <DiagnosticoDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleSubmit}
                diagnostico={selectedDiagnostico}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar diagnóstico?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. El diagnóstico será eliminado del catálogo local.
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
