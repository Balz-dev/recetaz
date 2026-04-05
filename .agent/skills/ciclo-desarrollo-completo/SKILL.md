---
name: ciclo-desarrollo-completo
description: Orquestador maestro para el Agente. Encamina la creación de una feature delegando en sub-skills (DB, UI, Testing, Logs) automáticamente sin intervención del usuario.
---

# 🚂 Orquestador de Ciclo de Desarrollo Completo

Esta es una **Macro-Skill**. Cuando el usuario te pide una función de extremo a extremo (ej. "Construye el módulo de Pacientes"), tú DEBES asumir el control total. No le pidas permiso para cada micro-paso. El usuario espera que tú, en un solo turno (o iterando autónomamente con tus herramientas), desencadenes todas las sub-tareas necesarias respetando siempre la base del proyecto.

## Secuencia Autónoma Estricta:

Siempre que actives este orquestador, sigue estos pasos secuencialmente en tu plan de ejecución (`task.md` u organización interna):

### 1. Bitácora Inicial (Planning)
- Antes de escribir código fuente, siembra las intenciones en un archivo de bitácora (ej. `task.md` / `walkthrough.md` provisto por tu entorno).

### 2. Capa Estructural (Invocación Interna: `nueva-feature`)
- Crea el scaffolding de `src/features/[nombre-del-modulo]` bajo el estándar de Feature-Sliced Design.

### 3. Capa de Datos y Modelos (Invocación Interna: `nueva-tabla-dexie`)
- Evalúa si el módulo requiere persistir datos. Si es así, crea el Schema para Dexie, actualiza el core en `db.config.ts`, y genera las interfaces de TypeScript de inmediato.

### 4. Capa UI y Lógica (Invocación Interna: `nuevo-formulario-zod`)
- Implementa componentes visuales reutilizables adhiriéndote estrictamente a **Shadcn** (`cva`, `twMerge`).
- Crea los `Custom Hooks` de negocio, asegurando aislar los efectos secundarios (Side Effects) con try/catch como en `10-manejo-errores.md`.

### 5. Control de Calidad Obligatorio (Invocación Interna: `generar-prueba-unitaria`)
- PROHIBIDO PASAR AL SIGUIENTE PASO SIN ESTO. Por cada Hook complejo de negocio creado, DEBES instanciar la `generar-prueba-unitaria` utilizando Vitest y patrones AAA (Arrange, Act, Assert).

### 6. Documentación Final y Cierre
- Revisa el archivo `docs/ARQUITECTURA.md` o el README general, agregando una línea con tu recién creado feature.
- Actualiza la bitácora (`[x] Completado`) para avisarle al usuario que todo el flujo terminó.

---
**Nota para la IA:** Un programador Senior no pregunta después de cada archivo creado. Tú planificas, ejecutas el ciclo completo que incluye pruebas, base de datos y UI front-to-back, y luego informas la victoria.
