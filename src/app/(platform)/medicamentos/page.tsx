
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Plus, Search, Pill, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { MedicamentoCatalogo, MedicamentoCatalogoFormData } from "@/types"
import { medicamentoService } from "@/features/medicamentos/services/medicamento.service"
import { MedicamentoList } from "@/features/medicamentos/components/MedicamentoList"
import { MedicamentoDialog } from "@/features/medicamentos/components/MedicamentoDialog"
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

export default function MedicamentosPage() {
    const [medicamentos, setMedicamentos] = useState<MedicamentoCatalogo[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingMedicamento, setEditingMedicamento] = useState<MedicamentoCatalogo | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const { toast } = useToast()

    const loadMedicamentos = async () => {
        setIsLoading(true)
        try {
            const data = searchQuery 
                ? await medicamentoService.search(searchQuery)
                : await medicamentoService.getAll()
            setMedicamentos(data)
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "No se pudieron cargar los medicamentos.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadMedicamentos()
        }, 300)
        return () => clearTimeout(timeoutId)
    }, [searchQuery])

    const handleCreate = async (data: MedicamentoCatalogoFormData) => {
        try {
            await medicamentoService.create(data)
            toast({ title: "Medicamento creado exitosamente" })
            loadMedicamentos()
        } catch (error) {
            toast({ 
                title: "Error", 
                description: "No se pudo crear el medicamento.", 
                variant: "destructive" 
            })
        }
    }

    const handleUpdate = async (data: MedicamentoCatalogoFormData) => {
        if (!editingMedicamento) return
        try {
            await medicamentoService.update(editingMedicamento.id, data)
            toast({ title: "Medicamento actualizado correctamente" })
            loadMedicamentos()
        } catch (error) {
            toast({ 
                title: "Error", 
                description: "No se pudo actualizar el medicamento.", 
                variant: "destructive" 
            })
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return
        try {
            await medicamentoService.delete(deleteId)
            toast({ title: "Medicamento eliminado" })
            loadMedicamentos()
        } catch (error) {
            toast({ 
                title: "Error", 
                description: "No se pudo eliminar el medicamento.", 
                variant: "destructive" 
            })
        } finally {
            setDeleteId(null)
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                     <Link href="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                            <Pill className="h-8 w-8 text-blue-600" />
                            Catálogo de Medicamentos
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Administre la base de datos de medicamentos y sus presentaciones.
                        </p>
                    </div>
                </div>
                <Button onClick={() => {
                    setEditingMedicamento(null)
                    setIsDialogOpen(true)
                }} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Medicamento
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Buscar medicamento..." 
                        className="pl-10 max-w-md"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {isLoading ? (
                    <div className="text-center py-12">Cargando...</div>
                ) : (
                    <MedicamentoList 
                        medicamentos={medicamentos}
                        onEdit={(med) => {
                            setEditingMedicamento(med)
                            setIsDialogOpen(true)
                        }}
                        onDelete={(id) => setDeleteId(id)}
                    />
                )}
            </div>

            <MedicamentoDialog 
                open={isDialogOpen} 
                onOpenChange={setIsDialogOpen}
                onSubmit={editingMedicamento ? handleUpdate : handleCreate}
                medicamento={editingMedicamento}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. El medicamento será eliminado permanentemente del catálogo.
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
