"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Dialog, DialogContent } from "@/shared/components/ui/dialog"
import { medicoService } from "../services/medico.service"
import { db } from "@/shared/db/db.config"
import { usePWA } from "@/shared/providers/PWAProvider"
import { OnboardingWizard } from "./OnboardingWizard"

export function InitialConfigModal() {
    const { gateState } = usePWA()
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [especialidadesReady, setEspecialidadesReady] = useState(false)
    const pathname = usePathname()

    const isPWAFullGateActive = gateState === 'FULL'

    useEffect(() => {
        const checkConfig = async () => {
            try {
                // Esperar a que las especialidades estén sincronizadas
                let retries = 0;
                const maxRetries = 10;

                while (retries < maxRetries) {
                    const count = await db.especialidades.count();
                    if (count > 0) {
                        setEspecialidadesReady(true);
                        break;
                    }
                    await new Promise(resolve => setTimeout(resolve, 300));
                    retries++;
                }

                const config = await medicoService.get()
                // Si no hay configuración o falta el nombre (dato crítico), mostrar modal
                if (!config || !config.nombre) {
                    setOpen(true)
                }
            } catch (error) {
                console.error("Error al verificar configuración inicial:", error)
            } finally {
                setIsLoading(false)
            }
        }

        checkConfig()
    }, [])

    if (isLoading) return null

    // Si ya estamos en la página de configuración, no mostrar el modal
    if (pathname?.includes('configuracion')) return null

    // IMPORTANTE: Si está activo el Install Gate de pantalla completa, no mostrar este modal
    // para evitar conflictos de focus trap de Radix y asegurar que lo primero sea la PWA.
    if (isPWAFullGateActive) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[95vw] w-full lg:max-w-3xl max-h-[95vh] overflow-y-auto z-[200] p-0 border-none bg-white dark:bg-slate-950">
                <div className="p-6 sm:p-8">
                    {!especialidadesReady ? (
                        <div className="flex items-center justify-center p-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-base font-medium text-slate-600 dark:text-slate-400">Preparando su consultorio...</p>
                            </div>
                        </div>
                    ) : (
                        <OnboardingWizard onComplete={() => setOpen(false)} />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
