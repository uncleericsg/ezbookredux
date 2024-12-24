/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { googleMapsPlugin } from './vite-plugin-google-maps';
import mkcert from 'vite-plugin-mkcert';
import dts from 'vite-plugin-dts';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    plugins: [
      react({
        jsxRuntime: 'automatic',
        fastRefresh: true,
      }),
      googleMapsPlugin(env.VITE_GOOGLE_PLACES_API_KEY),
      // Temporarily disable HTTPS for development
      // mkcert(),
      dts()
    ],
    server: {
      // Disable HTTPS for development
      https: false,
      port: 5173,
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          ws: true
        },
        '/onemap': {
          target: 'https://developers.onemap.sg',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/onemap/, ''),
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode);
            });
          }
        },
        '/maps/api': {
          target: 'https://maps.googleapis.com',
          changeOrigin: true,
          secure: true,
        }
      }
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
      include: [
        'react', 
        'react-dom',
        'firebase/app',
        'firebase/auth',
        'firebase/firestore',
        'firebase/messaging',
        '@googlemaps/js-api-loader'
      ]
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      minify: true,
      chunkSizeWarningLimit: 1000,
      target: 'esnext',
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html')
        },
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['framer-motion', '@hello-pangea/dnd'],
            'firebase': [
              'firebase/app',
              'firebase/auth',
              'firebase/firestore',
              'firebase/messaging'
            ],
            'stripe': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
            'utils': ['date-fns', 'zod', 'axios'],
            'google-maps': ['@googlemaps/js-api-loader']
          }
        }
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/test/',
          '**/*.d.ts',
          '**/*.test.{ts,tsx}',
          '**/*.spec.{ts,tsx}',
          '**/snapshots/*'
        ]
      }
    },
    define: {
      'process.env': env
    }
  };
});