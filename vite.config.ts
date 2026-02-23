import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/react_only_dashboard/', // Required for GitHub Pages project site
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'data/*.csv', 'data/*.json', 'data/years.json', 'annual-reports/*.pdf', 'assets/*.geojson'],
      manifest: {
        name: 'Vanuatu Courts Dashboard',
        short_name: 'Courts',
        description: 'Key workload, backlog, timeliness and gender metrics from Vanuatu Judiciary annual reports',
        theme_color: '#422AFB',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'favicon.png', sizes: '88x88', type: 'image/png', purpose: 'any' },
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        globIgnores: ['**/pwa-192.png', '**/pwa-512.png'], // Large icons fetched on demand for install
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /\/(data|assets)\/.*\.(csv|json|geojson)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'dashboard-data',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  publicDir: 'public',
})
