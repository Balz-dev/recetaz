---
description: Reglas de rendimiento en React y experiencia de usuario fluida.
---

# Optimización React y Rendimiento

Debido al volumen potencial de datos médicos almacenados en el navegador (PWA offline), el cliente tiene la total responsabilidad sobre el rendimiento. Sigue estas reglas obligatorias para evitar cuellos de botella:

## 1. Virtualización de Listas
- **Prohibición de Renderizado Masivo:** Para cualquier lista, directorio, tabla o grid que previsiblemente contenga más de 50 elementos simulados (ej: Pacientes, Vademécum, Códigos CIE-10), DEBES usar virtualización (por ejemplo, implementando `@tanstack/react-virtual` o `react-window`).

## 2. Memorización Selectiva
- Usar `useMemo` EXCLUSIVAMENTE para:
  1. Cálculos de arrays densos (búsquedas, filtros complejos sobre miles de registros médicos).
  2. Variables inyectadas en dependencias para efectos complejos.
- Usar `useCallback` principalmente si pasas la función hacia un componente hijo que está optimizado con `React.memo`, para prevenir re-renderizados forzados.
- NO sobre-memorices primitivos o funciones ligeras que React puede manejar raídamente; la memorización también tiene costo.

## 3. Consultas a Dexie (Paginación local)
- Los Hooks que conectan a la DB Local no deben cargar TODO el repositorio a menos que sea estrictamente necesario y pequeño. Usa `limit()` y `offset()` provistos por Dexie en colecciones grandes, impulsando una técnica de "Cargar Más" o "Scroll Infinito".

## 4. Code Splitting / Lazy Loading
- Agiliza la carga inicial de la aplicación importando con `React.lazy()` elementos pesados, modales colosales complejos o el motor de visor PDF que se carga bajo demanda.

## 5. Prevención de Throttling
- Si incluyes cuadros de "Búsqueda en vivo", adjúntales siempre un mecanismo lógico de `Debounce` o `Throttle` (usualmente 300-500ms) antes de golpear el indexado de Dexie.
