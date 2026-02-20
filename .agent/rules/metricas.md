---
trigger: always_on
glob:
description:
---
# Prompt Maestro Actualizado: Sistema de Métricas para SaaS Médico PWA

## INFORMACIÓN CRÍTICA: Lee Primero

Este prompt genera un sistema completo de métricas para un SaaS médico específico. **NO es un template genérico**.

**Producto**: PWA offline-first que ayuda a médicos con recetas médicas  
**Stack**: Next.js App Router + Dexie.js + Supabase  
**Objetivo**: Retención/Engagement (crear producto indispensable antes de monetizar)  
**North Star Metric**: "Médicos activos semanales que generan ≥5 recetas/semana"

---

## Contexto del Proyecto

### Descripción del SaaS Médico

Sistema PWA offline-first para médicos que proporciona:

**Funcionalidades Core**:
1. **Captura e impresión de recetas médicas**
   - Formulario inteligente de recetas
   - Impresión directa o export a PDF
   - Hojas membretadas personalizables

2. **Autocompletado de diagnósticos recurrentes**
   - Aprende de recetas anteriores
   - Sugiere diagnósticos frecuentes
   - Autocompleta medicamentos y dosis

3. **Registro histórico de pacientes y recetas**
   - Base de datos local (Dexie.js)
   - Búsqueda rápida de pacientes
   - Historial completo por paciente

4. **Visualización de ganancias**
   - Gráficas semanales/mensuales/anuales
   - Basadas en costo de consulta por receta
   - Gamificación para engagement

5. **Editor de plantillas personalizadas**
   - Diseño desde cero
   - Carga de imagen (hoja membretada existente)
   - Galería de plantillas prediseñadas

**Onboarding con Dra. Zoyla (Avatar Asistente)**:
- **Paso 1**: Bienvenida (introducción al producto)
- **Paso 2**: Instalación PWA (opcional)
- **Paso 3**: Datos del médico (nombre, cédula, especialidad, etc.)
- **Paso 4**: Backup con Google (opcional)

**Modelo de Negocio**:
- Freemium con límite de recetas/mes (TBD basado en métricas)
- Objetivo: medir uso real antes de definir pricing
- Estrategia: retención primero, monetización después

### Stack Tecnológico

- **Frontend/Backend**: Next.js 14+ (App Router)
- **Arquitectura**: PWA offline-first (Service Worker + Background Sync)
- **Base de datos local**: Dexie.js (IndexedDB wrapper)
- **Backend de métricas**: Supabase (PostgreSQL managed)
- **Analytics**: PostHog Cloud (opcional, open-source)
- **Deployment**: Vercel / Netlify

### Arquitectura de Métricas

**Estrategia Híbrida con Plan de Migración**:
- Backend inicial: Supabase (free tier: 500MB DB)
- Visualización: PostHog Cloud (free tier: 1M eventos/mes)
- Patrón Adapter para cambiar providers sin reescribir código
- Exportación automática de datos para migración futura

**Flujo de Datos** (PWA Client-Side Only):
```
[Browser/PWA Client Components]
        ↓
[MetricsCollector] → Recolecta eventos
        ↓
[LocalQueue (Dexie)] → Almacena temporalmente
        ↓
[Connection Monitor] → Detecta online/offline
        ↓
[MetricsAdapter] → Abstraction layer
        ↓
[Supabase Client] → fetch() directo (NO API Routes)
        ↓
[Supabase REST API]
        ↓
[PostgreSQL] → Almacena métricas
        ↓
[Service Worker] → Background Sync al reconectar
```

**CRÍTICO - Restricciones de PWA**:
- ❌ NO usar Server Components de Next.js
- ❌ NO usar API Routes (`/app/api/*`)
- ✅ TODO debe ser client-side con `'use client'`
- ✅ Comunicación directa Browser → Supabase REST API
- ✅ Service Worker para Background Sync

---

## Especificación de Eventos

