/**
 * Cliente de Supabase para el frontend.
 * Se encarga de la comunicación directa con la API de Supabase.
 */

'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Instancia del cliente de Supabase para uso en el cliente.
 * Se inicializa solo si las variables de entorno están presentes para evitar errores en build.
 */
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null as any;

if (!supabase) {
    console.warn('Faltan variables de entorno de Supabase. El sistema de métricas estará en modo offline-only.');
}
