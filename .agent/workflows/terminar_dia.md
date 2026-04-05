---
description: Finalize the daily development session, update the logbook, and commit changes.
---

# 🏁 Workflow: Terminar sesión diaria de desarrollo

Este flujo de trabajo se ejecuta al finalizar la jornada de desarrollo diaria para resumir el progreso y preparar el repositorio para el día siguiente.

## Pasos del flujo:

1. **Recolección de Información Técnica:**
   - La IA identifica los cambios realizados hoy a través de los commits.
   - Lee `task.md` para extraer la lista de tareas completadas `[x]` y pendientes `[ ]`.

2. **Actualización de la Bitácora Histórica:**
   - Invocación de la skill `actualizar-bitacora` (.agent/skills/actualizar-bitacora/SKILL.md) para añadir el resumen al archivo `docs/BITACORA.md`.

3. **Compromiso de los Cambios (Commit):**
   - La IA prepara los archivos modificados.
   // turbo
   4. Run git add .
   5. Generar mensaje de commit técnico con el resumen acumulado (ej. `chore(daily-sync): cierre de jornada 2026-04-05 - [X] Tareas completadas`).
   // turbo
   6. Run git commit -m "[mensaje-generado]"

7. **Despedida y Resumen:**
   - Informar al usuario que la sesión ha sido cerrada correctamente.
   - Recordar que el `git push` debe ser **manual** por seguridad.

---
**Comando rápido:** `/terminar_dia`