**IMPORTANTE**: Consulta el documento "Especificación de Eventos - SaaS Médico de Recetas" para la lista COMPLETA y detallada de todos los eventos.

### Resumen de Categorías

#### NIVEL 1: Crítico (Implementar PRIMERO)
1. **Health & Performance** (Anónimas)
   - `error_occurred` - Errores críticos
   - `web_vitals` - LCP, FID, CLS, TTFB, FCP
   - `offline_event` - Estado offline/sync

2. **Onboarding** (Opt-in)
   - `onboarding_started` / `_step_viewed` / `_step_completed`
   - `onboarding_step_skipped` / `_abandoned` / `_completed`

3. **Activación - Primera Receta** (Opt-in)
   - `first_prescription_created` - Momento "Aha!"
   - `prescription_milestone` - 5, 10, 25, 50, 100 recetas

4. **Sessions & Retention** (Opt-in)
   - `session_started` / `session_ended`
   - `user_active` - Cohort analysis data

#### NIVEL 2: Importante (Implementar SEGUNDO)
5. **Feature Usage - Recetas** (Opt-in)
   - `prescription_created` / `_edited` / `_deleted`
   - `prescription_printed`

6. **Feature Usage - Autocompletado** (Opt-in)
   - `autocomplete_used` / `_dismissed`

7. **Feature Usage - Plantillas** (Opt-in - FUNNEL CRÍTICO)
   - `template_setup_started`
   - `template_method_selected`
   - `template_image_loaded`
   - `template_field_edited`
   - `template_save_attempted`
   - `template_setup_abandoned` / `_completed`

8. **Feature Usage - Gráficas** (Opt-in)
   - `charts_viewed`
   - `earnings_milestone`

#### NIVEL 3: Optimización (Implementar TERCERO)
9. **UX Patterns** (Opt-in)
   - `rage_click` / `dead_click`
   - `ui_confusion`

10. **Distribución & Patrones** (Opt-in)
    - `usage_pattern_analysis`
    - `user_segment_identified`

---

## Requisitos Funcionales

### 1. Gestión de Privacidad y Consentimiento

#### Banner de Consentimiento (Primera Vez)
```typescript
interface ConsentSettings {
  technicalMetrics: boolean; // Siempre true (informar, no pedir)
  productMetrics: boolean; // false por defecto (opt-in)
  lastUpdated: Date;
}
```

**UI Requerido**:
- Banner no intrusivo en primera carga
- Mensaje: "Usamos métricas anónimas para mejorar la app. [Ver detalles] [Aceptar todo] [Solo esenciales]"
- Link a configuración detallada
- Persistir decisión en localStorage + Supabase

#### Configuración Granular
```typescript
<MetricsSettings>
  <Toggle 
    label="Métricas técnicas (recomendado)"
    description="Errores, performance. Nos ayuda a mantener la app estable."
    value={true}
    disabled={true} // Siempre activas, pero informamos
  />
  <Toggle 
    label="Métricas de uso de producto"
    description="Qué features usas, cómo las usas. Nos ayuda a mejorar la experiencia."
    value={consent.productMetrics}
    onChange={updateConsent}
  />
</MetricsSettings>
```

### 2. Estrategia de Envío (Client-Side)

#### Métricas Críticas (Tiempo Real)
- Errores con `severity: 'critical'`
- Crashes de aplicación
- Storage errors (riesgo de pérdida de datos)

**Envío**: Inmediato con `fetch()` directo a Supabase cuando hay conexión

#### Métricas Diferidas (Batch)
- Todo lo demás (uso de features, sessions, UX patterns)

**Envío**:
- Acumulación en Dexie.js
- Verificación cada 5 minutos si hay conexión
- Service Worker Background Sync al reconectar
- Batch de máximo 100 eventos o 1MB

#### Connection Monitoring
```typescript
// lib/metrics/connection.ts
'use client';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger sync
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      track('offline_event', { event: 'went_offline' });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
}
```

### 3. Service Worker Background Sync

