/**
 * Tipos para el sistema de métricas de RecetaZ.
 * Siguiendo las reglas de documentación en español.
 */

export type EventType = 'error' | 'performance' | 'user_action' | 'marketing' | 'technical';

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type UserImpact =
  | 'app_crash'
  | 'feature_broken'
  | 'visual_glitch'
  | 'degraded_performance';

/**
 * Representa un evento de métrica genérico.
 */
export interface MetricEvent {
  type: EventType;
  name: string;
  payload: Record<string, any>;
  timestamp: string;
  sessionId: string;
  anonymousId: string;
  userId?: string;
  appVersion: string;
  environment: string;
}

/**
 * Item en la cola local de Dexie antes de ser sincronizado.
 */
export interface MetricQueueItem extends MetricEvent {
  id?: number;
  retryCount: number;
  priority: Severity;
  synced: number; // 0 para no sincronizado, 1 para sincronizado
}

/**
 * Configuración de consentimiento del usuario.
 */
export interface MetricsConsent {
  technicalMetrics: boolean;
  productMetrics: boolean;
  marketingMetrics: boolean;
  lastUpdated: string;
}
