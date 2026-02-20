"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog"
import { PacienteForm } from "./PacienteForm"
import { Paciente } from "@/types"

interface PacienteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: (pacienteId: string) => void
    paciente?: Paciente | null
}

export function PacienteDialog({
    open,
    onOpenChange,
    onSuccess,
    paciente
}: PacienteDialogProps) {
    const handleSuccess = (pacienteId: string) => {
        if (onSuccess) {
            onSuccess(pacienteId)
        }
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl flex flex-col max-h-[90vh] p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-slate-50">
                <DialogHeader className="p-6 pb-2 bg-white">
                    <DialogTitle className="text-2xl font-black text-slate-900">
                        {paciente ? "Editar Paciente" : "Nuevo Paciente"}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col flex-1 min-h-0">
                    <PacienteForm
                        initialData={paciente || undefined}
                        isEditing={!!paciente}
                        afterSave={handleSuccess}
                        onCancel={() => onOpenChange(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
