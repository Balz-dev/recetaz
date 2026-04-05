# Índice de Documentación de RecetaZ

Este directorio y sus subdirectorios contienen la documentación oficial del proyecto RecetaZ. Para evitar la sobrecarga cognitiva y prevenir que los agentes IA se confundan, la documentación está estructurada por **audiencia**.

## 🏗️ 1. Arquitectura & Reglas Fundamentales (Para Agentes y Desarrolladores Clave)
- `ARQUITECTURA.md`: Documento vivo detallado sobre Feature-Sliced Design, convenciones y patrones del proyecto.

> Estas reglas (junto a la configuración inyectada en `.agent/`) dictan cómo la aplicación DEBE construirse de manera estructurada.

## 📖 2. Guías (Para Implementadores e IA Consultando Tareas)
Documentación consolidada sobre los dominios más complejos del proyecto. Localizada en `docs/guias/`:
- `GUIA_GIT_COMPLETA.md`: Todo el flujo de versionamiento, CI, integración y despliegue del proyecto.
- `GUIA_OFFLINE_PWA.md`: Las directrices, filosofía y tests para garantizar la Offline-Firstness y sincronía con Supabase.
- `GUIA_METRICAS.md`: Diccionario de los eventos soportados y guías para inyectar analíticas con PostHog local.

## 📦 3. Producto (Para PMs, Directores y Visión)
Localizada en `docs/producto/`:
- `PROYECTO_RECETAS_MEDICAS.md`: Resumen ejecutivo del producto y funcionalidades.
- `PLAN_PLANTILLAS_RECETAS.md`: Especificaciones para el motor de plantillas Canva-style de la app.

## 🧑‍⚕️ 4. Usuario Final (Soporte, Ventas, Usuarios Médicos)
Localizada en `docs/usuario/`:
- `MANUAL_USUARIO.md`: Manual instructivo de cómo usar la plataforma, on-boarding, manejo offline.

## 📜 5. Historial (Para Análisis Post-Mortem y Auditoría)
Documentos de planes viejos y tareas obsoletas pero guardadas para referencia histórica. Localizados en `docs/historial/`:
- `RESUMEN_REFACTORIZACION.md`: Antigua consolidación y refactor general.
- `REFACTOR_MONOREPO.md`: Decisiones sobre el modelo Monorepo inicial.
- `PLAN_IMPLEMENTACION_RECETAS.md`: Archivo maestro del paso-a-paso de la feature de recetas médicas, superado.
- `PRUEBAS_RECETAS.md`: Reglas antiguas.
- `REGLAS_SEGURIDAD.md`: Especificaciones del cifrado previo (ahora abstraído al ruleset).

---
> **Para Agentes IA:** Cuando leas documentación para la programación del día a día, NUNCA cargues los documentos de `historial/` a menos que sea estrictamente solicitado por el usuario para recuperar contexto.
