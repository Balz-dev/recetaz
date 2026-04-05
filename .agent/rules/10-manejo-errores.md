---
description: Estándares de resiliencia y manejo de errores para evitar pantallas blancas.
---

# Manejo de Errores y Error Boundaries

La arquitectura de RecetaZ exige que los errores nunca dejen al usuario en una "pantalla blanca" (estado inmanejable). Sigue estrictamente estas directrices:

## 1. Error Boundaries (Límites de Error)
- **Aislamiento de Features:** Cada ruta o módulo grande (Feature-Sliced Design) DEBE estar encapsulado en un `ErrorBoundary`. 
- **Fallback UI:** Al capturar un fallo de renderizado, mostrar siempre una interfaz de recuperación amable (Fallback UI) que ofrezca la opción de recargar el componente o volver al inicio.

## 2. Errores Asíncronos (Hooks y Servicios)
- **Captura Temprana:** Todo código asíncrono (llamadas a `Dexie` o APIs externas) debe estar contenido en bloques `try/catch`.
- **UI Feedback:** En caso de fallo en una mutación o lectura importante, informa al usuario inmediatamente mediante Toasts o Alertas sutiles (ej: `<sonner>`), nunca falles silenciosamente a menos que sea un "background sync" no crítico.

## 3. Fallo Seguro en IndexedDB (Fail-Safe)
- Si una query estructurada de Dexie falla, el servicio *siempre* debe poder retornar un estado vacío por defecto (ej: `[]`, `null`) en lugar de arrojar excepciones no controladas hacia los Hooks de React, asegurando que la UI pueda renderizar sus estados "Vacío" (`empty state`).

## 4. Formularios y Entradas
- Rechaza los validadores "ad-hoc". TODO formulario complejo debe validarse con `Zod` acoplado a `React Hook Form`. Los errores de esquema de Zod deben inyectarse directamente en el estado de error de la UI para mantener el foco en accesibilidad (aria-invalid).
