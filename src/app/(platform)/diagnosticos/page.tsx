
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { DiagnosticoCatalogo } from "@/types"
import { diagnosticoService } from "@/features/diagnosticos/services/diagnostico.service"
import { DiagnosticoDialog } from "@/features/diagnosticos/components/DiagnosticoDialog"
import { useToast } from "@/shared/components/ui/use-toast"
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

export default function DiagnosticosPage() {
    const [diagnosticos, setDiagnosticos] = useState<DiagnosticoCatalogo[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedDiagnostico, setSelectedDiagnostico] = useState<DiagnosticoCatalogo | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [diagnosticoToDelete, setDiagnosticoToDelete] = useState<number | null>(null)

    const { toast } = useToast()

    const loadDiagnosticos = async () => {
        setLoading(true)
        try {
            let data;
            if (searchTerm.length >= 2) {
                data = await diagnosticoService.search(searchTerm)
            } else {
                data = await diagnosticoService.getAll(0, 50)
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

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            loadDiagnosticos()
        }, 500)
        return () => clearTimeout(timer)
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
        } catch (error) {
            toast({ title: "Error al eliminar", variant: "destructive" })
        } finally {
            setIsDeleteDialogOpen(false)
            setDiagnosticoToDelete(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Catálogo de Diagnósticos
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Gestiona los códigos CIE-11 y diagnósticos frecuentes.
                    </p>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Diagnóstico
                </Button>
            </div>

            <div className="flex gap-4 items-center bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Buscar por código, nombre o especialidad..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Código</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead className="hidden md:table-cell">Especialidad</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Cargando...
                                </TableCell>
                            </TableRow>
                        ) : diagnosticos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-slate-500">
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
                                                <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                    {esp}
                                                </span>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(diag)}>
                                                <Edit className="h-4 w-4 text-slate-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => confirmDelete(diag.id!)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

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
