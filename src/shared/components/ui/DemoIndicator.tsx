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
        <div className="px-4 py-4 mt-auto border-t border-slate-800 bg-slate-900/50">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 shadow-inner">
                <div className="flex items-center gap-2 mb-2">
                    <div className="bg-amber-500 p-1 rounded text-white animate-pulse">
                        <AlertTriangle className="h-3 w-3" />
                    </div>
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Entorno Demo</span>
                </div>

                <p className="text-[10px] text-slate-400 mb-3 leading-tight font-medium">
                    Datos ficticios para demostración. No use información real.
                </p>

                <div className="space-y-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full h-8 text-[10px] justify-start gap-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors border-0"
                        onClick={() => handleExitDemo('/')}
                    >
                        <LogOut className="h-3 w-3" />
                        Finalizar Demo
                    </Button>

                    <Button
                        variant="default"
                        size="sm"
                        className="w-full h-8 text-[10px] gap-2 bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-900/20 border-0"
                        onClick={() => handleExitDemo('/dashboard')}
                    >
                        <ExternalLink className="h-3 w-3" />
                        Probar Versión Real
                    </Button>
                </div>
            </div>
        </div>
    )
}
