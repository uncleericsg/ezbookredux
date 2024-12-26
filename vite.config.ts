/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { googleMapsPlugin } from './vite-plugin-google-maps';
import mkcert from 'vite-plugin-mkcert';
import dts from 'vite-plugin-dts';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    resolve: {
      preserveSymlinks: true,
      mainFields: ['module', 'main'],
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, './src')
        },
        {
          find: '@admin',
          replacement: path.resolve(__dirname, './src/components/admin')
        },
        {
          find: '@api',
          replacement: path.resolve(__dirname, './src/api')
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
          find: '@config',
          replacement: path.resolve(__dirname, './src/config')
        },
        {
          find: '@constants',
          replacement: path.resolve(__dirname, './src/constants')
        },
        {
          find: '@context',
          replacement: path.resolve(__dirname, './src/context')
        },
        {
          find: '@hooks',
          replacement: path.resolve(__dirname, './src/hooks')
        },
        {
          find: '@layouts',
          replacement: path.resolve(__dirname, './src/layouts')
        },
        {
          find: '@lib',
          replacement: path.resolve(__dirname, './src/lib')
        },
        {
          find: '@pages',
          replacement: path.resolve(__dirname, './src/pages')
        },
        {
          find: '@public',
          replacement: path.resolve(__dirname, './public')
        },
        {
          find: '@routes',
          replacement: path.resolve(__dirname, './src/routes')
        },
        {
          find: '@services',
          replacement: path.resolve(__dirname, './src/services')
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
          find: '@types',
          replacement: path.resolve(__dirname, './src/types')
        },
        {
          find: '@utils',
          replacement: path.resolve(__dirname, './src/utils')
        },
        {
          find: '@views',
          replacement: path.resolve(__dirname, './src/views')
        }
      ]
    },
    plugins: [
      react({
        jsxRuntime: 'automatic',
        fastRefresh: true,
      }),
      googleMapsPlugin(),
      mkcert(),
      dts()
    ],
    server: {
      port: 5173,
      https: false,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/maps/api': {
          target: 'https://maps.googleapis.com',
          changeOrigin: true,
          secure: true,
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              proxyReq.setHeader('Origin', 'https://maps.googleapis.com');
            });
          }
        }
      }
    },
    optimizeDeps: {
      exclude: ['lucide-react', 'stream', 'util', 'events'],
      include: [
        'react', 
        'react-dom',
        '@googlemaps/js-api-loader',
        'axios'
      ]
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      minify: true,
      chunkSizeWarningLimit: 1000,
      target: 'esnext',
      rollupOptions: {
        external: ['stream', 'util', 'events'],
        input: {
          main: path.resolve(__dirname, 'index.html')
        },
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['framer-motion', '@hello-pangea/dnd'],
            'stripe': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
            'utils': ['date-fns', 'zod'],
            'google-maps': ['@googlemaps/js-api-loader']
          }
        }
      }
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