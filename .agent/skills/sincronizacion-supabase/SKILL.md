---
name: sincronizacion-supabase
description: Orquesta algoritmos de sincronización bidireccional asíncrona entre entidades Dexie.js (Locales) a la nube (Supabase) manejando concurrencia y modo offline.
---

# Skill: Motor de Sincronización a Supabase

## Contexto
RecetaZ es Offline-first. Todo acceso en la vista debe golpear a `Dexie.js`. Supabase se mantiene detrás mediante una capa transparente de "Background Sync".

## Pasos para crear un Hook de Sincronización:

1. **Definir el Vector de Conflicto**
   - Asegúrate de que la entidad en Dexie y en Supabase posean una columna `updated_at` y `synced_at` para resolución temporal de conflictos. `synced_at` en null significa que el registro local espera subir a la nube.
2. **Generar Archivo de Servicio de Sincronización**
   - Debe ubicarse en `src/features/<feature>/services/<nombre>Sync.service.ts`.
   - Dependencias de inyección: El servicio local de Dexie que accederás y `supabaseClient`.
3. **Flujo de Algoritmo de Sincronización Push (Subida)**
   - Consultar en Dexie `.filter(r => r.synced_at === null || isNew)`.
   - Iterar el Payload en baches (Chunks) y hacer `UPSERT` en Supabase usando `onConflict`.
   - Si finaliza con éxito de Supabase, en la cláusula de respuesta, actualizar los registros reaccionando en Dexie marcando `synced_at` al Timestamp actual.
4. **Flujo Pull (Bajada)**
   - Peticionar a Supabase registros donde el `updated_at` de la nube sea superior a la marca de agua del último guardado de Dexie.
   - Insertar / Actualizar con la función `.bulkPut` de Dexie de manera atómica para evitar renders en masa en React.
5. **Controlador de Errores**
   - Capturar y silenciar `AbortError` o `NetworkError` sin arrojar "Alerts" u obstaculizar la UI.
   - Todo flujo sync es opcional para el cliente y debe fallar de manera suave en Background.
