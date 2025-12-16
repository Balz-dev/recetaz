"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/shared/components/ui/dialog"
import { RecetaForm } from "./RecetaForm"
import { RecetaPrintPreview } from "./RecetaPrintPreview"
import { useState, useEffect } from "react"

interface RecetaDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: (recetaId: string) => void
    preSelectedPacienteId?: string
}

export function RecetaDialog({
    open,
    onOpenChange,
    onSuccess,
    preSelectedPacienteId
}: RecetaDialogProps) {
    const [view, setView] = useState<'form' | 'preview'>('form');
    const [recetaId, setRecetaId] = useState<string | null>(null);

    // Reset view when dialog opens
    useEffect(() => {
        if (open) {
            setView('form');
            setRecetaId(null);
        }
    }, [open]);

    const handleFormSuccess = (id: string) => {
        setRecetaId(id);
        setView('preview');
    }

    const handlePreviewClose = () => {
        if (onSuccess && recetaId) {
            onSuccess(recetaId)
        }
        onOpenChange(false)
    }

    const handleCancel = () => {
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto w-full">
                <DialogHeader>
                    {view === 'form' ? (
                        <>
                            <DialogTitle>Nueva Receta Médica</DialogTitle>
                            <DialogDescription>
                                Complete los datos para generar una nueva receta.
                            </DialogDescription>
                        </>
                    ) : (
                        <DialogTitle>Receta Generada</DialogTitle>
                    )}
                </DialogHeader>
                <div className="mt-2 text-left">
                    {view === 'form' ? (
                        <RecetaForm
                            preSelectedPacienteId={preSelectedPacienteId}
                            onCancel={handleCancel}
                            onSuccess={handleFormSuccess}
                        />
                    ) : (
                        recetaId && (
                            <RecetaPrintPreview
                                recetaId={recetaId}
                                onClose={handlePreviewClose}
                            />
                        )
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