```javascript
// public/sw-metrics.js

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-metrics') {
    event.waitUntil(syncPendingMetrics());
  }
});

async function syncPendingMetrics() {
  // Leer cola de Dexie
  // Enviar a Supabase en batches
  // Marcar como sincronizados
  // Limpiar cola
}
```

### 4. Arquitectura del Sistema (Client-Side Only)

#### Patrón Adapter
```typescript
// lib/metrics/adapter.ts
'use client';

export interface MetricsProvider {
  track(event: MetricEvent): Promise<void>;
  identify(userId: string, traits?: object): Promise<void>;
  flush(): Promise<void>;
  export(format: 'json' | 'csv'): Promise<Blob>;
}

// Implementaciones intercambiables
export class SupabaseMetricsProvider implements MetricsProvider {
  async track(event: MetricEvent): Promise<void> {
    // fetch() directo a Supabase REST API
    const { data, error } = await supabase
      .from('metrics_events')
      .insert({
        event_type: event.type,
        event_name: event.name,
        payload: event.payload,
        // ...
      });
  }
}

export class PostHogMetricsProvider implements MetricsProvider {
  async track(event: MetricEvent): Promise<void> {
    // PostHog client
  }
}
```

#### Queue Local (Dexie.js)
```typescript
// lib/metrics/queue.ts
'use client';

import Dexie, { Table } from 'dexie';

interface MetricQueueItem {
  id?: number;
  eventType: string;
  eventName: string;
  payload: any;
  sessionId: string;
  timestamp: Date;
  retryCount: number;
  priority: 'critical' | 'normal' | 'low';
  synced: boolean;
}

class MetricsQueueDB extends Dexie {
  metricsQueue!: Table<MetricQueueItem>;

  constructor() {
    super('MetricsQueueDB');
    this.version(1).stores({
      metricsQueue: '++id, synced, priority, timestamp'
    });
  }
}

export const metricsQueueDB = new MetricsQueueDB();
```

---

## Requisitos Técnicos

### 5. Esquema de Base de Datos Supabase

**NOTA**: El schema SQL completo ya está creado. Ver "Configuración Completa de Supabase para Métricas PWA".

Tablas principales:
- `metrics_events` - Eventos individuales
- `metrics_sessions` - Agregación de sesiones
- `metrics_consent` - Preferencias de usuario

### 6. Estructura de Código (Client-Side Only)

```
src/
├── app/
│   ├── layout.tsx (MetricsProvider aquí con 'use client')
│   └── page.tsx
├── lib/
│   ├── supabase/
│   │   └── client.ts ('use client')
│   └── metrics/
│       ├── index.ts ('use client' - exports principales)
│       ├── collector.ts ('use client')
│       ├── adapter.ts ('use client')
│       ├── queue.ts ('use client' - Dexie)
│       ├── connection.ts ('use client' - online/offline)
│       ├── sync.ts ('use client')
│       ├── config.ts
│       ├── types.ts
│       ├── events/
│       │   ├── onboarding.ts ('use client')
│       │   ├── prescriptions.ts ('use client')
│       │   ├── templates.ts ('use client')
│       │   ├── autocomplete.ts ('use client')
│       │   └── charts.ts ('use client')
│       ├── providers/
│       │   ├── supabase.ts ('use client')
│       │   └── posthog.ts ('use client')
│       └── utils/
│           ├── anonymizer.ts
│           ├── validator.ts
│           └── export.ts
├── hooks/
│   ├── useMetrics.ts ('use client')
│   ├── useErrorBoundary.ts ('use client')
│   ├── usePerformance.ts ('use client')
│   └── useOnlineStatus.ts ('use client')
├── components/
│   ├── ConsentBanner.tsx ('use client')
│   ├── MetricsSettings.tsx ('use client')
│   ├── MetricsProvider.tsx ('use client')
│   └── MetricsDebugger.tsx ('use client' - solo dev)
└── public/
    └── sw-metrics.js (Service Worker)
```

