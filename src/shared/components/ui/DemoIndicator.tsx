"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, LogOut, ExternalLink } from "lucide-react"
import { Button } from "./button"

/**
 * Componente que muestra un indicador de modo demo.
 * Diseñado para integrarse en el sidebar.
 * 
 * @returns JSX Element o null si no está en modo demo.
 */
export function DemoIndicator() {
    const [isDemo, setIsDemo] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Verificar si estamos en modo demo
        const checkDemo = () => {
            const demoState = localStorage.getItem('recetaz_is_demo') === 'true'
            setIsDemo(demoState)
        }

        checkDemo()

        // Escuchar cambios en localStorage para actualizar el estado
        window.addEventListener('storage', checkDemo)
        return () => window.removeEventListener('storage', checkDemo)
    }, [])

    const handleExitDemo = async (target: string = '/') => {
        try {
            // Limpiar estado de demo
            localStorage.removeItem('recetaz_is_demo')

            // Redirigir al destino (landing por defecto o dashboard real)
            window.location.href = target
        } catch (error) {
            console.error("Error al salir de demo:", error)
            window.location.href = target
        }
    }

    if (!isDemo) return null

    return (
        <div className="w-full bg-red-600 text-white shrink-0 z-50 overflow-hidden border-0">
            <div className="max-w-7xl mx-auto flex items-stretch justify-between min-h-[40px]">
                {/* Mensaje de datos ficticios */}
                <div className="flex items-center gap-3 px-4 py-2">
                    <div className="bg-white/20 p-1 rounded-full animate-pulse">
                        <AlertTriangle className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                        <span className="text-[11px] font-black uppercase tracking-tighter whitespace-nowrap">Entorno Demo</span>
                        <div className="hidden xs:block h-3 w-px bg-white/20 sm:hidden lg:block" />
                        <span className="text-[10px] text-white font-bold leading-tight">
                            Entorno de prueba. Datos ficticios para demostración, no se usan datos reales.
                        </span>
                    </div>
                </div>

                {/* Acciones - Botones que ocupan todo el alto con hovers personalizados */}
                <div className="flex items-stretch">
                    <Button
                        variant="ghost"
                        className="h-full px-6 text-[10px] text-white hover:bg-[#660000] hover:text-white transition-all border-0 rounded-none font-bold uppercase tracking-wide group"
                        onClick={() => handleExitDemo('/')}
                    >
                        <LogOut className="h-3 w-3 mr-2 group-hover:scale-110 transition-transform" />
                        <span className="group-hover:translate-x-0.5 transition-transform inline-block">Terminar Demo</span>
                    </Button>

                    <Button
                        variant="ghost"
                        className="h-full px-8 text-[11px] text-white hover:bg-blue-700 hover:text-white transition-all border-0 rounded-none font-black uppercase tracking-widest group"
                        onClick={() => handleExitDemo('/dashboard')}
                    >
                        <ExternalLink className="h-3.5 w-3.5 mr-2 group-hover:scale-110 transition-transform" />
                        <span className="group-hover:translate-x-0.5 transition-transform inline-block">PASAR A REAL</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
