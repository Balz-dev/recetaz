"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { PacienteForm } from "./PacienteForm";

interface PatientRegistrationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: (pacienteId: string) => void;
    onCancel: () => void;
}

export function PatientRegistrationModal({
    open,
    onOpenChange,
    onSuccess,
    onCancel,
}: PatientRegistrationModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Registrar Nuevo Paciente</DialogTitle>
                    <DialogDescription>
                        Complete la información del paciente para continuar.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <PacienteForm
                        afterSave={onSuccess}
                        onCancel={onCancel}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
