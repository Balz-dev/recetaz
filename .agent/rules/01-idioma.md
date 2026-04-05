# Idioma y Documentación de Código

Toda la comunicación, código, documentación y artefactos generados deben estar **100% en español**.

## Reglas de Documentación

- **JSDoc/TSDoc obligatorio** en: funciones, componentes, hooks, services, tipos complejos
- Incluir: `@param`, `@returns`, `@throws` (cuando aplique)
- Descripción clara del propósito en español

## Componentes React

- Una sola responsabilidad por componente
- Nombres descriptivos en español o bilingüe cuando el término técnico lo requiera
- Tipados con TypeScript estricto (`any` PROHIBIDO)
- Bloque JSDoc antes de cada componente exportado

## Hooks Personalizados

- Prefijo `use` obligatorio
- Documentar estado interno y efectos secundarios
- Retornar objetos tipados

## TypeScript Estricto

- Prohibido `any` — usar tipos explícitos o `unknown`
- Separar lógica de presentación
- No duplicar código (DRY)
- Funciones pequeñas y enfocadas
- Manejo explícito de errores con `try/catch`
- Uso correcto de `async/await`

## Comentarios

- Solo cuando la lógica no sea obvia
- Nunca comentar lo evidente
- Siempre en español
