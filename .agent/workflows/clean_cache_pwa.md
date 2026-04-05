---
description: Limpiar rastrojos del Service Worker o PWA cache que atasquen un nuevo bloque de desarrollo perdiendo los últimos deploys.
---

1. Alertar al usuario que esto solo es necesario si el HMR de Next.js (`pnpm run dev`) se niega a impactar los archivos en pantalla o si un deployment SW viejo se niega a soltarse a pesar del `Update on Reload`.
2. Remover el directorio de cache del `next-pwa` temporal si existe en Node_modules o builds.
// turbo
3. Run rm -rf .next/ public/sw.js public/workbox-*.js public/worker-*.js
4. Pedir al usuario que ejecute una purga manual estricta local en el navegador (Abrir DevTools -> Application -> Storage -> Clear Site Data). Esto mata al Service Worker zombie localmente.
5. Rehacer el Build de Dev para regenerar.
// turbo
6. Run pnpm run build && pnpm run dev
7. Confirmarle al usuario que el loop caché está destruido.