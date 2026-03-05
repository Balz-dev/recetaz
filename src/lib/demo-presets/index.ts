/**
 * @fileoverview Registro central de presets de demo personalizadas.
 *
 * Para agregar un nuevo preset:
 * 1. Crear el archivo en ./presets/[nombre-preset].ts
 * 2. Importarlo aquí
 * 3. Agregarlo al objeto PRESETS con su slug como clave
 */

// Dynamic loading of demo presets from JSON files
import type { DemoPreset } from './types';

/**
 * Carga dinámicamente los datos de demo para un médico y su plantilla de receta.
 * Los archivos JSON deben estar en `public/medicos-demo/<slug>.json` y
 * `public/plantillas/<slug>.json`.
 */
export async function buscarPreset(slug: string): Promise<DemoPreset | undefined> {
    try {
        const doctorRes = await fetch(`/medicos-demo/${slug}.json?t=${Date.now()}`);
        if (!doctorRes.ok) throw new Error(`No se encontró el doctor JSON para ${slug}`);
        const doctor = await doctorRes.json();

        const plantillaRes = await fetch(`/plantillas/${slug}.json?t=${Date.now()}`);
        if (!plantillaRes.ok) throw new Error(`No se encontró la plantilla JSON para ${slug}`);
        const recetaConfig = await plantillaRes.json();

        const especialidadLabel = doctor.especialidad || (doctor.especialidadKey ? (doctor.especialidadKey.charAt(0).toUpperCase() + doctor.especialidadKey.slice(1)) : '');
        const etiqueta = especialidadLabel ? `${doctor.nombre} - ${especialidadLabel}` : doctor.nombre;
        return { slug, etiqueta, doctor, recetaConfig } as DemoPreset;
    } catch (error) {
        console.error('Error al cargar preset:', error);
        return undefined;
    }
}


/**
 * Busca y retorna un preset de demo dado su slug.
 *
 * @param slug - El identificador en la URL (ej: "pro-dr-juan-perez-2026")
 * @returns El preset correspondiente, o `undefined` si no existe
 */
// This function is now defined above with dynamic loading logic.
// Kept for backward compatibility; returns undefined if not found.
export function buscarPresetLegacy(slug: string): DemoPreset | undefined {
    // Legacy fallback (no longer used)
    return undefined;
}

/**
 * Retorna todos los slugs de presets registrados.
 * Útil para generar rutas estáticas en Next.js si fuera necesario.
 *
 * @returns Array de slugs disponibles
 */
export function obtenerSlugPresets(): string[] {
    // Como ahora la carga es dinámica, mantenemos una lista de slugs conocidos aquí.
    // TODO: En el futuro esto podría leerse de un índice JSON centralizado en /public.
    return [
        'pro-dr-juan-perez-2026',
        'dr-herbich'
    ];
}

export type { DemoPreset };
