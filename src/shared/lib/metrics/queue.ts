/**
 * Base de datos IndexedDB para la cola de métricas usando Dexie.js.
 * Permite el funcionamiento offline-first de RecetaZ.
 */

'use client';

import Dexie, { type Table } from 'dexie';
import { type MetricQueueItem } from './types';

export class MetricsQueueDB extends Dexie {
    metricsQueue!: Table<MetricQueueItem>;

    constructor() {
        super('RecetazMetricsDB');

        this.version(2).stores({
            metricsQueue: '++id, synced, priority, timestamp, type, name'
        });
    }
}

/**
 * Instancia global de la base de datos de métricas.
 */
export const metricsQueueDB = new MetricsQueueDB();
