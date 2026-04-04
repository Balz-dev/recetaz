"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { buscarPreset } from "@/lib/demo-presets";
import type { DemoPreset } from "@/lib/demo-presets/types";

// -----------------------------------------------------------------------------
// Función de Inicialización del Preset
// Corre 100% en el cliente, sin servidores ni APIs externas.
// -----------------------------------------------------------------------------

/**
 * Inicializa la base de datos demo con los datos del preset especificado.
 * Guarda el doctor y la plantilla del canvas en IndexedDB (`RecetasMedicasDB_Demo`).
 *
 * @param preset - El preset del doctor a inicializar.
 */
async function inicializarDemoSlug(preset: DemoPreset): Promise<void> {
    // Activar modo demo ANTES de importar db, para que getDBName() use RecetasMedicasDB_Demo
    localStorage.setItem("recetaz_is_demo", "true");
    localStorage.setItem("recetaz_demo_slug", preset.slug);

    // Importar dinámicamente para evitar problemas de SSR con IndexedDB
    const { seedDatabase } = await import("@/shared/utils/seed");
    const { db } = await import("@/shared/db/db.config");

    // 1. Poblar base de datos (médico, pacientes, recetas, catálogos)
    await seedDatabase({
        isDemo: true,
        especialidad: preset.doctor.especialidadKey || 'general',
        extraData: { doctor: preset.doctor }
    });

    // 3. Limpiar plantillas genéricas y agregar la del preset como única activa
    await db.plantillas.clear();
    await db.plantillas.add({
        ...preset.recetaConfig,
        id: crypto.randomUUID(),
        activa: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
}

// -----------------------------------------------------------------------------
// Componente de Página
// -----------------------------------------------------------------------------

/**
 * Página dinámica para demos personalizadas del Plan Pro.
 *
 * Flujo:
 * 1. Lee el slug de los params de la URL.
 * 2. Busca el preset correspondiente en el catálogo interno.
 * 3. Si no existe → redirige a /demo (demo genérica).
 * 4. Si existe → inicializa la BD demo con el preset → redirige al /dashboard.
 *
 * @returns Pantalla de carga mientras se inicializa el entorno demo.
 */
export default function DemoSlugPage() {
    const router = useRouter();
    const params = useParams<{ slug: string }>();
    const [estado, setEstado] = useState("Verificando configuración...");
    const [esError, setEsError] = useState(false);

    useEffect(() => {
        const slug = params?.slug;

        if (!slug) {
            router.replace("/demo");
            return;
        }

        // Preset válido → inicializar
        const inicializar = async () => {
            try {
                setEstado(`Verificando configuración para "${slug}"...`);

                // buscarPreset ahora es asíncrono
                const preset = await buscarPreset(slug);

                if (!preset) {
                    // Slug no encontrado o error en carga JSON → fallback a demo genérica
                    setEstado(`Configuración "${slug}" no encontrada en archivos JSON. Cargando demo estándar...`);
                    setTimeout(() => {
                        window.location.href = "/demo";
                    }, 1500);
                    return;
                }

                setEstado(`Preparando demo personalizada para ${preset.etiqueta}...`);
                await inicializarDemoSlug(preset);
                setEstado("¡Listo! Redirigiendo al dashboard...");

                setEstado("¡Listo! Redirigiendo al dashboard...");

                // Forzamos un hard reload para asegurar que todos los componentes
                // detecten el modo demo y la nueva base de datos.
                setTimeout(() => {
                    window.location.href = "/dashboard?demo=true";
                }, 1000);
            } catch (error) {
                console.error("[DemoSlug] Error al inicializar preset:", error);
                setEsError(true);
                setEstado("Error al cargar la configuración. Intenta de nuevo.");
            }
        };

        inicializar();
    }, [params, router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-6 px-4">
            {/* Spinner o ícono de error */}
            {esError ? (
                <div className="text-4xl">⚠️</div>
            ) : (
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600" />
            )}

            {/* Texto de estado */}
            <div className="text-center max-w-sm">
                <h2 className="text-xl font-semibold text-slate-800">
                    {esError ? "Error en la demo" : "Preparando Demo"}
                </h2>
                <p className="text-slate-500 mt-2 text-sm">{estado}</p>
            </div>

            {/* Botón de reintento en caso de error */}
            {esError && (
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                    Reintentar
                </button>
            )}
        </div>
    );
}