**CRÍTICO**:
- ❌ NO crear carpeta `/app/api/`
- ✅ Todos los archivos con hooks/estado: `'use client'`
- ✅ Service Worker en `/public/` para Background Sync

### 7. TypeScript Types

```typescript
// lib/metrics/types.ts

export type EventType = 'error' | 'performance' | 'user_action' | 'technical';

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type UserImpact = 
  | 'app_crash' 
  | 'feature_broken' 
  | 'visual_glitch' 
  | 'degraded_performance';

export type OnboardingStep = 
  | 'welcome' 
  | 'pwa_install' 
  | 'doctor_info' 
  | 'google_backup';

export type TemplateMethod = 
  | 'gallery' 
  | 'upload' 
  | 'design_from_scratch';

export type UserSegment = 
  | 'new' 
  | 'casual' 
  | 'regular' 
  | 'power_user';

export interface MetricEvent {
  type: EventType;
  name: string;
  payload: Record<string, any>;
  timestamp: Date;
  sessionId: string;
  anonymousId: string;
  userId?: string;
}

export interface ErrorEvent {
  errorType: 'uncaught_exception' | 'promise_rejection' | 'network_error' | 'storage_error';
  errorMessage: string;
  errorStack: string;
  severity: Severity;
  userImpact: UserImpact;
  appVersion: string;
  environment: 'production' | 'development';
  browser: string;
  os: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  route: string;
  feature: string;
  storageUsed?: string;
  storageAvailable?: string;
}

// ... ver Especificación de Eventos para tipos completos
```

### 8. Hooks de React Principales

#### useMetrics
```typescript
// hooks/useMetrics.ts
'use client';

export function useMetrics() {
  const { consent, updateConsent } = useConsent();
  const { isOnline, queueSize } = useOnlineStatus();
  
  const track = useCallback((eventName: string, payload: any) => {
    if (!consent.productMetrics && !isAnonymousEvent(eventName)) {
      return; // Usuario no dio consentimiento
    }
    
    metricsCollector.track(eventName, payload);
  }, [consent]);
  
  return {
    track,
    consent,
    updateConsent,
    isOnline,
    queueSize,
  };
}
```

#### useErrorBoundary
```typescript
// hooks/useErrorBoundary.ts
'use client';

export function useErrorBoundary() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      track('error_occurred', {
        errorType: 'uncaught_exception',
        errorMessage: event.message,
        errorStack: sanitizeStack(event.error?.stack),
        // ...
      });
    };
    
    const handleRejection = (event: PromiseRejectionEvent) => {
      track('error_occurred', {
        errorType: 'promise_rejection',
        // ...
      });
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);
}
```

#### usePerformance (Web Vitals)
```typescript
// hooks/usePerformance.ts
'use client';

import { onLCP, onFID, onCLS } from 'web-vitals';

export function usePerformance() {
  useEffect(() => {
    onLCP((metric) => {
      track('web_vitals', {
        metric: 'LCP',
        value: metric.value,
        rating: metric.rating,
        route: window.location.pathname,
        // ...
      });
    });
    
    onFID((metric) => { /* ... */ });
    onCLS((metric) => { /* ... */ });
  }, []);
}
```

---

## Entregables Esperados

### 1. Configuración de Supabase
- ✅ Ya proporcionado: Script SQL completo
- ✅ Ya proporcionado: Guía paso a paso de configuración

### 2. SDK de Métricas (Client-Side)
Generar todos los archivos de `lib/metrics/` según estructura especificada:
- Collector, adapter, queue, sync, connection
- Eventos separados por feature (onboarding, prescriptions, templates, etc.)
- Providers (Supabase, PostHog)
- Utilities (anonymizer, validator, export)

### 3. Hooks de React
- `useMetrics` - Hook principal
- `useErrorBoundary` - Captura automática de errores
- `usePerformance` - Web Vitals tracking
- `useOnlineStatus` - Estado de conexión
- `useConsent` - Gestión de consentimiento

