/**
 * @fileoverview Página de gestión de medicamentos
 * 
 * Permite administrar el catálogo completo de medicamentos:
 * - Ver todos los medicamentos
 * - Filtrar por categoría y tipo (catálogo/personalizados)
 * - Buscar medicamentos
 * - Crear nuevos medicamentos
 * - Editar medicamentos existentes
 * - Eliminar medicamentos
 * - Importar/Exportar datos en formato JSON
 */

"use client"

import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
    obtenerMedicamentos,
    eliminarMedicamento,
    obtenerEstadisticasMedicamentos,
} from '@/shared/services/medicamentos.service'
import { MedicamentoCatalogo } from '@/types'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/shared/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'
import { useToast } from '@/shared/components/ui/use-toast'
import { Badge } from '@/shared/components/ui/badge'
import { Plus, Package, ChevronLeft, ChevronRight, LayoutGrid, List, Layers, Pill, Activity, Pencil, Trash2 } from 'lucide-react'
import { CatalogHeader } from '@/shared/components/catalog/CatalogHeader'
import { StatsCards } from '@/shared/components/catalog/StatsCards'
import { CatalogFilters } from '@/shared/components/catalog/CatalogFilters'
import { TableActions } from '@/shared/components/catalog/TableActions'
import { MedicamentoDialog } from "@/features/medicamentos/components/MedicamentoDialog"

/**
 * Componente principal de gestión de medicamentos
 */
