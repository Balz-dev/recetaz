---
name: generar-prueba-unitaria
description: Genera una prueba unitaria robusta (AAA) para una función o componente específico sin requerir que el usuario lo solicite explícitamente en el prompt.
---

# Skill: TDD Auto-Generador de Pruebas

## Contexto
Este skill se ejecuta implícita o explícitamente después de crear una función de negocio, un algortimo complejo, o un hook personalizado (Si es hook de Dexie, hereda de `test-hook-dexie`). 

## Pasos de Ejecución

1. **Analizar la Firma de la Función/Componente:**
   - Detectar todos los argumentos y el tipo de retorno.
   - Detectar si tiene efectos secundarios (uso de Fetch, llamadas a Supabase, manipulación del LocalStorage, etc.).
2. **Definir la ubicación:**
   - La prueba debe crearse SIEMPRE junto al archivo original. Si el archivo es `operaciones.ts`, la prueba será `operaciones.test.ts`.
3. **Redactar Mocks Precisos:**
   - Interceptar cualquier dependencia externa asíncrona utilizando `vi.mock` (Vitest) o `jest.mock`.
4. **Armar Estructura AAA (Arrange, Act, Assert):**
   - **Arrange:** Crear los stubs correspondientes.
   - **Act:** Invocar la nueva función.
   - **Assert:** Añadir al menos 2 validaciones: 
      - Validación *"Happy Path"* (Condiciones ideales).
      - Validación *"Edge Case"* (Valores nulos, throw de errores).
5. **Guardar e instruir:**
   - Finalizar creando el archivo en disco e invitando al usuario a correr `pnpm test`.

> El agente usará automáticamente esta skill cada vez que se agregue o modifique fuertementa una lógica de negocio, proporcionándole el código de la prueba en la misma conversación.
