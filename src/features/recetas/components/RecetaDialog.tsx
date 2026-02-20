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
            <DialogContent className="max-w-5xl flex flex-col max-h-[95vh] p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-slate-50 w-full">
                <DialogHeader className="p-6 pb-2 bg-white">
                    {view === 'form' ? (
                        <>
                            <DialogTitle className="text-2xl font-black text-slate-900">Nueva Receta Médica</DialogTitle>
                            <DialogDescription>
                                Complete los datos para generar una nueva receta.
                            </DialogDescription>
                        </>
                    ) : (
                        <DialogTitle className="text-2xl font-black text-slate-900">Receta Generada</DialogTitle>
                    )}
                </DialogHeader>
                <div className="flex flex-col flex-1 min-h-0">
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
