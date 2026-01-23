"use client"

import { useState, useEffect } from "react"
import { Paciente } from "@/types"
import { pacienteService } from "@/features/pacientes/services/paciente.service"
import { recetaService } from "@/features/recetas/services/receta.service"
import { Input } from "@/shared/components/ui/input"
import { PacienteDialog } from "./PacienteDialog"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Search, UserPlus, User, Calendar, LayoutGrid, List, Layers, ArrowRight, ChevronLeft, ChevronRight, Weight, Ruler, AlertCircle, FileText } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Badge } from "@/shared/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"

import { useRouter } from "next/navigation"

/**
 * Modos de visualización soportados para el directorio de pacientes.
 */
type ViewMode = 'grid' | 'compact' | 'list';

/**
 * Componente principal para listar y gestionar pacientes.
 * Implementa búsqueda, filtrado por modos de vista, paginación y ordenamiento.
 * 
 * @returns Componente JSX con la interfaz de gestión de pacientes.
 */
export function PacienteList() {
    const router = useRouter()
    const [pacientes, setPacientes] = useState<Paciente[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(9)
    const [recetasCounts, setRecetasCounts] = useState<Record<string, number>>({})

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

    // Cargar pacientes al montar el componente
    useEffect(() => {
        loadPacientes()
    }, [])

    // Filtrar pacientes cuando cambia el término de búsqueda con debounce
    useEffect(() => {
        const search = async () => {
            if (searchTerm.trim() === "") {
                await loadPacientes()
            } else {
                const results = await pacienteService.search(searchTerm)
                setPacientes(results)
                loadCountsForPacientes(results)
            }
        }

        const timeoutId = setTimeout(() => {
            search()
        }, 300)
        return () => clearTimeout(timeoutId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm])

    /**
     * Carga todos los pacientes desde el servicio.
     * El servicio ya devuelve los datos ordenados por fecha de creación descendente.
     */
    const loadPacientes = async () => {
        setLoading(true)
        try {
            const data = await pacienteService.getAll()
            setPacientes(data)
            setCurrentPage(1)
            await loadCountsForPacientes(data)
        } catch (error) {
            console.error("Error cargando pacientes:", error)
        } finally {
            setLoading(false)
        }
    }

    /**
     * Carga el conteo de recetas para una lista de pacientes de forma asíncrona.
     */
    const loadCountsForPacientes = async (pacienteList: Paciente[]) => {
        const counts: Record<string, number> = {}
        await Promise.all(pacienteList.map(async (p) => {
            const count = await recetaService.getCountByPacienteId(p.id)
            counts[p.id] = count
        }))
        setRecetasCounts(prev => ({ ...prev, ...counts }))
    }

    /**
     * Callback tras guardar exitosamente un paciente.
     */
    const handleSuccess = () => {
        loadPacientes()
    }

    // Lógica de paginación calculada
    const totalPages = Math.ceil(pacientes.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const paginatedPacientes = pacientes.slice(startIndex, startIndex + pageSize)

    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))

    return (
        <div className="space-y-6">
            {/* Barra de herramientas: Búsqueda y Visualización */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                        <Input
                            placeholder="Buscar por nombre..."
                            className="pl-10 h-10 rounded-xl shadow-sm border-slate-200 focus:ring-2 focus:ring-blue-500/20"
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
                            className="flex-1 md:flex-none gap-2 bg-blue-600 hover:bg-blue-700 h-10 rounded-xl px-4"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            <UserPlus size={18} />
                            <span>Nuevo Paciente</span>
                        </Button>
                    </div>
                </div>

                {pacientes.length > 0 && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                        <p>Mostrando {startIndex + 1}-{Math.min(startIndex + pageSize, pacientes.length)} de {pacientes.length} pacientes</p>
                    </div>
                )}
            </div>

            <PacienteDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSuccess={handleSuccess}
            />

            {/* Contenedor de Pacientes */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium animate-pulse">Cargando directorio...</p>
                </div>
            ) : pacientes.length === 0 ? (
                <Card className="text-center py-16 border-dashed bg-slate-50/50">
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="bg-slate-100 p-6 rounded-3xl dark:bg-slate-800">
                            <User size={64} className="text-slate-300" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Sin pacientes</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                No se encontraron pacientes registrados con los criterios de búsqueda.
                            </p>
                        </div>
                        <Button variant="outline" className="mt-4 rounded-xl" onClick={() => setIsDialogOpen(true)}>
                            Registrar Primer Paciente
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {/* Vista de Tarjetas Full */}
                    {viewMode === 'grid' && (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {paginatedPacientes.map((paciente) => (
                                <Link key={paciente.id} href={`/pacientes/${paciente.id}`}>
                                    <Card className="group relative overflow-hidden hover:border-blue-500/50 hover:shadow-md transition-all h-full rounded-2xl border-slate-200 dark:border-slate-800">
                                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                                                    {paciente.nombre.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <CardTitle className="text-base font-bold group-hover:text-blue-600 transition-colors">
                                                        {paciente.nombre}
                                                    </CardTitle>
                                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {format(new Date(paciente.createdAt), "d MMM yyyy", { locale: es })}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Edad</p>
                                                    <p className="font-semibold">{paciente.edad ? `${paciente.edad} años` : '---'}</p>
                                                </div>
                                                <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Historial</p>
                                                    <div className="flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400">
                                                        <FileText className="h-3 w-3" />
                                                        <span>{recetasCounts[paciente.id] || 0} Recetas</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 text-xs text-slate-500 px-1 border-t pt-3">
                                                {paciente.peso && (
                                                    <div className="flex items-center gap-1">
                                                        <Weight className="h-3 w-3 text-orange-500" />
                                                        <span>{paciente.peso} kg</span>
                                                    </div>
                                                )}
                                                {paciente.talla && (
                                                    <div className="flex items-center gap-1">
                                                        <Ruler className="h-3 w-3 text-blue-500" />
                                                        <span>{paciente.talla} cm</span>
                                                    </div>
                                                )}
                                                {paciente.alergias && (
                                                    <div className="flex items-center gap-1 ml-auto">
                                                        <Badge variant="destructive" className="h-5 text-[9px] uppercase font-bold py-0">Alergias</Badge>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                        <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0">
                                            <ArrowRight className="h-4 w-4 text-blue-500" />
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Vista Compacta */}
                    {viewMode === 'compact' && (
                        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
                            {paginatedPacientes.map((paciente) => (
                                <Link key={paciente.id} href={`/pacientes/${paciente.id}`}>
                                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-300 transition-colors shadow-sm group">
                                        <div className="flex items-center gap-3 text-left">
                                            <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors capitalize font-bold">
                                                {paciente.nombre.charAt(0)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-bold text-sm truncate">{paciente.nombre}</h4>
                                                <p className="text-[10px] text-slate-500">
                                                    {paciente.edad} años • {recetasCounts[paciente.id] || 0} recetas
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
                                            <th className="px-6 py-3">Paciente</th>
                                            <th className="px-6 py-3">Edad</th>
                                            <th className="px-6 py-3">Consultas</th>
                                            <th className="px-6 py-3">Alergias</th>
                                            <th className="px-6 py-3">Registro</th>
                                            <th className="px-6 py-3 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {paginatedPacientes.map((paciente) => (
                                            <tr key={paciente.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer group" onClick={() => router.push(`/pacientes/${paciente.id}`)}>
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600">{paciente.nombre}</span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">{paciente.edad} años</td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 text-[10px] font-bold">
                                                        {recetasCounts[paciente.id] || 0} Recetas
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {paciente.alergias ? (
                                                        <Badge variant="outline" className="text-red-600 bg-red-50 border-red-100 text-[9px] uppercase font-black">
                                                            <AlertCircle className="h-2 w-2 mr-1" /> Sí
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-slate-300 text-[10px] uppercase font-bold">Ninguna</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 text-xs">
                                                    {format(new Date(paciente.createdAt), "dd/MM/yyyy")}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-500" />
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
                                                    ? 'shadow-sm bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400'
                                                    : 'text-slate-500 hover:text-blue-600'
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
