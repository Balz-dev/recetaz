'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { ExternalLink, Star } from 'lucide-react';

interface PremiumModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureTitle: string;
    featureDescription: string;
    landingPageUrl: string;
}

export function PremiumModal({
    isOpen,
    onClose,
    featureTitle,
    featureDescription,
    landingPageUrl,
}: PremiumModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto bg-amber-100 p-3 rounded-full mb-4 w-fit">
                        <Star className="w-8 h-8 text-amber-500" fill="currentColor" />
                    </div>
                    <DialogTitle className="text-center text-xl">
                        Desbloquea {featureTitle}
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        Esta es una funcionalidad <span className="font-bold text-amber-600">PREMIUM</span>.
                        <br />
                        {featureDescription}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <p className="text-sm text-center text-muted-foreground">
                        Obtén acceso completo a esta y otras herramientas avanzadas suscribiéndote a nuestro plan Pro.
                    </p>
                </div>
                <DialogFooter className="flex-col sm:flex-col gap-2">
                    <Button 
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white" 
                        onClick={() => window.open(landingPageUrl, '_blank')}
                    >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver planes y precios
                    </Button>
                    <Button variant="ghost" onClick={onClose} className="w-full">
                        Quizás más tarde
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
