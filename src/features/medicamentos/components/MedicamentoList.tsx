
"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table"
import { Button } from "@/shared/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { MedicamentoCatalogo } from "@/types"

interface MedicamentoListProps {
    medicamentos: MedicamentoCatalogo[]
    onEdit: (medicamento: MedicamentoCatalogo) => void
    onDelete: (id: string) => void
}

export function MedicamentoList({ medicamentos, onEdit, onDelete }: MedicamentoListProps) {
    if (medicamentos.length === 0) {
        return (
            <div className="text-center p-8 text-slate-500 border rounded-lg bg-slate-50">
                No hay medicamentos registrados. Agregue uno nuevo para comenzar.
            </div>
        )
    }

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Presentación</TableHead>
                        <TableHead className="w-[100px] text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {medicamentos.map((med) => (
                        <TableRow key={med.id}>
                            <TableCell className="font-medium">{med.nombre}</TableCell>
                            <TableCell className="text-slate-500">{med.presentacion || '-'}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(med)}
                                        title="Editar"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => onDelete(med.id)}
                                        title="Eliminar"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
