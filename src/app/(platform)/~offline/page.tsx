"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { DetalleRecetaView } from "@/features/recetas/components/DetalleRecetaView";

/**
 * App Shell Offline (Transparent Fallback).
 * 
 * Este componente es servido por el Service Worker cuando falla la navegación por red.
 * Su objetivo es "hidratar" la vista correcta usando datos locales (Dexie) 
 * sin que el usuario perciba que hubo un fallo de red.
 * 
 * - Si la URL es de una receta: Renderiza DetalleRecetaView directamente.
 * - Si es otra URL conocida: Intenta redirección interna.
 * - Si es desconocida: Redirige al Dashboard.
 */
export default function OfflineAppShell() {
    const router = useRouter();
    const [recetaId, setRecetaId] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const path = window.location.pathname;

            // 1. Detección de Recetas (/recetas/{id})
            const match = path.match(/^\/recetas\/([a-f0-9-]+)$/i);

            if (match && match[1]) {
                setRecetaId(match[1]);
                setIsChecking(false);
                return;
            }

            // 2. Otras rutas o fallo
            // Si no reconocemos la ruta dinámica para renderizarla manual,
            // redirigimos al home/dashboard que sí tiene shell en caché.
            if (path !== "/~offline") {
                router.replace("/dashboard");
            }
        }
    }, [router]);

    // Caso 1: Es una receta, mostramos la vista directamente
    if (recetaId) {
        return <DetalleRecetaView recetaId={recetaId} />;
    }

    // Caso 2: Cargando / Resolviendo ruta
    return (
        <div className="flex h-[80vh] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="text-sm text-slate-400 font-medium animate-pulse">
                    Cargando...
                </p>
            </div>
        </div>
    );
}
