'use client';

import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Sparkles } from 'lucide-react';

/**
 * Propiedades del componente PremiumModal.
 */
interface PremiumModalProps {
    /** Indica si el modal está abierto */
    isOpen: boolean;
    /** Función para cerrar el modal */
    onClose: () => void;
    /** Título de la funcionalidad */
    featureTitle: string;
    /** Descripción de la funcionalidad */
    featureDescription: string;
    /** URL de la landing page (no se usará por ahora pero se mantiene por compatibilidad) */
    landingPageUrl: string;
}

/**
 * Componente que muestra un modal informando sobre una funcionalidad futura.
 * Utiliza la imagen de la Dra. Zoyla para dar el mensaje.
 * 
 * @param props - Propiedades del componente.
 * @returns Componente JSX del modal.
 */
export function PremiumModal({
    isOpen,
    onClose,
    featureTitle,
    featureDescription,
}: PremiumModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md overflow-hidden bg-white">
                <DialogHeader className="relative pb-0">
                    <div className="flex justify-center mb-2">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-xl">
                            <Image
                                src="/dra-zoyla/zoyla-dedo-enfrente.png"
                                alt="Dra. Zoyla"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <DialogTitle className="text-center text-2xl font-bold text-slate-800">
                        ¡Próximamente!
                    </DialogTitle>
                    <DialogDescription className="text-center text-slate-600 pt-2 text-lg">
                        <span className="font-semibold text-blue-600">{featureTitle}</span> está en camino.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-4 bg-blue-50/50 rounded-2xl border border-blue-100 mt-2">
                    <div className="flex gap-3">
                        <div className="mt-1">
                            <Sparkles className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-slate-600 text-sm italic leading-relaxed">
                            "¡Hola! Soy la Dra. Zoyla. Estoy trabajando junto al equipo de RecetaZ para traerte <strong>{featureTitle.toLowerCase()}</strong> muy pronto. Estamos puliendo cada detalle para que tu experiencia sea excepcional."
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 py-2">
                    <p className="text-sm text-center text-slate-500">
                        {featureDescription}
                    </p>
                </div>

                <DialogFooter className="sm:justify-center">
                    <Button
                        className="w-full sm:w-auto px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all active:scale-95"
                        onClick={onClose}
                    >
                        ¡Excelente, estaré atento!
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