### 4. Componentes UI (Client Components)
- `ConsentBanner.tsx` - Banner inicial
- `MetricsSettings.tsx` - Configuración detallada
- `MetricsProvider.tsx` - Context provider global
- `MetricsDebugger.tsx` - Panel de debug (solo dev)

### 5. Service Worker
- `public/sw-metrics.js` - Background Sync API

### 6. Configuración
- `.env.example` con variables necesarias
- `lib/metrics/config.ts` con configuración centralizada

### 7. Documentación
- README de implementación
- Guía de uso con ejemplos
- Guía de migración futura

---

## Ejemplos de Uso Esperados

### Ejemplo 1: Tracking Automático de Errores
```typescript
// Sin configuración adicional
throw new Error('Something went wrong'); 
// → Automáticamente capturado y enviado a Supabase
```

### Ejemplo 2: Evento de Onboarding
```typescript
'use client';

function OnboardingWizard() {
  const { track } = useMetrics();
  
  const handleStepComplete = (step: number) => {
    track('onboarding_step_completed', {
      step: ['welcome', 'pwa_install', 'doctor_info', 'google_backup'][step],
      stepNumber: step + 1,
      totalSteps: 4,
      timeSpent: performance.now() - stepStartTime,
    });
  };
  
  // ...
}
```

### Ejemplo 3: Primera Receta (Momento "Aha!")
```typescript
'use client';

function PrescriptionForm() {
  const { track } = useMetrics();
  
  const handleSave = async (prescription) => {
    const saved = await savePrescription(prescription);
    
    const isFirstEver = await isFirstPrescription();
    if (isFirstEver) {
      track('first_prescription_created', {
        timeToFirstPrescription: getTimeSinceSignup(),
        usedAutocomplete: prescription.usedAutocomplete,
        hasPatient: !!prescription.patientId,
        // ...
      });
    }
    
    track('prescription_created', {
      prescriptionId: saved.id,
      hasPatient: !!prescription.patientId,
      diagnosisType: prescription.diagnosisType,
      // ...
    });
  };
}
```

### Ejemplo 4: Template Setup (Funnel Crítico)
```typescript
'use client';

function TemplateEditor() {
  const { track } = useMetrics();
  
  useEffect(() => {
    track('template_setup_started', {
      source: 'onboarding',
      hasExistingTemplate: false,
    });
  }, []);
  
  const handleMethodSelect = (method) => {
    track('template_method_selected', {
      method,
      timeToDecide: performance.now() - startTime,
    });
  };
  
  const handleSaveAttempt = async () => {
    const result = await validateAndSave();
    
    track('template_save_attempted', {
      success: result.success,
      attemptNumber: attempts + 1,
      errorType: result.error?.type,
      missingFields: result.missingFields,
      progress: calculateProgress(),
      timeSpent: performance.now() - editorStartTime,
    });
    
    if (result.success) {
      track('template_setup_completed', {
        method: selectedMethod,
        totalTime: performance.now() - editorStartTime,
        // ...
      });
    }
  };
}
```

### Ejemplo 5: Offline/Online Status
```typescript
'use client';

function SyncStatusBadge() {
  const { isOnline, queueSize } = useMetrics();
  
  return (
    <div>
      {isOnline ? (
        <Badge variant="success">Sincronizado</Badge>
      ) : (
        <Badge variant="warning">
          {queueSize} métricas pendientes
        </Badge>
      )}
    </div>
  );
}
```

---

## Restricciones y Consideraciones

### Restricciones Técnicas (PWA Specific)
- **Bundle size**: SDK < 50KB en bundle inicial
- **No bloquear render**: Todo asíncrono y non-blocking
- **TypeScript strict mode**: Código debe pasar TS strict
- **Tree-shakeable**: Imports optimizados
- ⚠️ **NO usar Server Components**: Todo con `'use client'`
- ⚠️ **NO usar API Routes**: Browser → Supabase directo
- ⚠️ **Offline-first**: Funcionar sin conexión
- ⚠️ **Service Worker compatible**: No conflictos con Next.js PWA

