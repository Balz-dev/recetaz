/**
 * @fileoverview Tipos para el sistema de presets de demo personalizada.
 *
 * Define la estructura que deben tener los presets internos utilizados en la ruta
 * /demo/[slug] para generar demostraciones personalizadas del Plan Pro.
 */

import type { MedicoConfig, PlantillaReceta } from '@/types';

/**
 * Datos del médico que se cargan en la demo personalizada.
 * Corresponde a los campos editables visibles de MedicoConfig.
 */
export type DemoDoctor = Pick<
    MedicoConfig,
    'nombre' | 'especialidad' | 'cedula' | 'telefono' | 'direccion' | 'especialidadKey'
>;

/**
 * Configuración del canvas de la plantilla de receta.
 * Omite los campos generados automáticamente (id, fechas, activa).
 */
export type DemoRecetaConfig = Omit<
    PlantillaReceta,
    'id' | 'createdAt' | 'updatedAt' | 'activa'
>;

/**
 * Estructura completa de un preset de demo personalizada.
 *
 * @example
 * const preset: DemoPreset = {
 *   slug: 'pro-dr-juan-perez-2026',
 *   etiqueta: 'Dr. Juan Pérez - Cardiología',
 *   doctor: { nombre: 'Dr. Juan Pérez', ... },
 *   recetaConfig: { nombre: 'Membretada Cardiología', ... }
 * };
 */
export interface DemoPreset {
    /** Identificador único del preset, debe coincidir con el slug de la URL */
    slug: string;
    /** Nombre legible del preset para logs y depuración */
    etiqueta: string;
    /** Datos del médico propietario de la demo */
    doctor: DemoDoctor;
    /** Configuración del canvas/plantilla de receta */
    recetaConfig: DemoRecetaConfig;
}
