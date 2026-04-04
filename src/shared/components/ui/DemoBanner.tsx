"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";

/**
 * Banner de Plan Pro para modo demo personalizada.
 *
 * Se muestra automáticamente cuando el usuario está en la demo de un preset específico
 * (es decir, cuando `localStorage` contiene el flag `recetaz_demo_slug`).
 * Informa al usuario que está viendo un diseño personalizado y puede activar el Plan Pro.
 *
 * @returns Banner fijo en la parte superior, o null si no es una demo de preset.
 */
export function DemoBanner() {
    const [visible, setVisible] = useState(false);
    const [nombreDoctor, setNombreDoctor] = useState<string>("");

    useEffect(() => {
        const slug = localStorage.getItem("recetaz_demo_slug");
        if (slug) {
            setVisible(true);
        }
        // Intentar obtener el nombre del médico para personalizar el mensaje
        const cargarNombreDoctor = async () => {
            try {
                const { db } = await import("@/shared/db/db.config");
                const medico = await db.medico.get("default");
                if (medico?.nombre) {
                    setNombreDoctor(medico.nombre);
                }
            } catch {
                // Silencioso — el banner funciona sin el nombre
            }
        };
        cargarNombreDoctor();
    }, []);

    if (!visible) return null;

    return (
        <div
            role="banner"
            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 flex items-center justify-between gap-3 shadow-md z-50 print:hidden"
        >
            {/* Icono + Mensaje */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
                <Sparkles className="h-4 w-4 shrink-0 text-yellow-300" />
                <p className="text-sm font-medium truncate">
                    {nombreDoctor
                        ? `Diseño personalizado listo para ${nombreDoctor}.`
                        : "Diseño personalizado listo."}{" "}
                    <span className="font-bold underline underline-offset-2 cursor-pointer hover:opacity-80">
                        Activa el Plan Pro
                    </span>{" "}
                    para usarlo oficialmente.
                </p>
            </div>

            {/* Botón de cerrar */}
            <button
                onClick={() => setVisible(false)}
                aria-label="Cerrar aviso de Plan Pro"
                className="shrink-0 p-1 rounded hover:bg-white/20 transition-colors"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
