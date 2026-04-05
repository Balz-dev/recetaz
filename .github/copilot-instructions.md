# Instrucciones para Copilot y Agentes de IA — RecetaZ

Este repositorio utiliza el framework **Feature-Sliced Design** y está configurado agresivamente para operaciones **Offline-First** (PWA con Dexie.js).

## Punto de Referencia Crítico
El sistema inyecta automáticamente el contexto necesario en cada conversación. Sin embargo, para entender profundamente las decisiones del proyecto, debes consultar el manifiesto central:

👉 `docs/README.md` (Índice de Documentación y Guías)

## Reglas Básicas Inmutables
1. **Idioma**: TODO debe ser en español. Variables bilingües solo cuando resulte forzado evitarlo.
2. **Modificación de Código**: NUNCA rompas el flujo *Componente → Hook (useFeature) → Service → IndexedDB (Dexie)*. Nunca invoques Dexie directo desde React.
3. **PWA Offline**: PROHIBIDO usar `fetch()` para obtener datos requeridos para renderizar componentes.
4. **Git**: Revisa la guía en `docs/guias/GUIA_GIT_COMPLETA.md`.

## Skills y Workflow
Puedes instanciar *skills* específicos del entorno:
- `/start_feature` y `/merge_feature` automatizan el ciclo de vida de tu rama local.
- Para crear arquitecturas robustas de nuevas implementaciones, revisa `nueva-feature` y `nueva-tabla-dexie` en `.agent/skills/`.

## Comandos Técnicos
- **Desarrollo**: `pnpm run dev`
- **Tipos**: `pnpm exec tsc --noEmit` (CORRER SIEMPRE ANTES DE UN COMMIT)
- **Construcción**: `pnpm run build`
