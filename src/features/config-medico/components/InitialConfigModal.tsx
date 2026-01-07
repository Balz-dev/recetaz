"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog"
import { ConfiguracionContent } from "./ConfiguracionContent"
import { medicoService } from "../services/medico.service"
import { MedicoConfig } from "@/types"
import { db } from "@/shared/db/db.config"

export function InitialConfigModal() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [especialidadesReady, setEspecialidadesReady] = useState(false)
    const pathname = usePathname()

    console.log('InitialConfigModal: pathname', pathname, 'open', open);

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
                    // Esperar 300ms antes de reintentar
                    await new Promise(resolve => setTimeout(resolve, 300));
                    retries++;
                }

                if (retries === maxRetries) {
                    console.warn("Especialidades no sincronizadas después de esperar");
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
    // para evitar duplicidad y conflictos visuales.
    // Si ya estamos en la página de configuración (o subrutas), no mostrar el modal
    if (pathname?.includes('configuracion')) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[95vw] w-full lg:max-w-6xl max-h-[90vh] overflow-y-auto z-[200]">
                <DialogHeader>
                    <DialogTitle>Bienvenido a RecetaZ</DialogTitle>
                    <DialogDescription>
                        Para comenzar, necesitamos que configures tus datos básicos y elijas o creas una plantilla.
                        La plantilla puede ser desde un diseño predeterminado o personalizado.
                        Si eliges personalizarla, puedes hacerlo desde la página de plantillas.
                        tambien puedes crear una plantilla personalizada para papel membretado cargando la imagen base.
                        Esta información es necesaria para generar tus recetas correctamente.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {!especialidadesReady ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                <p className="text-sm text-muted-foreground">Cargando catálogos...</p>
                            </div>
                        </div>
                    ) : (
                        <ConfiguracionContent onConfigSaved={() => setOpen(false)} />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