### Seguridad
- **Nunca loggear**: Nombres de pacientes, diagnósticos específicos, datos médicos
- **Sanitizar stacks**: Remover rutas absolutas del sistema
- **Rate limiting**: Client-side (evitar abuse)
- **RLS en Supabase**: Ya configurado (permite INSERT anónimo, bloquea SELECT/UPDATE/DELETE)

### Privacidad (GDPR/CCPA Compliant)
- Banner de consentimiento claro
- Configuración granular (técnicas vs producto)
- Anonimización real (UUIDs, no datos identificables)
- Derecho al olvido (función para eliminar datos del usuario)
- Exportación de datos (usuario puede descargar sus métricas)

### Performance
- **Debouncing**: Eventos similares en ventana de 1 seg
- **Throttling**: Máximo 1 request cada 5 segundos (batch)
- **Lazy loading**: SDK no afecta tiempo de carga inicial
- **Compression**: Gzip payloads grandes antes de enviar

### Escalabilidad Futura
- **Particionamiento**: Cuando llegue a 10M+ eventos
- **Aggregation tables**: Para queries rápidos
- **Data retention**: 90 días eventos raw, 2 años agregados
- **Migration path**: Adapter pattern permite cambiar provider fácilmente

---

## Criterios de Éxito

El sistema será exitoso si:

✅ **Funcionalidad**
- Captura automática de errores sin config adicional
- Tracking de eventos custom con 1 línea de código
- Queue local funciona offline sin pérdida de datos
- Background Sync sincroniza al reconectar (app cerrada)

✅ **Performance**
- Cero impacto en Web Vitals (LCP, FID, CLS)
- Envío de métricas no degrada UX
- Bundle size < 50KB

✅ **Privacidad**
- Consentimiento claro y granular
- Anonimización real (no identificable)
- GDPR/CCPA compliant

✅ **Escalabilidad**
- Arquitectura permite migrar providers sin reescribir
- Funciona desde 10 hasta 100K usuarios sin cambios

✅ **Developer Experience**
- Setup < 30 minutos
- API intuitiva y bien documentada
- TypeScript autocompletion perfecto

✅ **Business Value**
- Puedo responder: "¿Cuántos médicos generaron ≥5 recetas esta semana?"
- Puedo identificar: "¿Dónde abandonan en onboarding?"
- Puedo medir: "¿Retención D7 con autocomplete vs sin él?"
- Puedo detectar: "¿Qué médicos en riesgo de churn?"

---

## Dashboard Mínimo Viable

### Vista Diaria (10 segundos de lectura)
```
🚨 Errores Críticos:     0 (✅)
⚡ LCP Promedio:         1.4s (✅ good)
👥 Usuarios Activos:    12
📝 Recetas Hoy:         45
🎯 North Star (WAU ≥5): 8 médicos
```

### Vista Semanal (5 minutos de análisis)
```
📊 Retención
  - D1: 60% (target: 70%)
  - D7: 35% ⚠️ (target: 50%)
  
🎯 Activación
  - Onboarding Completion: 65%
  - Template Setup: 48% ❌ (CRITICAL)
  - Time to 1st Rx: 3.5 días (target: <1)
  
🎨 Features
  - Autocomplete: 45%
  - Charts: 20%
  - Batch Workers: 30%
  
🐛 Top Issues
  1. Template abandono "editing_fields" (25%)
  2. Print falla Android (8 casos)
```

---

## Instrucciones Finales para la IA Generadora

**Genera**:
1. Código completo y production-ready
2. Siguiendo Next.js App Router best practices
3. TypeScript strict mode
4. Comentarios en código complejo
5. Validaciones de schemas antes de enviar eventos
6. Error handling robusto

