/**
 * Adaptador de Supabase para el envío de métricas.
 * Implementa el patrón Adapter para facilitar futuros cambios de proveedor.
 */

'use client';

import { supabase } from '../supabase/client';
import { type MetricEvent } from './types';

export interface MetricsProvider {
    track(event: MetricEvent): Promise<boolean>;
    identify(userId: string): Promise<void>;
}

/**
 * Proveedor de métricas basado en Supabase.
 */
export class SupabaseMetricsProvider implements MetricsProvider {
    /**
     * Envía un evento a la tabla metrics_events de Supabase.
     * 
     * @param event - Datos del evento a registrar.
     * @returns Promesa que indica si el envío fue exitoso.
     */
    async track(event: MetricEvent): Promise<boolean> {
        if (!supabase) {
            return false;
        }

        try {
            const { error } = await supabase
                .from('metrics_events')
                .insert({
                    event_type: event.type,
                    event_name: event.name,
                    payload: event.payload,
                    anonymous_id: event.anonymousId,
                    user_id: (event.userId && event.userId.trim() !== '') ? event.userId : null,
                    session_id: event.sessionId,
                    timestamp: event.timestamp || new Date().toISOString(),
                    app_version: event.appVersion,
                    environment: event.environment,
                });

            if (error) {
                console.error('Error de Supabase (Métricas):', error.message, error.details);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Excepción al enviar métrica a Supabase:', error);
            return false;
        }
    }

    /**
     * Identifica a un usuario para eventos futuros.
     * 
     * @param userId - ID único del usuario.
     */
    async identify(userId: string): Promise<void> {
        // En el caso de Supabase, el user_id se envía en cada evento si está presente.
        // Esta función podría usarse para persistir el ID en el estado local si fuera necesario.
    }
}
