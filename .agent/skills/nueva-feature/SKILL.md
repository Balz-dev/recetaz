---
name: nueva-feature
description: Crea el andamiaje estandarizado de una nueva funcionalidad siguiendo la arquitectura Feature-Sliced Design.
---

# Skill: Crear Nueva Feature (Feature-Sliced Design)

## Contexto
El proyecto RecetaZ utiliza la arquitectura Feature-Sliced Design. Cada bloque principal de negocio debe vivir de manera autónoma dentro de `src/features/`. 

## Pasos de Ejecución

1.  **Validar nombre**: El nombre de la feature debe estar en kebab-case y en español (ej: `exportacion-pdf`).
2.  **Crear directorios**:
    - `src/features/<nombre>/components/`
    - `src/features/<nombre>/services/`
    - `src/features/<nombre>/hooks/`
    - `src/features/<nombre>/types/`
3.  **Crear archivos base**:
    - **Service**: `<nombre>.service.ts` -> Lógica de negocio (con exportaciones orientadas a interfaz). Si requiere BD, inyectar/usar `db.config.ts`.
    - **Hook**: `use<Nombre>.ts` -> Hook de orquestación que exponga el API al componente React y controle loading/error. Exportar un hook `use<Nombre>` principal.
    - **Type**: `index.ts` -> Interfaces a utilizar por la feature.
    - **Componentes**: Crea un componente UI principal (ej. `<Nombre>Main.tsx`) en la carpeta `components/` si se solicita UI.
4.  **Generar `index.ts` principal**:
    - En `src/features/<nombre>/index.ts`, exporta explícitamente solo lo que la aplicación necesite consumir.
    - **No** exportes los componentes o servicios internos que son privados para la feature.
5.  **Verificación**: Construye/compila usando `npx tsc --noEmit`. Comprueba que las reglas de inyección dependan solo de imports autorizados o de `src/shared/`.
