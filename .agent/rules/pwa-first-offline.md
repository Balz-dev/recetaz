---
trigger: always_on
---

🔒 REGLA MAESTRA — PWA OFFLINE-FIRST (RECETAZ)
📌 Propósito

Garantizar que cualquier cambio de código mantenga a RecetaZ como una PWA 100% funcional sin conexión a internet, incluyendo rutas dinámicas, datos médicos y navegación completa.

🧠 PRINCIPIO FUNDAMENTAL (NO NEGOCIABLE)

RecetaZ es una aplicación OFFLINE-FIRST.
La red NUNCA es un requisito para navegar, ver pantallas o cargar datos médicos.

🧱 REGLAS OBLIGATORIAS PARA LA IA EDITORA
1️⃣ Navegación con Next/Link y CacheFirst

Toda navegación debe usar el componente estándar `Link` de `next/link` o `router.push`.
Para que esto funcione offline sin errores de RSC (Server Component Payload):

- Se DEBE mantener la estrategia `CacheFirst` para peticiones de navegación en el SW.
- Se DEBE usar el App Shell (index/dashboard) servido desde cache.
- ❌ PROHIBIDO: Usar `prefetch` en enlaces si la ruta depende de datos de red no cacheados (por defecto `Link` prefetch funciona bien con la configuración de cache actual).

2️⃣ Rutas dinámicas = Client Components obligatorios

Toda ruta con parámetros ([id], ?paciente=) debe:

Ser Client Component

Renderizar sin esperar datos

❌ Prohibido:

Server Components

getServerSideProps

generateStaticParams con fetch

3️⃣ IndexedDB es la única fuente de datos clínicos

Los datos de:

Pacientes

Medicamentos

Diagnósticos

Recetas
SIEMPRE se cargan desde IndexedDB (Dexie)

❌ Nunca usar fetch() para datos clínicos

❌ Nunca bloquear render esperando datos

4️⃣ Service Worker: Configuración Técnica Intocable

El archivo `next.config.js` DEBE mantener:

- `handler: 'CacheFirst'` para `request.mode === 'navigate'`.
- `navigateFallback: null` (para evitar errores de Workbox con URLs dinámicas no precacheadas).
- `disable: process.env.NODE_ENV === 'development'` (opcional, pero recomendado para estabilidad en build).

Regla técnica obligatoria:
`request.mode === "navigate" → CacheFirst` en el objeto de `runtimeCaching` para `pages`.

5️⃣ Prohibiciones absolutas

La IA NO DEBE introducir:

❌ fetch() en carga de páginas

❌ navigator.onLine para bloquear vistas

❌ NetworkFirst para navegación

❌ Páginas “offline fallback”

❌ Redirecciones por datos faltantes

❌ Dependencias externas críticas en runtime

6️⃣ Render siempre primero, datos después

Toda pantalla debe seguir este orden:

Render del layout

Skeleton / Empty state

Carga desde IndexedDB

Render de datos

❌ Nunca lanzar errores si no hay datos

7️⃣ Layouts y providers deben ser offline-safe

Layouts:

No deben hacer fetch

No deben validar red

Providers:

Deben inicializar IndexedDB antes de uso

Nunca depender de servidor

8️⃣ UX 100% Local (Invisibilidad de Conexión)

El usuario NO debe notar si la aplicación está conectada o no. Se busca una experiencia de "App nativa local".

- ❌ PROHIBIDO: Mostrar mensajes de "Offline", "En línea" o "Sin conexión".
- ❌ PROHIBIDO: Usar iconos de internet (Wifi/WifiOff) para indicar estado.
- ✅ PERMITIDO: Fallar silenciosamente en segundo plano si una sincronización (que no bloquee al usuario) no ocurre.

🧪 VALIDACIÓN OBLIGATORIA (AUTOCHECK DE IA)

Antes de entregar código, la IA debe verificar:

 La app abre en modo avión

 /pacientes/[id] abre sin red

 No hay fetch() en páginas

 Los datos vienen de IndexedDB

 El Service Worker tiene CacheFirst para navegación

 No existe fallback offline

Si alguna falla, la IA DEBE corregir el código antes de responder.

🏁 MENSAJE FINAL PARA LA IA

Si el código no funciona sin internet, es incorrecto.
Optimizar performance no es offline-first.
Offline-first es un requisito funcional, no una mejora opcional.

🎯 Resultado esperado

Con esta regla:

Ninguna IA rompe el offline

RecetaZ mantiene su promesa clave

Las rutas dinámicas dejan de fallar

Tu producto se vuelve difícil de replicar