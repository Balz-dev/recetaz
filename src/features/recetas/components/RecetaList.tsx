"use client"

import { useState, useEffect } from "react"
import { Receta } from "@/types"
import { recetaService } from "@/features/recetas/services/receta.service"
import { pacienteService } from "@/features/pacientes/services/paciente.service"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import {
    Search,
    FileText,
    PlusCircle,
    LayoutGrid,
    List,
    Layers,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Calendar,
    User,
    Stethoscope,
    Pill,
    Hash,
    Clock
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { RecetaDialog } from "./RecetaDialog"
import { useSearchParams, useRouter } from "next/navigation"
import { Badge } from "@/shared/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"

/**
 * Modos de visualización para el historial de recetas.
 */
type ViewMode = 'grid' | 'compact' | 'list';

/**
 * Componente para listar y gestionar el historial de recetas médicas.
 * Implementa filtrado, paginación y múltiples modos de visualización.
 * 
 * @returns Componente JSX con el listado de recetas.
 */
export function RecetaList() {
    const [recetas, setRecetas] = useState<Receta[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(9)

    // Actualizar pageSize automáticamente según el modo de vista
    useEffect(() => {
        const modeSizes = {
            grid: 9,
            compact: 28,
            list: 12
        };
        setPageSize(modeSizes[viewMode]);
        setCurrentPage(1);
    }, [viewMode]);

    const searchParams = useSearchParams()
    const router = useRouter()

    // Carga inicial de datos
    useEffect(() => {
        loadData()
        if (searchParams.get("create") === "true") {
            setIsDialogOpen(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Búsqueda con debounce
    useEffect(() => {
        const search = async () => {
            if (searchTerm.trim() === "") {
                await loadData()
            } else {
                const results = await recetaService.search(searchTerm)
                setRecetas(results)
                setCurrentPage(1)
            }
        }
        const timeoutId = setTimeout(() => {
            search()
        }, 300)
        return () => clearTimeout(timeoutId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm])

    /**
     * Carga todas las recetas desde el servicio.
     */
    const loadData = async () => {
        setLoading(true)
        try {
            const data = await recetaService.getAll()
            setRecetas(data)
            setCurrentPage(1)
        } catch (error) {
            console.error("Error cargando recetas:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSuccess = () => {
        loadData()
        setIsDialogOpen(false)
        removeCreateParam()
    }

    const handleOpenChange = (open: boolean) => {
        setIsDialogOpen(open)
        if (!open) {
            removeCreateParam()
        }
    }

    const removeCreateParam = () => {
        const params = new URLSearchParams(searchParams.toString())
        if (params.has("create")) {
            params.delete("create")
            router.replace(`/recetas?${params.toString()}`)
        }
    }

    // Lógica de paginación
    const totalPages = Math.ceil(recetas.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const paginatedRecetas = recetas.slice(startIndex, startIndex + pageSize)

    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))

    return (
        <div className="space-y-6">
            {/* Barra de herramientas: Búsqueda y Visualización */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                        <Input
                            placeholder="Buscar por folio, paciente o diagnóstico..."
                            className="pl-10 h-10 rounded-xl shadow-sm border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
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
                            className="flex-1 md:flex-none gap-2 bg-indigo-600 hover:bg-indigo-700 h-10 rounded-xl px-4"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            <PlusCircle size={18} />
                            <span>Nueva Receta</span>
                        </Button>
                    </div>
                </div>

                {/* Info de resultados */}
                {recetas.length > 0 && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                        <p>Mostrando {startIndex + 1}-{Math.min(startIndex + pageSize, recetas.length)} de {recetas.length} recetas emitidas</p>
                    </div>
                )}
            </div>

            <RecetaDialog
                open={isDialogOpen}
                onOpenChange={handleOpenChange}
                onSuccess={handleSuccess}
            />

            {/* Contenedor de Recetas */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium animate-pulse">Consultando historial...</p>
                </div>
            ) : recetas.length === 0 ? (
                <Card className="text-center py-16 border-dashed bg-slate-50/50">
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="bg-slate-100 p-6 rounded-3xl dark:bg-slate-800">
                            <FileText size={64} className="text-slate-300" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Sin recetas</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                No se encontraron registros de recetas médicas emitidas.
                            </p>
                        </div>
                        <Button variant="outline" className="mt-4 rounded-xl" onClick={() => setIsDialogOpen(true)}>
                            Emitir Primera Receta
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {/* Vista de Tarjetas */}
                    {viewMode === 'grid' && (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {paginatedRecetas.map((receta) => (
                                <Link key={receta.id} href={`/recetas/${receta.id}`}>
                                    <Card className="group relative overflow-hidden hover:border-indigo-500/50 hover:shadow-md transition-all h-full rounded-2xl border-slate-200 dark:border-slate-800">
                                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                                                    <Hash className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-base font-bold group-hover:text-indigo-600 transition-colors">
                                                        Folio: {receta.numeroReceta}
                                                    </CardTitle>
                                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {format(new Date(receta.fechaEmision), "d MMM yyyy, HH:mm", { locale: es })}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] bg-slate-50 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                ID: {receta.id.substring(0, 4)}
                                            </Badge>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <User className="h-4 w-4 text-slate-400" />
                                                    <span className="font-bold text-slate-900 dark:text-slate-100">{receta.pacienteNombre}</span>
                                                    <span className="text-xs text-slate-500">• {receta.pacienteEdad} años</span>
                                                </div>
                                                <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                                                    <Stethoscope className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                                                    <p className="italic line-clamp-1">{receta.diagnostico}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 text-xs text-slate-500 px-1 border-t pt-3">
                                                <div className="flex items-center gap-1">
                                                    <Pill className="h-3 w-3 text-emerald-500" />
                                                    <span className="font-semibold">{receta.medicamentos.length} Medicamentos</span>
                                                </div>
                                                <div className="flex items-center gap-1 ml-auto group-hover:translate-x-1 transition-transform">
                                                    <span className="text-[10px] uppercase font-bold text-indigo-500">Ver Receta</span>
                                                    <ArrowRight className="h-3 w-3 text-indigo-500" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Vista Compacta */}
                    {viewMode === 'compact' && (
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {paginatedRecetas.map((receta) => (
                                <Link key={receta.id} href={`/recetas/${receta.id}`}>
                                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-300 transition-colors shadow-sm group">
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="h-10 w-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                <FileText size={20} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-bold text-sm truncate">{receta.pacienteNombre}</h4>
                                                    <span className="text-[10px] font-black text-slate-300">#{receta.numeroReceta}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-500 flex items-center gap-2 mt-1">
                                                    <Clock className="h-3 w-3" />
                                                    {format(new Date(receta.fechaEmision), "dd/MM/yy")} • {receta.medicamentos.length} meds.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Vista de Lista */}
                    {viewMode === 'list' && (
                        <Card className="rounded-2xl overflow-hidden border-slate-100 shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold uppercase text-[10px]">
                                        <tr>
                                            <th className="px-6 py-3">Folio</th>
                                            <th className="px-6 py-3">Paciente</th>
                                            <th className="px-6 py-3">Diagnóstico</th>
                                            <th className="px-6 py-3">Meds</th>
                                            <th className="px-6 py-3 text-right">Emisión</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {paginatedRecetas.map((receta) => (
                                            <tr key={receta.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group" onClick={() => (router.push(`/recetas/${receta.id}`))}>
                                                <td className="px-6 py-4">
                                                    <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none">#{receta.numeroReceta}</Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600">{receta.pacienteNombre}</span>
                                                </td>
                                                <td className="px-6 py-4 max-w-[200px] truncate italic text-slate-500">
                                                    {receta.diagnostico}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold">
                                                        <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">{receta.medicamentos.length}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right text-slate-400 text-[10px]">
                                                    {format(new Date(receta.fechaEmision), "dd/MM/yyyy HH:mm")}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}

                    {/* Controles de Paginación */}
                    {totalPages > 1 && (
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-8 border-t border-slate-100 dark:border-slate-800">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="rounded-xl h-10 px-3 flex items-center gap-2 border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                            >
                                <ChevronLeft size={16} />
                                <span className="hidden sm:inline font-medium">Anterior</span>
                            </Button>

                            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl overflow-hidden">
                                {(() => {
                                    const pages = [];
                                    const delta = 1; // Páginas a mostrar a cada lado de la actual
                                    const left = currentPage - delta;
                                    const right = currentPage + delta;

                                    for (let i = 1; i <= totalPages; i++) {
                                        if (i === 1 || i === totalPages || (i >= left && i <= right)) {
                                            pages.push(i);
                                        } else if (i === left - 1 || i === right + 1) {
                                            pages.push("...");
                                        }
                                    }

                                    return pages.map((page, i) => {
                                        if (page === "...") {
                                            return (
                                                <span key={`ellipsis-${i}`} className="px-1 text-slate-400 text-xs font-bold">
                                                    ...
                                                </span>
                                            );
                                        }

                                        const pageNum = page as number;
                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={currentPage === pageNum ? 'secondary' : 'ghost'}
                                                size="sm"
                                                className={`h-8 min-w-[32px] px-2 rounded-xl font-bold text-xs transition-all ${currentPage === pageNum
                                                    ? 'shadow-sm bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400'
                                                    : 'text-slate-500 hover:text-indigo-600'
                                                    }`}
                                                onClick={() => setCurrentPage(pageNum)}
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    });
                                })()}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className="rounded-xl h-10 px-3 flex items-center gap-2 border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                            >
                                <span className="hidden sm:inline font-medium">Siguiente</span>
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