**Prioriza**:
- Código modular (máximo 100 líneas por archivo)
- Type safety total (strict TypeScript)
- Código mantenible y extensible
- Performance (lazy loading, code splitting)
- Separación de concerns (un archivo = una responsabilidad)

**Evita**:
- Over-engineering
- Dependencias innecesarias
- Código acoplado a providers
- Logging excesivo
- Archivos monolíticos

**Arquitectura**:
- Client-side only (NO Server Components, NO API Routes)
- Comunicación directa Browser → Supabase REST API
- Service Worker para Background Sync
- Dexie.js para queue local persistente
- Adapter Pattern para intercambiar providers

---

## Variables de Entorno

```env
# .env.local

# Supabase (REQUERIDO)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# PostHog (OPCIONAL)
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# App Config (REQUERIDO)
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=production
```

---

## Notas de Implementación

### Orden de Implementación Sugerido

**Paso 1: Infraestructura Base** (Día 1-2)
- Supabase client setup
- MetricsProvider context
- Queue local (Dexie)
- Connection monitor
- Tipos TypeScript

**Paso 2: Health Metrics** (Día 3)
- Error tracking automático
- Web Vitals tracking
- Offline/sync events

**Paso 3: Onboarding & Activación** (Día 4-5)
- Onboarding funnel events
- First prescription tracking
- Session tracking básico

**Paso 4: Feature Usage** (Semana 2)
- Prescription CRUD events
- Autocomplete tracking
- Template editor funnel (CRÍTICO)
- Charts usage

**Paso 5: Service Worker & Sync** (Semana 2)
- Background Sync API
- Batch processing
- Retry logic con backoff exponencial

**Paso 6: UI Components** (Semana 3)
- ConsentBanner
- MetricsSettings
- MetricsDebugger (dev only)

**Paso 7: Optimización & Testing** (Semana 3-4)
- UX patterns (rage clicks, etc.)
- Performance optimization
- Testing básico

---

## Testing Recomendado

### Tests Unitarios (Opcional pero Recomendado)
```typescript
// __tests__/metrics/queue.test.ts
describe('MetricsQueue', () => {
  it('should add event to queue', async () => {
    await metricsQueue.add({
      eventType: 'user_action',
      eventName: 'test_event',
      // ...
    });
    
    const items = await metricsQueue.getPending();
    expect(items).toHaveLength(1);
  });
  
  it('should mark events as synced', async () => {
    // ...
  });
});
```

### Tests de Integración
```typescript
// __tests__/metrics/supabase.test.ts
describe('SupabaseMetricsProvider', () => {
  it('should send event to Supabase', async () => {
    const provider = new SupabaseMetricsProvider();
    
    await provider.track({
      type: 'technical',
      name: 'test_event',
      payload: { test: true },
      // ...
    });
    
    // Verificar en Supabase que el evento existe
  });
});
```

---

## Troubleshooting Common Issues

### "Events not appearing in Supabase"
**Diagnóstico**:
1. Check browser console for errors
2. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Check Supabase RLS policies (debe permitir INSERT anónimo)
4. Verify network tab: ¿Hay requests a Supabase?

### "Queue growing too large"
**Solución**:
- Implementar cleanup automático (eliminar eventos >7 días)
- Reducir frecuencia de tracking (agregar debouncing)
- Aumentar frecuencia de sync (cada 3 min vs 5 min)

### "PWA not syncing when offline"
**Diagnóstico**:
1. Verify Service Worker registered: `navigator.serviceWorker.ready`
2. Check sync tag: debe ser exactamente 'sync-metrics'
3. Verify Background Sync API support: `'sync' in self.registration`
4. Safari no soporta Background Sync (fallback a sync manual al abrir app)

### "TypeScript errors in strict mode"
**Solución**:
- Todos los payloads deben tener tipos explícitos
- Usar `Record<string, any>` con cuidado
- Validar schemas antes de enviar

---

## Preguntas Frecuentes

