/**
 * Proveedor de consentimiento para métricas.
 * Gestiona las preferencias del usuario y persiste en localStorage/Supabase.
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { type MetricsConsent } from '../lib/metrics/types';
import { supabase } from '../lib/supabase/client';
import { metricsCollector } from '../lib/metrics/collector';

interface MetricsContextType {
    consent: MetricsConsent;
    updateConsent: (newConsent: Partial<MetricsConsent>) => Promise<void>;
    isLoading: boolean;
}

const defaultConsent: MetricsConsent = {
    technicalMetrics: true,
    productMetrics: true,
    marketingMetrics: true,
    lastUpdated: new Date().toISOString(),
};

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

export function MetricsProvider({ children }: { children: React.ReactNode }) {
    const [consent, setConsent] = useState<MetricsConsent>(defaultConsent);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadConsent = async () => {
            const saved = localStorage.getItem('recetaz_metrics_consent');
            let currentConsent = defaultConsent;

            if (saved) {
                try {
                    currentConsent = JSON.parse(saved);
                    setConsent(currentConsent);
                } catch (e) {
                    console.error('Error parseando consentimiento guardado:', e);
                }
            } else {
                // Si es la primera vez, persistir localmente el consentimiento por defecto
                localStorage.setItem('recetaz_metrics_consent', JSON.stringify(defaultConsent));
            }

            // Habilitar sincronización inicial con Supabase
            // Esperar un poco para asegurar que MetricsCollector haya generado el anonymousId si es necesario
            setTimeout(async () => {
                const anonymousId = localStorage.getItem('recetaz_anonymous_id');
                console.log('[ConsentSync] Verificando ID para sincronización:', anonymousId);

                if (anonymousId && supabase) {
                    try {
                        const { error } = await supabase.from('metrics_consent').upsert({
                            anonymous_id: anonymousId,
                            technical_metrics: currentConsent.technicalMetrics,
                            product_metrics: currentConsent.productMetrics,
                            marketing_metrics: currentConsent.marketingMetrics,
                            last_updated: currentConsent.lastUpdated
                        }, { onConflict: 'anonymous_id' });

                        if (error) {
                            console.error('[ConsentSync] Error de Supabase:', error.message);
                        } else {
                            console.log('[ConsentSync] Consentimiento sincronizado exitosamente.');
                        }
                    } catch (err) {
                        console.error('[ConsentSync] Fallo crítico de red:', err);
                    }
                } else {
                    console.warn('[ConsentSync] No se pudo sincronizar: ' + (!anonymousId ? 'Falta ID' : 'Falta Supabase client'));
                }
            }, 1500);

            setIsLoading(false);
        };
        loadConsent();
    }, []);

    const updateConsent = async (newConsent: Partial<MetricsConsent>) => {
        const updated = { ...consent, ...newConsent, lastUpdated: new Date().toISOString() };
        setConsent(updated);
        localStorage.setItem('recetaz_metrics_consent', JSON.stringify(updated));

        // Sincronizar con Supabase en segundo plano
        const anonymousId = localStorage.getItem('recetaz_anonymous_id');
        if (anonymousId && supabase) {
            supabase.from('metrics_consent').upsert({
                anonymous_id: anonymousId,
                technical_metrics: updated.technicalMetrics,
                product_metrics: updated.productMetrics,
                marketing_metrics: updated.marketingMetrics,
                last_updated: updated.lastUpdated
            }, { onConflict: 'anonymous_id' })
                .then(({ error }: { error: any }) => {
                    if (error) console.error('Error al sincronizar consentimiento:', error);
                })
                .catch((err: any) => console.error('Error de red al sincronizar consentimiento:', err));
        }
    };

    return (
        <MetricsContext.Provider value={{ consent, updateConsent, isLoading }}>
            {children}
        </MetricsContext.Provider>
    );
}

export function useMetricsConsent() {
    const context = useContext(MetricsContext);
    if (context === undefined) {
        throw new Error('useMetricsConsent debe usarse dentro de un MetricsProvider');
    }
    return context;
}
