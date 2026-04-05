---
name: evento-metricas
description: Incorporación estandarizada de eventos de tracking PostHog y Supabase.
---

# Skill: Estandarizar Eventos de Métricas

## Contexto
El Tracking en RecetaZ se maneja de forma local primero antes de sincronizar, o directamente si existe red, usando una arquitectura abstraída expuesta en `docs/guias/GUIA_METRICAS.md`. NUNCA enviar datos personales del paciente o médico al tracking.

## Procedimiento para inyectar Métricas a eventos de React

1.  Determinar el contexto de uso: (Botones críticos, Onboarding, Finalizar receta, Errores).
2.  Consultar la documentación oficial de tracking si existen dudas (`docs/guias/GUIA_METRICAS.md`).
3.  Importar el servicio de analítica correspondiente, que en el proyecto será el `posthog-js` con contexto global, o la librería designada para telemetría pura si existe una en `src/shared/metrics`.
4.  Configurar la carga útil (Payload):
    - **Solo IDs ofuscados** para identificación (UUID).
    - Métricas contables (ej. `cantidadMedicamentos`).
    - Timing analítico (ms o s).
    - ❌ NUNCA incluir texto libre en inputs o keys con variables ambiguas.
5.  Ejemplo para uso en Componente UI (Si no existe un hook especializado):
    - `posthog.capture('nombre_del_evento', { propiedad: valor, propiedad_2: valor })`.

*Nota: Esta skill existe para asegurar que los nuevos features integren rastreo pero prevengan violaciones HIPAA-like.*
