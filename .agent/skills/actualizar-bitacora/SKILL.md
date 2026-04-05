---
name: actualizar-bitacora
description: Skill especializada para automatizar el cierre técnico de la jornada. Recopila commits del día, tareas de task.md y actualiza docs/BITACORA.md.
---

# 📝 Skill: Actualizar Bitácora Técnica

Esta skill se encarga de generar un resumen estructurado del trabajo realizado durante el día para mantener un registro histórico preciso en `docs/BITACORA.md`.

## Acciones que realiza la IA:

1. **Recopilación de Evidencia Técnica:**
   - Ejecuta `git log --since="00:00:00" --oneline` para extraer los mensajes de commit del día.
   - Analiza el archivo `task.md` (o el log de tareas activo) para identificar estados:
     - ✅ **Completado:** Elementos marcados con `[x]`.
     - 🏗️ **En Progreso:** Elementos marcados con `[/]`.
     - ⏳ **Pendiente:** Elementos marcados con `[ ]`.

2. **Generación del Reporte:**
   - Crea un bloque de contenido con el siguiente formato:
     ```markdown
     ## 📅 [FECHA] - Cierre de Jornada
     
     ### 🛠️ Cambios Técnicos (Commits)
     - [Lista de commits del día]
     
     ### ✅ Tareas Finalizadas
     - [Tareas extraídas de task.md con [x]]
     
     ### 📋 Tareas Pendientes para Mañana
     - [Tareas extraídas de task.md con [ ] o [/]]
     
     ---
     ```

3. **Inyección en Bitácora:**
   - Añade el bloque al final de `docs/BITACORA.md`.

## Reglas de Uso:
- Debe invocarse preferentemente al final de una sesión de desarrollo o mediante el workflow `/terminar_dia`.
- El tono debe ser **técnico** y directo (enfocado en implementación, archivos modificados y lógica).
- Si no hay commits en el día, se debe informar al usuario pero permitir el cierre basado en las tareas manuales de `task.md`.

---
**Nota:** Esta skill es el motor del flujo de trabajo de cierre diario.
