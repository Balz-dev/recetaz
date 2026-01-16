const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Fallback para navegación offline - sirve el app shell
  navigateFallback: '/dashboard',
  navigateFallbackDenylist: [/^\/api/, /^\/_next\/data/],
  // Permitir todas las rutas de la app
  navigateFallbackAllowlist: [/^\/(?!api|_next\/data).*/],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 año
        },
      },
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-font-assets',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 año
        },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-image-assets',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 90 * 24 * 60 * 60, // 90 días
        },
      },
    },
    {
      urlPattern: /\/_next\/image\?url=.+$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'next-image',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 90 * 24 * 60 * 60, // 90 días
        },
      },
    },
    {
      urlPattern: /\.(?:mp3|wav|m4a)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-audio-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 año
        },
      },
    },
    {
      urlPattern: /\.(?:js)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-js-assets',
        expiration: {
          maxEntries: 48,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 año (hash garantiza actualización)
        },
      },
    },
    {
      urlPattern: /\.(?:css|less)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-style-assets',
        expiration: {
          maxEntries: 48,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 año (hash garantiza actualización)
        },
      },
    },
    {
      urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'next-data',
        expiration: {
          maxEntries: 48,
          maxAgeSeconds: 90 * 24 * 60 * 60, // 90 días
        },
      },
    },
    {
      urlPattern: /\.(?:json|xml|csv)$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'static-data-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 90 * 24 * 60 * 60, // 90 días
        },
      },
    },
    {
      urlPattern: ({ url }) => {
        const isSameOrigin = self.origin === url.origin
        return !isSameOrigin
      },
      handler: 'NetworkFirst',
      options: {
        cacheName: 'cross-origin',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 90 * 24 * 60 * 60, // 90 días
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: ({ url }) => url.pathname.startsWith('/'),
      handler: 'CacheFirst',
      options: {
        cacheName: 'pages',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 90 * 24 * 60 * 60, // 90 días (3 meses)
        },
      },
    }
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {}, // Silenciar advertencia de Next.js 16
};

module.exports = withPWA(nextConfig);
