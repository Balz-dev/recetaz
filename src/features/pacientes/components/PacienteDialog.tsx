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
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {paciente ? "Editar Paciente" : "Nuevo Paciente"}
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
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
