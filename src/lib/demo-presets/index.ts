/**
 * @fileoverview Registro central de presets de demo personalizadas.
 *
 * Para agregar un nuevo preset:
 * 1. Crear el archivo en ./presets/[nombre-preset].ts
 * 2. Importarlo aquí
 * 3. Agregarlo al objeto PRESETS con su slug como clave
 */

import { proDrJuanPerez } from './presets/pro-dr-juan-perez';
import type { DemoPreset } from './types';

/**
 * Mapa de todos los presets de demo disponibles, indexados por slug.
 * La clave debe ser idéntica al `slug` dentro del preset.
 */
const PRESETS: Record<string, DemoPreset> = {
    'pro-dr-juan-perez-2026': proDrJuanPerez,
};

/**
 * Busca y retorna un preset de demo dado su slug.
 *
 * @param slug - El identificador en la URL (ej: "pro-dr-juan-perez-2026")
 * @returns El preset correspondiente, o `undefined` si no existe
 */
export function buscarPreset(slug: string): DemoPreset | undefined {
    return PRESETS[slug];
}

/**
 * Retorna todos los slugs de presets registrados.
 * Útil para generar rutas estáticas en Next.js si fuera necesario.
 *
 * @returns Array de slugs disponibles
 */
export function obtenerSlugPresets(): string[] {
    return Object.keys(PRESETS);
}

export type { DemoPreset };
