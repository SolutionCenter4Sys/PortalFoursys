import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Foursys Portal Institucional',
        short_name: 'Foursys Portal',
        description: 'Portal institucional navegável da Foursys',
        theme_color: '#060B14',
        background_color: '#060B14',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Portal cresceu com upstream (Portfolio + benchmarkPraiaForte, ~2MB+).
        // Default do Workbox é 2 MiB — subimos p/ 5 MiB para caber o bundle
        // principal no precache do SW. Se o bundle passar de 5MB, code-split.
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallbackDenylist: [/^\/api\//, /^\/embed/, /^\/_next/, /^\/vad\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 4001,
    strictPort: true,
    open: true,
    proxy: {
      // Jarvis na mesma origem do Portal → iframe /embed sem block de X-Frame
      '/api': {
        target: process.env.JARVIS_BACKEND_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
      '/embed': {
        target: process.env.JARVIS_BACKEND_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
      // Silero VAD (ONNX/WASM) — embed pede /vad/* na origem do Portal
      '/vad': {
        target: process.env.JARVIS_BACKEND_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
      '/_next': {
        target: process.env.JARVIS_BACKEND_URL || 'http://localhost:3000',
        changeOrigin: true,
        // HMR: cliente fecha socket no reload → ECONNABORTED ruidoso, ignora
        ws: true,
        configure: (proxy) => {
          proxy.on('error', () => {
            /* noop — socket abort comum no restart do Next */
          })
        },
      },
    },
  },
})
