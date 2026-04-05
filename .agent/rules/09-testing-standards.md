# Estándares de Testing Unitario

El objetivo central del testing no solo es cubrir el código, sino modelar contratos resistentes para refactorizaciones futuras.

## 1. Patrón AAA (Arrange - Act - Assert)
Cada bloque `it` o `test` DEBE estar separado en estas 3 secciones visuales o lógicas:
1. **Arrange:** Configurar el contexto, armar variables y definir mocks de `Dexie` o dependencias (Servicios).
2. **Act:** Ejecutar literalmente la función del dominio o renderizar el Hook.
3. **Assert:** Verificar con `expect` que el estado mutó, los valores resultantes y los mocks fueron llamados.

## 2. Mocks de IndexedDB / Dexie.js
- Prohibido hacer Test Integrado usando persistencias de disco o IDBs inyectados en JSDom reales para *tests unitarios*. 
- Inyectar o Mockear la fachada del Service. 
- Al testear el Service directamente, simular los métodos de Dexie.js (`where`, `toArray`, `put`) resolviendo promesas sincrónicas usando `vi.mock()` o el mock builder correspondiente en Jest/Vitest.

## 3. Testing de Hooks (`renderHook`)
- Usar las herramientas asíncronas (`waitFor`, `act`) adecuadamente. Todo cambio de estado forzado tras un renderizado debe envolverse en `act()`.
- Validar siempre los estados de borde: Carga Inicial (`isLoading: true`), Caso de Éxito (`data`), y Error Catch (`isError: true`).

## 4. Cobertura Implícita Obligatoria (Regla para Agentes)
- **Tolerancia Cero a las Cajas Negras:** Cada vez que el Agente IA escriba una nueva función utilitaria, un bloque complejo de lógica o un Hook para el usuario, el sistema **DEBE** proponer o proveer su código de prueba usando la directiva de la skill `generar-prueba-unitaria`.
- El test debe ser entregado en la misma respuesta o el siguiente paso inmediato, sin que el usuario tenga que "mendigar" o pedir la cobertura manualmente.

## 5. Prohibiciones
- ❌ Cadenas `expect(true).toBeTruthy()` perezosas para cubrir bloques.
- ❌ Hacer tests que pasen independientemente del estado del software (Silenciamientos erróneos).
- ❌ Componentes y tests UI fuertemente acoplados por selectores DOM crudos. Use `data-testid` o `getByRole` priorizando la experiencia accesible del usuario.
