# Seguridad — Datos Médicos y PWA

RecetaZ maneja datos de salud regulados. Toda modificación DEBE cumplir estas reglas.

## Inyecciones DOM (XSS)

- ❌ PROHIBIDO: `dangerouslySetInnerHTML`, `innerHTML`, `eval()`
- ✅ SIEMPRE: interpolación React `{variable}` para sanitización automática
- ✅ SIEMPRE: DOMPurify para contenido enriquecido externo
- Campos de plantillas: solo valores numéricos/string para estilos (ej: `color: "#000"`)

## Privacidad Local (IndexedDB)

- No introducir campos excesivos con material sensible (diagnósticos crudos, RFC) si no son necesarios para render
- ❌ NUNCA persistir secretos ni credenciales en `localStorage`
- Usar `sessionStorage` para datos transitorios
- ❌ NUNCA registrar variables de entorno por consola

## Envío a Servicios Externos

- ❌ NUNCA enviar datos que identifiquen al médico (nombres, descripciones en payloads)
- Rastreo SOLO a Supabase/PostHog con RLS habilitado
- Rate limiting client-side obligatorio (evitar DoS)
- ❌ NUNCA enviar eventos iterativos en ciclos profundos

## Headers de Seguridad

- Mantener CSP, X-Frame-Options en `next.config.js` — NO REMOVER
- Nuevos endpoints: limitar CORS y métodos a `GET/POST`

## Checklist Pre-Entrega

- [ ] ¿Hay `try-catch` en todo parsing JSON?
- [ ] ¿Se mantienen los headers CSP?
- [ ] ¿Los campos de plantillas NO contienen strings de inyección HTML?
- [ ] ¿Nuevos endpoints tienen CORS restringido?
