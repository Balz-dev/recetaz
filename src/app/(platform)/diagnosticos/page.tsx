
"use client"

import { useState, useEffect } from "react"
import { Plus, Package } from "lucide-react"
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
import { Card, CardContent } from "@/shared/components/ui/card"
import { CatalogHeader } from "@/shared/components/catalog/CatalogHeader"
import { StatsCards } from "@/shared/components/catalog/StatsCards"
import { CatalogFilters } from "@/shared/components/catalog/CatalogFilters"
import { ImportExportButtons } from "@/shared/components/catalog/ImportExportButtons"
import { TableActions } from "@/shared/components/catalog/TableActions"
import { exportToJSON, getFormattedDate } from "@/shared/utils/import-export.utils"

export default function DiagnosticosPage() {
    const [diagnosticos, setDiagnosticos] = useState<DiagnosticoCatalogo[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [ordenPor, setOrdenPor] = useState<'nombre' | 'uso' | 'reciente'>('uso')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedDiagnostico, setSelectedDiagnostico] = useState<DiagnosticoCatalogo | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [diagnosticoToDelete, setDiagnosticoToDelete] = useState<number | null>(null)
    const [estadisticas, setEstadisticas] = useState<{
        total: number
        especialidades: string[]
        masUsados: DiagnosticoCatalogo[]
    } | null>(null)

    const { toast } = useToast()

    const loadDiagnosticos = async () => {
        setLoading(true)
        try {
            let data;
            if (searchTerm.length >= 2) {
                data = await diagnosticoService.search(searchTerm)
            } else {
                data = await diagnosticoService.getAll(0, 50, ordenPor)
            }
            setDiagnosticos(data)
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

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            loadDiagnosticos()
        }, 500)
        return () => clearTimeout(timer)
    }, [searchTerm, ordenPor])

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

    const handleExport = async () => {
        const todos = await diagnosticoService.getAll(0, 10000)
        const date = getFormattedDate()
        exportToJSON(todos, `diagnosticos-${date}`)
    }

    const handleImport = async (data: any[]) => {
        let importados = 0
        for (const item of data) {
            try {
                // Verificar si ya existe por código
                const existente = await diagnosticoService.search(item.codigo)
                if (existente.length === 0) {
                    await diagnosticoService.create(item)
                    importados++
                }
            } catch (error) {
                console.error('Error importando diagnóstico:', error)
            }
        }

        if (importados > 0) {
            loadDiagnosticos()
            loadEstadisticas()
        }

        toast({
            title: "Importación completada",
            description: `Se importaron ${importados} de ${data.length} diagnósticos.`
        })
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <CatalogHeader
                    title="Catálogo de Diagnósticos"
                    description="Gestiona los códigos CIE-11 y diagnósticos frecuentes."
                    buttonText="Nuevo Diagnóstico"
                    onButtonClick={handleCreate}
                    ButtonIcon={Plus}
                />
                <ImportExportButtons
                    onExport={handleExport}
                    onImport={handleImport}
                    entityName="diagnósticos"
                />
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

            {/* Tabla */}
            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Código</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead className="hidden md:table-cell">Especialidad</TableHead>
                                <TableHead className="text-center">Usos</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Cargando...
                                    </TableCell>
                                </TableRow>
                            ) : diagnosticos.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                                        No se encontraron diagnósticos.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                diagnosticos.map((diag) => (
                                    <TableRow key={diag.id}>
                                        <TableCell className="font-medium font-mono text-xs text-slate-500">
                                            {diag.codigo}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{diag.nombre}</div>
                                            {diag.sinonimos && diag.sinonimos.length > 0 && (
                                                <div className="text-xs text-slate-500 truncate max-w-[300px]">
                                                    {diag.sinonimos.join(", ")}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div className="flex gap-1 flex-wrap">
                                                {diag.especialidad?.slice(0, 2).map((esp, i) => (
                                                    <Badge key={i} variant="info">
                                                        {esp}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">{diag.vecesUsado || 0}</TableCell>
                                        <TableCell className="text-right">
                                            <TableActions
                                                onEdit={() => handleEdit(diag)}
                                                onDelete={() => confirmDelete(diag.id!)}
                                                editLabel="Editar diagnóstico"
                                                deleteLabel="Eliminar diagnóstico"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

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
