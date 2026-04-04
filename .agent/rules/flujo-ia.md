# Regla de Flujo de Trabajo Automatizado e Incremental

Esta regla define el comportamiento de la IA durante el ciclo de vida de desarrollo en RecetaZ.

## 1. Inicio: Gestión de Ramas
- Al detectar una nueva solicitud de funcionalidad o cambio significativo (especialmente al activarse el modo de planeación), la IA debe determinar un nombre de rama descriptivo siguiendo la convención de `git-command.md`.
- **Acción**: Crear la rama automáticamente (`git checkout -b [tipo]/[nombre]`) antes de realizar cambios si no se está ya en una rama de trabajo.
- Siempre preguntar o informar sobre la rama creada.

## 2. Desarrollo: Commits Incrementales
- Por cada tarea del `task.md` finalizada o bloque lógico de código implementado:
  - La IA debe validar los cambios (ej: `npx tsc --noEmit` o tests específicos).
  - Si la validación es exitosa, debe realizar un commit semántico en español.
  - Formato: `<tipo>(<alcance>): <descripción breve en presente>` (ej: `feat(app): implementar limpieza de bd demo`).
- No acumular demasiados cambios en un solo commit; preferir granularidad.

## 3. Cierre: Propuesta de Integración
- Al completar todas las tareas del plan:
  - Notificar al usuario que la funcionalidad está terminada.
  - Sugerir los comandos para integrar la rama de trabajo en la rama de integración correspondiente:
    - `dev-app` para funcionalidades de producto.
    - `dev-landing` para marketing.
    - `dev` para integraciones globales.
  - Proporcionar la plantilla de Pull Request (PR) completa con el resumen de cambios realizados.

## 4. Idioma
- Toda la comunicación, nombres de ramas, mensajes de commit y documentación de PR deben ser **100% en español**.
