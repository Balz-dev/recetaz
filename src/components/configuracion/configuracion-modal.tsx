"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { MedicoConfigForm } from "@/components/forms/medico-config-form";

interface ConfiguracionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ConfiguracionModal({
    open,
    onOpenChange,
    onSuccess,
}: ConfiguracionModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Bienvenido al Sistema de Recetas Médicas</DialogTitle>
                    <DialogDescription>
                        Antes de comenzar, es necesario configurar tus datos profesionales. Estos aparecerán en todas las recetas que generes.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <MedicoConfigForm onSuccess={onSuccess} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
