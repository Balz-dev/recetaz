/**
 * Colector central de métricas para RecetaZ.
 * Gestiona la captura, almacenamiento local (Dexie) y sincronización con Supabase.
 */

'use client';

import { v4 as uuidv4 } from 'uuid';
import { metricsQueueDB } from './queue';
import { SupabaseMetricsProvider, type MetricsProvider } from './adapter';
import { type MetricEvent, type EventType, type Severity } from './types';

class MetricsCollector {
    private provider: MetricsProvider;
    private anonymousId: string;
    private sessionId: string;
    private userId?: string;
    private appVersion: string;
    private environment: string;

    constructor() {
        this.provider = new SupabaseMetricsProvider();
        this.anonymousId = this.getOrCreateAnonymousId();
        this.sessionId = uuidv4();
        this.appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
        this.environment = process.env.NODE_ENV || 'development';

        // Sincronizar al inicio
        if (typeof window !== 'undefined') {
            this.sync();
            // Sincronizar periódicamente cada 5 minutos
            setInterval(() => this.sync(), 5 * 60 * 1000);
            // Sincronizar al recuperar conexión
            window.addEventListener('online', () => this.sync());
        }
    }

    /**
     * Obtiene o genera un ID anónimo persistente en localStorage.
     */
    private getOrCreateAnonymousId(): string {
        if (typeof window === 'undefined') return '';
        let id = localStorage.getItem('recetaz_anonymous_id');
        if (!id) {
            id = uuidv4();
            localStorage.setItem('recetaz_anonymous_id', id);
        }
        return id;
    }

    /**
     * Identifica al usuario actual.
     */
    public identify(userId: string) {
        this.userId = userId;
    }

    /**
     * Registra un evento de métrica.
     * 
     * @param name - Nombre del evento.
     * @param type - Tipo de evento.
     * @param payload - Datos adicionales del evento.
     * @param priority - Prioridad de envío.
     */
    public async track(
        name: string,
        type: EventType = 'user_action',
        payload: Record<string, any> = {},
        priority: Severity = 'medium'
    ) {
        const event: MetricEvent = {
            name,
            type,
            payload,
            timestamp: new Date().toISOString(),
            anonymousId: this.anonymousId,
            sessionId: this.sessionId,
            userId: this.userId,
            appVersion: this.appVersion,
            environment: this.environment,
        };

        // 1. Guardar en la cola local (Offline-first)
        await metricsQueueDB.metricsQueue.add({
            ...event as any,
            retryCount: 0,
            priority,
            synced: 0,
        });

        // 2. Intentar enviar inmediatamente si hay conexión (y no es crítico diferir)
        if (navigator.onLine) {
            this.sync();
        }
    }

    /**
     * Sincroniza eventos pendientes en la cola local con el proveedor.
     */
    public async sync() {
        if (!navigator.onLine) return;

        const pendingEvents = await metricsQueueDB.metricsQueue
            .where('synced')
            .equals(0)
            .limit(50)
            .toArray();

        for (const item of pendingEvents) {
            const success = await this.provider.track(item);
            if (success) {
                await metricsQueueDB.metricsQueue.update(item.id!, { synced: 1 });
                // Opcionalmente eliminar después de sincronizar para no llenar IndexedDB
                // await metricsQueueDB.metricsQueue.delete(item.id!);
            } else {
                await metricsQueueDB.metricsQueue.update(item.id!, {
                    retryCount: (item.retryCount || 0) + 1
                });
            }
        }
    }
}

/**
 * Instancia única del colector de métricas.
 */
export const metricsCollector = new MetricsCollector();
