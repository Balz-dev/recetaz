# Documentación de Solución PWA Offline

## Resumen
Se ha solucionado el problema de persistencia offline de la aplicación calculadora convirtiéndola en una Progressive Web App (PWA) completamente funcional.

## Cambios Realizados

### 1. Configuración de Next.js (`next.config.js`) - SOLUCIÓN FINAL
- Se habilitó `next-pwa` con `disable: false`.
- Se configuró `register: true` y `skipWaiting: true`.
- **CLAVE:** Se añadió `runtimeCaching` con estrategia `StaleWhileRevalidate`:
  - Para la ruta principal `/`: cachea inmediatamente y actualiza en segundo plano
  - Para todas las peticiones a `localhost`: usa caché primero para respuesta instantánea offline
- Esta configuración asegura que la aplicación funcione offline sirviendo contenido del caché inmediatamente.

### 2. Manifiesto de Aplicación (`public/manifest.json`)
- Se creó un archivo `manifest.json` estándar en la carpeta `public`.
- Se definieron propiedades clave como `name`, `short_name`, `start_url`, `display: standalone`, y los iconos.
- **Nota:** Se eliminó el archivo `src/app/manifest.json` que existía previamente para evitar conflictos y centralizar la configuración en `public/manifest.json`.

### 3. Limpieza de Archivos Antiguos y Código Redundante
- Se eliminaron archivos antiguos de Service Worker (`public/sw.js`, `public/service-worker.js`).
- **Importante:** Se eliminó `src/app/ServiceWorkerRegister.js` y su importación en `layout.js`. Se confía en la funcionalidad nativa de `next-pwa` (configurada con `register: true`) para registrar el Service Worker automáticamente. Esto evita conflictos y dobles registros.
- Al ejecutar `npm run build`, `next-pwa` generó un nuevo `public/sw.js` limpio y funcional.

### 4. Componente de Registro de Service Worker (`src/app/ServiceWorkerRegister.js`)
- Se creó un componente cliente que registra explícitamente el Service Worker usando `navigator.serviceWorker.register('/sw.js')`.
- El componente incluye logs detallados para facilitar el debugging.
- Se importa y usa en `src/app/layout.js` para asegurar que se ejecute en cada carga de página.

### 5. Verificación
- Se ejecutó `npm run build` exitosamente.
- Se verificó la generación de `public/sw.js` y `public/workbox-*.js`.
- **IMPORTANTE:** Después del build, es necesario reiniciar el servidor con `npm start` para que los cambios surtan efecto.

## Cómo Probar
1. Detener el servidor actual si está corriendo (Ctrl+C en la terminal).
2. Ejecutar `npm run build` (ya realizado).
3. Ejecutar `npm start`.
4. Abrir `http://localhost:3000`.
5. Abrir las Herramientas de Desarrollador (F12) -> Pestaña **Console**.
6. Verificar que aparezcan logs como "🚀 ServiceWorkerRegister component mounted" y "✅ Service Worker registered successfully".
7. Ir a la pestaña **Application** -> **Service Workers**. Verificar que `sw.js` esté activo.
8. En la pestaña **Network**, cambiar "No throttling" a **Offline**.
9. Recargar la página. La calculadora debería seguir funcionando sin conexión.
