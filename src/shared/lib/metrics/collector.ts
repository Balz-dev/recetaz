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
        // Validar tamaño máximo del payload para evitar DoS costoso o inyección masiva
        const payloadString = JSON.stringify(payload);
        if (payloadString.length > 2000) {
            console.warn(`[Seguridad] Evento métrico ${name} rechazado: Payload demasiado grande (${payloadString.length} bytes). Límite es 2000.`);
            return; // Rechazar silenciosamente el trackeo
        }

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

        // Prevención de Queue Overfill (Rate Limit Offline DoS)
        const currentCount = await metricsQueueDB.metricsQueue.count();
        if (currentCount > 500) {
            console.warn('[Seguridad] Cola local de métricas excedida (Lim: 500). Pausando ingesta hasta sincronización.');
            // Eliminamos los 100 más antiguos para hacer espacio si se fuerza
            const oldest = await metricsQueueDB.metricsQueue.orderBy('timestamp').limit(100).keys();
            await metricsQueueDB.metricsQueue.bulkDelete(oldest as number[]);
        }

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