export default function MedicamentosPage() {
    const [medicamentos, setMedicamentos] = useState<MedicamentoCatalogo[]>([])
    const [filtroCategoria, setFiltroCategoria] = useState<string>('todas')
    const [filtroTipo, setFiltroTipo] = useState<'todos' | 'catalogo' | 'personalizados'>('todos')
    const [ordenPor, setOrdenPor] = useState<'nombre' | 'uso' | 'reciente'>('uso') // Ordenar por más usados por defecto
    const [busqueda, setBusqueda] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [medicamentoEditando, setMedicamentoEditando] = useState<MedicamentoCatalogo | null>(null)
    const [medicamentoEliminar, setMedicamentoEliminar] = useState<MedicamentoCatalogo | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'list'>('list')
    const [paginaActual, setPaginaActual] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [itemsPorPagina, setItemsPorPagina] = useState(20)
    const { toast } = useToast()

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

    // Estadísticas en tiempo real
    const estadisticas = useLiveQuery(
        () => obtenerEstadisticasMedicamentos(),
        []
    )

    /**
     * Carga medicamentos con filtros aplicados
     */
    const cargarMedicamentos = async () => {
        setIsLoading(true)
        try {
            const filtros: any = {
                ordenarPor: ordenPor,
                busqueda: busqueda // Pasar búsqueda al servicio
            }

            if (filtroCategoria !== 'todas') {
                filtros.categoria = filtroCategoria
            }

            if (filtroTipo === 'catalogo') {
                filtros.soloPersonalizados = false
            } else if (filtroTipo === 'personalizados') {
                filtros.soloPersonalizados = true
            }

            // Paginación
            const offset = (paginaActual - 1) * itemsPorPagina
            const { items, total } = await obtenerMedicamentos(filtros, { offset, limit: itemsPorPagina })

            setMedicamentos(items)
            setTotalItems(total)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        cargarMedicamentos()
    }, [filtroCategoria, filtroTipo, ordenPor, busqueda, paginaActual])

    // Resetear a página 1 cuando cambian los filtros
    useEffect(() => {
        setPaginaActual(1)
    }, [filtroCategoria, filtroTipo, ordenPor, busqueda])

    /**
     * Abre el diálogo para crear un nuevo medicamento
     */
    const handleNuevoMedicamento = () => {
        setMedicamentoEditando(null)
        setIsDialogOpen(true)
    }

    /**
     * Abre el diálogo para editar un medicamento existente
     */
    const handleEditarMedicamento = (medicamento: MedicamentoCatalogo) => {
        setMedicamentoEditando(medicamento)
        setIsDialogOpen(true)
    }

    /**
     * Confirma y elimina un medicamento
     */
    const handleEliminarConfirmado = async () => {
        if (!medicamentoEliminar) return

        try {
            await eliminarMedicamento(medicamentoEliminar.id!)
            toast({
                title: 'Medicamento eliminado',
                description: `${medicamentoEliminar.nombre} ha sido eliminado del catálogo.`,
            })
            setMedicamentoEliminar(null)
            await cargarMedicamentos()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'No se pudo eliminar el medicamento',
                variant: 'destructive',
            })
        }
    }


    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <CatalogHeader
                    title="Catálogo de Medicamentos"
                    description="Administra el catálogo completo de medicamentos"
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
                        onClick={handleNuevoMedicamento}
                    >
                        <Plus size={18} />
                        <span>Nuevo Medicamento</span>
                    </Button>
                </div>
            </div>

            {/* Estadísticas */}
            {estadisticas && (
                <StatsCards
                    stats={[
                        {
                            title: "Total Medicamentos",
                            value: estadisticas.total,
                            icon: Package
                        },
                        {
                            title: "Del Catálogo",
                            value: estadisticas.delCatalogo,
                            icon: Package
                        },
                        {
                            title: "Personalizados",
                            value: estadisticas.personalizados,
                            icon: Package
                        }
                    ]}
                />
            )}

            {/* Filtros y Búsqueda */}
            <CatalogFilters
                searchValue={busqueda}
                onSearchChange={setBusqueda}
                searchPlaceholder="Buscar medicamento..."
            >
                <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                    <SelectTrigger>
                        <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todas">Todas las categorías</SelectItem>
                        {estadisticas?.categorias.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={filtroTipo} onValueChange={(value: any) => setFiltroTipo(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="catalogo">Del catálogo</SelectItem>
                        <SelectItem value="personalizados">Personalizados</SelectItem>
                    </SelectContent>
                </Select>
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

            {/* Contenedor de Medicamentos */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium animate-pulse">Cargando catálogo...</p>
                </div>
            ) : medicamentos.length === 0 ? (
                <Card className="text-center py-16 border-dashed bg-slate-50/50">
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="bg-slate-100 p-6 rounded-3xl dark:bg-slate-800">
                            <Package size={64} className="text-slate-300" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Sin medicamentos</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                No se encontraron medicamentos registrados con los criterios de búsqueda.
                            </p>
                        </div>
                        <Button variant="outline" className="mt-4 rounded-xl" onClick={handleNuevoMedicamento}>
                            Agregar Primer Medicamento
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {/* Vista de Tarjetas (Grid) */}
                    {viewMode === 'grid' && (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {medicamentos.map((med) => (
                                <Card key={med.id} className="group relative overflow-hidden hover:border-blue-500/50 hover:shadow-md transition-all h-full rounded-2xl border-slate-200 dark:border-slate-800">
                                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                                <Pill className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <CardTitle className="text-sm font-bold group-hover:text-blue-600 transition-colors truncate">
                                                    {med.nombre}
                                                </CardTitle>
                                                <p className="text-[10px] text-muted-foreground truncate">
                                                    {med.nombreGenerico || 'Sin genérico'}
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                                            <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Presentación</p>
                                                <p className="font-bold truncate" title={med.presentacion}>{med.presentacion || '---'}</p>
                                            </div>
                                            <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Tipo</p>
                                                {med.esPersonalizado ? (
                                                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none h-4 text-[8px] px-1 font-black">PERSONALIZADO</Badge>
                                                ) : (
                                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none h-4 text-[8px] px-1 font-black">CATÁLOGO</Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-3 border-t border-slate-100">
                                            <div className="flex items-center gap-1">
                                                <Activity className="h-3 w-3 text-orange-500" />
                                                <span className="font-bold">{med.vecesUsado || 0} usos</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                                                    onClick={() => handleEditarMedicamento(med)}
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-lg hover:bg-red-50 hover:text-red-600"
                                                    onClick={() => setMedicamentoEliminar(med)}
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
                        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
                            {medicamentos.map((med) => (
                                <div key={med.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-300 transition-colors shadow-sm group">
                                    <div className="flex items-center gap-3 text-left min-w-0">
                                        <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <Pill size={16} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-bold text-xs truncate">{med.nombre}</h4>
                                            <p className="text-[9px] text-slate-500 truncate">
                                                {med.categoria || 'Sin categoría'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditarMedicamento(med)}>
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
                                        <TableHead className="font-black text-[10px] uppercase text-slate-500">Nombre</TableHead>
                                        <TableHead className="font-black text-[10px] uppercase text-slate-500">Genérico</TableHead>
                                        <TableHead className="font-black text-[10px] uppercase text-slate-500">Presentación</TableHead>
                                        <TableHead className="font-black text-[10px] uppercase text-slate-500">Categoría</TableHead>
                                        <TableHead className="text-center font-black text-[10px] uppercase text-slate-500">Tipo</TableHead>
                                        <TableHead className="text-center font-black text-[10px] uppercase text-slate-500">Usos</TableHead>
                                        <TableHead className="text-right font-black text-[10px] uppercase text-slate-500">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {medicamentos.map((med) => (
                                        <TableRow key={med.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                            <TableCell className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{med.nombre}</TableCell>
                                            <TableCell className="text-slate-600 dark:text-slate-400">{med.nombreGenerico || '-'}</TableCell>
                                            <TableCell className="text-slate-500 text-xs">{med.presentacion || '-'}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-[9px] font-bold border-slate-200">{med.categoria || '-'}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {med.esPersonalizado ? (
                                                    <Badge className="bg-blue-50 text-blue-600 border-blue-100 text-[9px] font-black">PERSONALIZADO</Badge>
                                                ) : (
                                                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[9px] font-black">CATÁLOGO</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                                                    {med.vecesUsado}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <TableActions
                                                    onEdit={() => handleEditarMedicamento(med)}
                                                    onDelete={() => setMedicamentoEliminar(med)}
                                                    editLabel="Editar medicamento"
                                                    deleteLabel="Eliminar medicamento"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    )}

                    {/* Controles de Paginación */}
                    {totalItems > itemsPorPagina && (
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="text-xs text-muted-foreground order-2 sm:order-1 w-full sm:w-auto text-center sm:text-left">
                                Mostrando <span className="font-bold text-slate-900 dark:text-slate-100">{Math.min((paginaActual - 1) * itemsPorPagina + 1, totalItems)}</span> - <span className="font-bold text-slate-900 dark:text-slate-100">{Math.min(paginaActual * itemsPorPagina, totalItems)}</span> de <span className="font-bold text-slate-900 dark:text-slate-100">{totalItems}</span> medicamentos
                            </div>

                            <div className="flex items-center justify-center gap-3 order-1 sm:order-2 w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                                    disabled={paginaActual === 1 || isLoading}
                                    className="rounded-xl h-10 px-3 flex items-center gap-2 border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                                >
                                    <ChevronLeft size={16} />
                                    <span className="hidden sm:inline font-medium">Anterior</span>
                                </Button>

                                <div className="flex items-center justify-center h-10 px-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-400">
                                    Página {paginaActual} de {Math.ceil(totalItems / itemsPorPagina)}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPaginaActual(prev => prev + 1)}
                                    disabled={paginaActual * itemsPorPagina >= totalItems || isLoading}
                                    className="rounded-xl h-10 px-3 flex items-center gap-2 border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                                >
                                    <span className="hidden sm:inline font-medium">Siguiente</span>
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <MedicamentoDialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        cargarMedicamentos();
                    }
                }}
                initialData={medicamentoEditando}
                isEditing={!!medicamentoEditando}
            />

            {/* Dialog de Confirmación de Eliminación */}
            <AlertDialog open={!!medicamentoEliminar} onOpenChange={() => setMedicamentoEliminar(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. El medicamento &quot;{medicamentoEliminar?.nombre}&quot; será eliminado permanentemente del catálogo.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleEliminarConfirmado} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
