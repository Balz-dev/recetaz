# Sistema de Métricas Premium (Marketing-First) - RecetaZ

## 📖 Descripción General
Este documento detalla la implementación del sistema de métricas de RecetaZ, diseñado para transformar el uso de la aplicación en datos accionables para marketing, retención y conversión de ventas, enfocado en médicos independientes en México.

---

## 🏗️ Arquitectura Técnica

### 🧬 Componentes Core
La arquitectura es **Offline-First**, garantizando que ninguna métrica se pierda incluso si el médico no tiene internet en su consultorio.

1.  **`MetricsQueue` (Dexie.js)**: Almacén local persistente para eventos encolados. Ubicado en `src/shared/lib/metrics/queue.ts`.
2.  **`MetricsCollector`**: Singleton central que gestiona la captura, anonimización y sincronización periódica (cada 5 min). Ubicado en `src/shared/lib/metrics/collector.ts`.
3.  **`SupabaseAdapter`**: Capa de abstracción para el envío seguro de datos a Supabase mediante políticas RLS. Ubicado en `src/shared/lib/metrics/adapter.ts`.
4.  **`MetricsProvider`**: Contexto de React que gestiona el consentimiento del usuario. Ubicado en `src/shared/providers/MetricsProvider.tsx`.

### 🔄 Estrategia de Sincronización
- **Tiempo Real**: Intento de envío inmediato al ocurrir un evento (si hay red).
- **Recuperación**: Sincronización automática al detectar restauración de conexión (`online` event).
- **Persistencia**: Sincronización al inicio de la app para subir métricas de sesiones pasadas.
- **Respaldo**: Intervalo de barrido automático cada **5 minutos**.

---

## 📊 Estrategia de Métricas (Marketing & Ventas)

### 1. Funnel de Onboarding (Conversión)
**Objetivo**: Identificar abandono en la configuración inicial del consultorio.
- `onboarding_started`: Inicio del wizard con la Dra. Zoyla.
- `onboarding_step_completed`: Progreso por pasos (Identidad -> Logo -> Consultorio -> Diseño).
- `onboarding_completed`: Hito final de conversión. Captura especialidad y tipo de diseño elegido.

### 2. "Aha! Moments" (Valor del Producto)
**Objetivo**: Medir cuándo el médico percibe el valor real para justificar planes Premium.
- `prescription_created`: Emisión exitosa de receta. Captura volumen y complejidad.
- `treatment_auto_applied`: Uso de protocolos inteligentes. Mide el **ahorro de tiempo**.
- `autocomplete_used`: Eficiencia clínica mediante el catálogo.

### 3. Indicadores de Upsell
**Objetivo**: Detectar candidatos para herramientas de crecimiento.
- `earnings_dashboard_viewed`: Interés explícito en la salud financiera del consultorio.

### 4. Adquisición (Landing Page)
**Objetivo**: Optimizar el embudo de ventas antes del registro.
- `lp_hero_cta_clicked` / `lp_footer_cta_clicked`: Conversión directa a registro.
- `lp_demo_requested`: Interés en exploración sin compromiso.
- `lp_pricing_interacted`: Intención de compra basada en planes.
- `lp_faq_question_expanded`: Identificación de miedos o barreras del médico.
- `lp_feature_card_clicked`: Funcionalidades más atractivas del software.

> [!NOTE]
> **Optimización SEO**: La integración en la Landing Page se realizó mediante un esquema híbrido. La página principal se mantiene como **Server Component** para preservar el posicionamiento orgánico, mientras que los sensores de métricas están encapsulados en sub-componentes **Client Component**.

---

## 🛡️ Privacidad y Ética
Siguiendo las regulaciones de datos médicos y ética profesional:
- **Anonimato**: Se utiliza un `anonymous_id` (UUID) persistente en el dispositivo.
- **Consentimiento**: Implementación de un **Consent Banner** no intrusivo (`src/shared/components/metrics/ConsentBanner.tsx`).
- **Seguridad de Datos**: **Nunca** se registran nombres de pacientes ni diagnósticos sensibles. Solo se registran metadatos de uso.

---

## 🛠️ Herramientas de Desarrollo
Se ha implementado un **Metrics Debugger** visible solo en entorno de desarrollo.
- **Acceso**: Botón flotante de terminal en la parte superior derecha.
- **Función**: Permite ver en tiempo real qué eventos se están disparando, qué hay en la cola de Dexie y su estado de sincronización.

---

## 📋 Lista de Eventos Implementados

| Evento | Tipo | Trigger | Propósito |
| :--- | :--- | :--- | :--- |
| `onboarding_started` | Marketing | Carga inicial del Wizard | Medir tráfico entrante |
| `onboarding_step_completed` | Marketing | Click en "Siguiente" en Wizard | Detectar puntos de fricción |
| `onboarding_completed` | Marketing | Fin de configuración | Métrica principal de registro |
| `prescription_created` | Marketing | Guardar receta con éxito | Activación del producto |
| `treatment_auto_applied` | Marketing | Carga de tratamiento sugerido | Medir ahorro de tiempo |
| `autocomplete_used` | User Action | Selección en catálogo | Engagement con la herramienta |
| `earnings_dashboard_viewed` | Marketing | Abrir panel de finanzas | Intento de compra / Valor premium |
| `lp_hero_cta_clicked` | Marketing | Botón principal de Landing | Conversión a usuario |
| `lp_demo_requested` | Marketing | Botón de probar demo | Interés exploratorio |
| `lp_pricing_interacted` | Marketing | Click en plan de precios | Intención de compra |
| `lp_faq_question_expanded` | Marketing | Abrir pregunta frecuente | Barreras de entrada |
| `lp_feature_card_clicked` | Marketing | Click en tarjeta de función | Interés en feature técnica |
| `error_occurred` | Technical | Catch de excepciones | Estabilidad y retención |

---
*Documento generado automáticamente tras la implementación exitosa del sistema de métricas v1.0.*
