---
name: nueva-tabla-dexie
description: Agrega una nueva tabla IndexedDB de manera segura en Dexie, aplicando actualizaciones de esquema y tipos TS.
---

# Skill: Agregar Tabla en Dexie

## Contexto
RecetaZ es Offline-First. Toda la data vive en IndexedDB vía `Dexie.js` en `src/shared/db/db.config.ts`. Añadir una tabla implica actualizar el esquema, los tipos, y cuidar la retrocompatibilidad, de manera local.

## Reglas Obligatorias antes de ejecutar

1. ❌ NUNCA sobrescribir ni modificar las versiones previas de Dexie. Siempre incrementar la versión.
2. ❌ NUNCA inyectar Sync explícito en IndexedDB en el nivel Dexie. (La sincronización con Supabase se coordina a nivel hook).

## Pasos de Ejecución

1.  **Definir Entidad y Propiedades**: Preguntar al usuario los campos, su tipo y cuál será la Llave Primaria (usualmente `id`). Confirmar los índices secundarios (campos de búsqueda o listado frecuente).
2.  **Actualizar Tipos**: 
    - Crea/modifica la interface TypeScript de la entidad, con campos requeridos y opcionales. El tipo debe agregarse junto o cerca a las exportaciones en `src/shared/db/db.config.ts` u otro archivo de interfaces y debe exportarse.
3.  **Actualizar el Esquema de Dexie**:
    - Abre `src/shared/db/db.config.ts`.
    - Ubica el incremento de versión de `.stores()`. Ejemplo: Si la última es `db.version(2).stores({...})`, debes agregar `.version(3).stores({...})` que incluya las tablas anteriores MÁS la nueva tabla.
    - Formato de store: `[nombreTabla]: '[clavePrimaria], indice1, indice2'`. Si no necesitas indexar un campo localmente, no lo incluyas en la cadena de índices (ahorra espacio).
    - Agrega fuertemente el tipo a la declaración de la clase usando `Table`: `[nombreTabla]!: Table<Entidad, tipoClavePrimaria>;`.
4.  **Añadir semilla/setup mock (opcional)**: Si el usuario lo requiere, agrega validación a un hook global (ej. inicializador vacío en `populate`).
5.  **Confirmar Compilación**: Ejecuta `npx tsc --noEmit` para asegurar que el modelo de Tipos cuadre.
