# PWA Offline-First — RecetaZ

## Principio Fundamental (NO NEGOCIABLE)

RecetaZ es una aplicación **OFFLINE-FIRST**. La red NUNCA es requisito para navegar, ver pantallas o cargar datos médicos.

## Reglas Obligatorias

### 1. Navegación

- Toda navegación: `Link` de `next/link` o `router.push`
- Mantener estrategia `CacheFirst` para peticiones de navegación en el SW
- `navigateFallback: null` en next.config.js

### 2. Rutas dinámicas (`[id]`, `?param=`)

- SIEMPRE Client Components (`'use client'`)
- SIEMPRE renderizar sin esperar datos
- ❌ PROHIBIDO: Server Components, getServerSideProps, generateStaticParams con fetch

### 3. Datos clínicos

- SIEMPRE cargar desde IndexedDB (Dexie)
- ❌ NUNCA usar `fetch()` para datos clínicos
- ❌ NUNCA bloquear render esperando datos

### 4. Service Worker (next.config.js)

- `handler: 'CacheFirst'` para `request.mode === 'navigate'`
- `navigateFallback: null`
- NO modificar sin validar offline

### 5. Orden de render obligatorio

1. Render del layout
2. Skeleton / Empty state
3. Carga desde IndexedDB
4. Render de datos

### 6. UX Local (Invisibilidad de conexión)

- ❌ PROHIBIDO: mensajes de "Offline", "En línea" o "Sin conexión"
- ❌ PROHIBIDO: iconos de Wifi/WifiOff
- ✅ PERMITIDO: fallar silenciosamente en sync de segundo plano

## Prohibiciones Absolutas

- ❌ `fetch()` en carga de páginas
- ❌ `navigator.onLine` para bloquear vistas
- ❌ `NetworkFirst` para navegación
- ❌ Páginas "offline fallback"
- ❌ Redirecciones por datos faltantes
- ❌ Dependencias externas críticas en runtime
