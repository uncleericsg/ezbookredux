/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { googleMapsPlugin } from './vite-plugin-google-maps';
import dts from 'vite-plugin-dts';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    resolve: {
      alias: [
        // Root alias
        {
          find: '@',
          replacement: path.resolve(__dirname, './src')
        },
        // Component aliases
        {
          find: '@admin',
          replacement: path.resolve(__dirname, './src/components/admin')
        },
        {
          find: '@auth',
          replacement: path.resolve(__dirname, './src/components/auth')
        },
        {
          find: '@booking',
          replacement: path.resolve(__dirname, './src/components/booking')
        },
        {
          find: '@common',
          replacement: path.resolve(__dirname, './src/components/common')
        },
        {
          find: '@components',
          replacement: path.resolve(__dirname, './src/components')
        },
        {
          find: '@dev',
          replacement: path.resolve(__dirname, './src/components/dev')
        },
        {
          find: '@error-boundary',
          replacement: path.resolve(__dirname, './src/components/error-boundary')
        },
        {
          find: '@icons',
          replacement: path.resolve(__dirname, './src/components/icons')
        },
        {
          find: '@modals',
          replacement: path.resolve(__dirname, './src/components/modals')
        },
        {
          find: '@notifications',
          replacement: path.resolve(__dirname, './src/components/notifications')
        },
        {
          find: '@payment',
          replacement: path.resolve(__dirname, './src/components/payment')
        },
        {
          find: '@profile',
          replacement: path.resolve(__dirname, './src/components/profile')
        },
        {
          find: '@tech',
          replacement: path.resolve(__dirname, './src/components/tech')
        },
        {
          find: '@test',
          replacement: path.resolve(__dirname, './src/components/test')
        },
        {
          find: '@ui',
          replacement: path.resolve(__dirname, './src/components/ui')
        },
        // Service aliases
        {
          find: '@api',
          replacement: path.resolve(__dirname, './src/api')
        },
        {
          find: '@config',
          replacement: path.resolve(__dirname, './src/config')
        },
        {
          find: '@constants',
          replacement: path.resolve(__dirname, './src/constants')
        },
        {
          find: '@data',
          replacement: path.resolve(__dirname, './src/data')
        },
        {
          find: '@google',
          replacement: path.resolve(__dirname, './src/services/google')
        },
        {
          find: '@hooks',
          replacement: path.resolve(__dirname, './src/hooks')
        },
        {
          find: '@lib',
          replacement: path.resolve(__dirname, './src/lib')
        },
        {
          find: '@locations',
          replacement: path.resolve(__dirname, './src/services/locations')
        },
        {
          find: '@mocks',
          replacement: path.resolve(__dirname, './src/mocks')
        },
        {
          find: '@onemap',
          replacement: path.resolve(__dirname, './src/services/onemap')
        },
        {
          find: '@pages',
          replacement: path.resolve(__dirname, './src/pages')
        },
        {
          find: '@redux-types',
          replacement: path.resolve(__dirname, './src/store/types')
        },
        {
          find: '@routes',
          replacement: path.resolve(__dirname, './src/routes')
        },
        {
          find: '@server',
          replacement: path.resolve(__dirname, './src/server')
        },
        {
          find: '@services',
          replacement: path.resolve(__dirname, './src/services')
        },
        {
          find: '@slices',
          replacement: path.resolve(__dirname, './src/store/slices')
        },
        {
          find: '@snapshots',
          replacement: path.resolve(__dirname, './src/snapshots')
        },
        {
          find: '@store',
          replacement: path.resolve(__dirname, './src/store')
        },
        {
          find: '@styles',
          replacement: path.resolve(__dirname, './src/styles')
        },
        {
          find: '@teams',
          replacement: path.resolve(__dirname, './src/services/teams')
        },
        {
          find: '@theme',
          replacement: path.resolve(__dirname, './src/theme')
        },
        {
          find: '@types',
          replacement: path.resolve(__dirname, './src/types')
        },
        {
          find: '@utils',
          replacement: path.resolve(__dirname, './src/utils')
        },
        {
          find: '@validation',
          replacement: path.resolve(__dirname, './src/services/validation')
        },
        // Supabase browser polyfill (keep this last)
        {
          find: 'stream',
          replacement: 'stream-browserify'
        }
      ]
    },
    plugins: [
      react({
        jsxRuntime: 'automatic',
        fastRefresh: true,
      }),
      googleMapsPlugin(),
      dts()
    ],
    optimizeDeps: {
      exclude: ['lucide-react'],
      include: ['@supabase/supabase-js'],
      esbuildOptions: {
        define: {
          global: 'globalThis'
        }
      }
    },
    build: {
      sourcemap: true,
      target: 'es2020',
      rollupOptions: {
        external: [],
        output: {
          manualChunks: {
            vendor: ['jszip']
          }
        },
        input: {
          main: path.resolve(__dirname, 'index.html')
        }
      }
    },
    server: {
      port: 5173,  // Development server port
      host: true
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/setupTests.ts',
        ]
      }
    },
    define: {
      'process.env': env
    }
  };
});