import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { googleMapsPlugin } from './vite-plugin-google-maps';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    googleMapsPlugin(process.env.VITE_GOOGLE_MAPS_API_KEY || ''),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.js',
      registerType: 'prompt',
      manifest: {
        name: 'iAircon',
        short_name: 'iAircon',
        description: 'Easy aircon servicing and maintenance booking',
        theme_color: '#121212',
        background_color: '#121212',
        display: 'standalone',
        icons: [
          {
            src: '/android-icon-36x36.png',
            sizes: '36x36',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/android-icon-48x48.png',
            sizes: '48x48',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/android-icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/android-icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/android-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        start_url: '/',
        orientation: 'portrait',
        categories: ['utilities', 'lifestyle'],
        shortcuts: [
          {
            name: 'Book Service',
            short_name: 'Book',
            description: 'Book an aircon service',
            url: '/booking',
            icons: [{ src: '/android-icon-96x96.png', sizes: '96x96' }]
          }
        ]
      },
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  server: {
    port: 5173,
    host: true
  },
  resolve: {
    alias: {
      '@admin': path.resolve(__dirname, './src/components/admin'),
      '@api': path.resolve(__dirname, './src/api'),
      '@auth': path.resolve(__dirname, './src/components/auth'),
      '@booking': path.resolve(__dirname, './src/components/booking'),
      '@common': path.resolve(__dirname, './src/components/common'),
      '@components': path.resolve(__dirname, './src/components'),
      '@config': path.resolve(__dirname, './src/config'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@data': path.resolve(__dirname, './src/data'),
      '@dev': path.resolve(__dirname, './src/components/dev'),
      '@error-boundary': path.resolve(__dirname, './src/components/error-boundary'),
      '@google': path.resolve(__dirname, './src/services/google'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@icons': path.resolve(__dirname, './src/components/icons'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@locations': path.resolve(__dirname, './src/services/locations'),
      '@modals': path.resolve(__dirname, './src/components/modals'),
      '@mocks': path.resolve(__dirname, './src/mocks'),
      '@notifications': path.resolve(__dirname, './src/components/notifications'),
      '@onemap': path.resolve(__dirname, './src/services/onemap'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@payment': path.resolve(__dirname, './src/components/payment'),
      '@profile': path.resolve(__dirname, './src/components/profile'),
      '@redux-types': path.resolve(__dirname, './src/store/types'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@server': path.resolve(__dirname, './src/server'),
      '@services': path.resolve(__dirname, './src/services'),
      '@slices': path.resolve(__dirname, './src/store/slices'),
      '@snapshots': path.resolve(__dirname, './src/snapshots'),
      '@store': path.resolve(__dirname, './src/store'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@teams': path.resolve(__dirname, './src/services/teams'),
      '@tech': path.resolve(__dirname, './src/components/tech'),
      '@test': path.resolve(__dirname, './src/components/test'),
      '@theme': path.resolve(__dirname, './src/theme'),
      '@types': path.resolve(__dirname, './src/types'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@validation': path.resolve(__dirname, './src/services/validation'),
      '@mockup': path.resolve(__dirname, './mockup')
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: [
            '@headlessui/react',
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
          ],
        },
      },
    },
  },
});
