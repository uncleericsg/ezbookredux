import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'redux-persist',
      'framer-motion',
      '@tanstack/react-query'
    ]
  },
  build: {
    sourcemap: true,
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // State Management
          'react-query': ['@tanstack/react-query'],
          'redux': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          
          // UI Libraries
          'ui-libs': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
            '@headlessui/react'
          ],
          
          // Animation and Utils
          'animation': ['framer-motion'],
          'utils': ['date-fns', 'axios', 'zod'],
          
          // Payment
          'payment': ['@stripe/react-stripe-js', '@stripe/stripe-js'],
          
          // Analytics
          'analytics': ['@vercel/analytics', '@vercel/speed-insights']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@admin': path.resolve(__dirname, './src/components/admin'),
      '@booking': path.resolve(__dirname, './src/components/booking'),
      '@config': path.resolve(__dirname, './src/config'),
      '@store': path.resolve(__dirname, './src/store'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@lib': path.resolve(__dirname, './src/lib')
    }
  }
});
