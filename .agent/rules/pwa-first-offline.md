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
1️⃣ Navegación SIEMPRE offline-safe

Toda navegación (/, /dashboard, /pacientes/[id], etc.) debe:

Funcionar sin internet

Servirse desde cache (app shell)

❌ Nunca depender de red para abrir una ruta

❌ Nunca mostrar pantallas de “sin conexión”

2️⃣ Rutas dinámicas = Client Components

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

4️⃣ Service Worker: App Shell obligatorio

El Service Worker debe:

Cachear index.html

Servir todas las rutas de navegación con CacheFirst

Ignorar el estado de red para navegación

Regla técnica obligatoria:

request.mode === "navigate" → CacheFirst

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

8️⃣ UX offline correcta (producto médico)

El usuario NO debe notar diferencia offline/online

Permitido:

Indicador discreto “Trabajando sin conexión”

Prohibido:

Alertas de error por red

Bloqueos funcionales

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