# Reglas de Seguridad y Buenas Prácticas para Recetas Médicas PWA

Dado el nivel crítico y regulado de la información manejada por el software (datos de salud, historiales clínicos, recetas, datos de pacientes e IP médicos), todo el código, funcionalidades o sugerencias generadas y aplicadas deberán cumplir estrictamente con los siguientes postulados. 

Esta regla se activa **siempre** que se realicen funciones que involucren persistir, enviar, o renderizar datos médicos o visuales al DOM.

## 1. Reglas Generales y Vulnerabilidades Cubiertas

### A. Prohibición de inyecciones DOM (XSS)
Debido a la manipulación del editor de plantillas y datos médicos, **nunca** bajo NINGUNA CIRCUNSTANCIA se debe permitir:
- Uso de `dangerouslySetInnerHTML` o derivados nativos como `innerHTML`. 
- Ejecutar cadenas obtenidas en tiempo de ejecución como scripts (`eval()`).
- Cualquier campo enriquecido configurado por el doctor o proveniente de Supabase debe renderizarse usando interpolación estándar de React (e.g. `{ variable }`) para sanitización automática o un parser validado (DOMPurify).

### B. Privacidad Local y Protección de la Capa PWA (IndexedDB)
RecetaZ es _offline-first_. Toda información vive en Dexie y está expuesta al cliente si se interactúa físicamente o vía malware.
- **Si agregas nuevas tablas en `db.config.ts`:** Asegúrate de no introducir campos excesivos que guarden material sensible (tales como diagnósticos crudos o RFC de tarjetas) si no son inminentemente necesarios para renderizado.
- Nunca persistas secretos ni credenciales en `localStorage`, usa `sessionStorage` para datos transitorios, y asegúrate de no registrar variables de entorno por consola.

### C. Restricción de Envío a Servicios Externos (Data Leaks)
- Nunca uses APIS como Google Analytics estándar u otros rastreadores para enviar contenido del médico que lo "des-anonimice". Todo rastreo va directo a las tablas permitidas (como Supabase o PostHog) que garantizan limitación en RLS, asegurando únicamente variables operacionales (nunca nombres ni descripciones en los Payload).
- Valida *Rate Limit* en las llamadas manuales. Supabase solo tiene una Anonymous Key pública; evita enviar eventos iterativos en ciclos profundos para evitar Denegaciones de Servicio (DoS).

## 2. Checklist de Validación antes de entregar un Pull Request o Feature
Antes de considerar "Terminada" la tarea, se debe confirmar internamente:

- [ ] ¿He introducido alguna evaluación JSON sin validación de parsing seguro (`try-catch`)?
- [ ] ¿Las cabeceras de Seguridad CSP, X-Frame-Options configuran barreras contra Iframes falsos (Next.config.js - NO REMOVERLOS)?
- [ ] ¿Los nuevos endpoints (si los hay) limitan los CORS y restringen métodos a `GET/POST` en caso de aplicar? 
- [ ] ¿Los campos almacenados en plantillas guardan solo variables numéricas/string para estilizar (`color: "#000"`) en lugar de strings de inyección de HTML?

## 3. Pruebas Automáticas Exigibles 
Toda característica crítica debe respaldarse con E2E:
Para ejecutar el escudero de vulnerabilidades, siempre corre tras finalizar un módulo de seguridad usando Playwright:
```bash
npx playwright test tests/e2e/security.spec.ts 
```
