/**
 * Hook personalizado para el uso de métricas en componentes React.
 * Encapsula la lógica de consentimiento y el acceso al colector.
 */

'use client';

import { useCallback } from 'react';
import { metricsCollector } from '../lib/metrics/collector';
import { type EventType, type Severity } from '../lib/metrics/types';
import { useMetricsConsent } from '../providers/MetricsProvider';

/**
 * Hook para disparar eventos de métricas.
 * 
 * @returns Funciones para trackear eventos.
 */
export function useMetrics() {
    const { consent } = useMetricsConsent();

    /**
     * Registra un evento de uso o marketing.
     */
    const track = useCallback((
        name: string,
        payload: Record<string, any> = {},
        type: EventType = 'user_action',
        priority: Severity = 'medium'
    ) => {
        // Solo trackear si hay consentimiento para métricas de producto
        if (consent.productMetrics) {
            metricsCollector.track(name, type, payload, priority);
        }
    }, [consent.productMetrics]);

    /**
     * Registra un error crítico.
     */
    const trackError = useCallback((
        name: string,
        error: any,
        severity: Severity = 'high'
    ) => {
        // Siempre trackear errores (técnicas) ya que son anónimos
        if (consent.technicalMetrics) {
            metricsCollector.track(name, 'error', {
                message: error?.message || 'Error desconocido',
                stack: error?.stack,
                ...error
            }, severity);
        }
    }, [consent.technicalMetrics]);

    /**
     * Registra un evento de marketing (Funnels/Conversion).
     */
    const trackMarketing = useCallback((
        name: string,
        payload: Record<string, any> = {}
    ) => {
        // Solo trackear si hay consentimiento para marketing
        if (consent.marketingMetrics) {
            metricsCollector.track(name, 'marketing', payload, 'high');
        }
    }, [consent.marketingMetrics]);

    return {
        track,
        trackError,
        trackMarketing,
        identify: (userId: string) => metricsCollector.identify(userId),
    };
}