### ¿Puedo usar esto con Next.js Pages Router?
Sí, pero necesitas adaptar:
- Cambiar `'use client'` por imports normales
- Usar `_app.tsx` en vez de `layout.tsx` para MetricsProvider
- El resto es compatible

### ¿Funciona en Safari iOS?
Sí, PERO:
- Safari no soporta Background Sync API
- Fallback: sync manual cuando usuario abre app
- Todo lo demás funciona perfectamente

### ¿Qué pasa si Supabase está caído?
- Eventos se guardan en Dexie.js (queue local)
- Retry automático con backoff exponencial (3 intentos)
- Si falla persistentemente, eventos quedan en cola
- Se envían cuando Supabase vuelva a estar disponible

### ¿Cómo migro a self-hosted después?
1. Exportar datos de Supabase (función `export()`)
2. Crear provider nuevo (ej: `CustomMetricsProvider`)
3. Cambiar config: `provider: 'custom'` en vez de `'supabase'`
4. Histórico se mantiene en JSON/CSV exportado
5. Código de app no cambia (gracias al Adapter Pattern)

### ¿Cuánto cuesta en producción?
**Free tier (0-1000 médicos activos)**:
- Supabase: $0 (hasta 500MB DB)
- PostHog: $0 (hasta 1M eventos/mes)
- Total: $0/mes ✅

**Crecimiento (1K-10K médicos)**:
- Supabase Pro: $25/mes (8GB DB, 50GB bandwidth)
- PostHog: ~$50/mes
- Total: ~$75/mes

**Escala (10K+ médicos)**:
- Considera self-hosting (más económico)
- O Supabase Team: $599/mes (unlimited)

---

## Recursos Adicionales

### Documentación Oficial
- **Supabase Docs**: https://supabase.com/docs
- **Dexie.js**: https://dexie.org/
- **Next.js PWA**: https://github.com/shadowwalker/next-pwa
- **Web Vitals**: https://web.dev/vitals/

### Herramientas de Análisis
- **PostHog**: https://posthog.com/docs
- **Metabase** (open-source BI): https://www.metabase.com/
- **Grafana**: https://grafana.com/

### Inspiración de Dashboards
- **Amplitude Metrics**: https://metrics.amplitude.com
- **Mixpanel Benchmarks**: https://mixpanel.com/benchmarks

---

## Changelog

### v1.0 (2025-01-24)
- ✅ Especificación inicial completa
- ✅ Eventos del NIVEL 1 (críticos) definidos
- ✅ Eventos del NIVEL 2 (importantes) definidos
- ✅ Eventos del NIVEL 3 (optimización) definidos
- ✅ Arquitectura client-side para PWA offline-first
- ✅ Service Worker Background Sync
- ✅ Dashboard mínimo viable definido

### Próximas Versiones
- v1.1: A/B testing infrastructure
- v1.2: Conversion funnel tracking (cuando se agregue paywall)
- v1.3: Predictive churn analysis

---

**IMPORTANTE - LEER ANTES DE GENERAR CÓDIGO**:

1. **Consulta primero** el documento "Especificación de Eventos" para ver TODOS los eventos detallados
2. **Verifica** que Supabase ya esté configurado (ejecutar script SQL primero)
3. **Implementa progresivamente**: No intentes generar todo de una vez
4. **Testea localmente** antes de ir a producción
5. **Empieza con NIVEL 1** (eventos críticos), luego NIVEL 2, luego NIVEL 3

**Preguntas antes de generar código**:
- ¿Ya ejecutaste el script SQL en Supabase? (REQUERIDO)
- ¿Ya tienes las credenciales en `.env.local`? (REQUERIDO)
- ¿Qué nivel de eventos quieres implementar primero? (Recomendado: NIVEL 1)
- ¿Necesitas componentes UI también o solo la lógica de tracking?

---

**Versión**: 1.0  
**Última actualización**: 2025-01-24  
**Autor**: Sistema colaborativo Humano-IA  
**Licencia**: Uso exclusivo para el proyecto SaaS Médico
