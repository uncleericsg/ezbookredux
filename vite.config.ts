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
    target: 'esnext',
    modulePreload: {
      polyfill: true
    },
    commonjsOptions: {
      include: [
        /node_modules/,
        /\@tanstack\/react-query/
      ]
    },
    rollupOptions: {
      external: [],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/@tanstack/react-query') || 
              id.includes('node_modules/@tanstack/query-core')) {
            return 'vendor-react-query';
          }
          if (id.includes('node_modules/@radix-ui')) {
            return 'vendor-radix';
          }
          if (id.includes('node_modules/@headlessui')) {
            return 'vendor-headlessui';
          }
          if (id.includes('node_modules/lodash') || 
              id.includes('node_modules/date-fns')) {
            return 'vendor-utils';
          }
          if (id.includes('node_modules/@stripe')) {
            return 'vendor-stripe';
          }
          if (id.includes('src/components/ui')) {
            return 'ui-components';
          }
          if (id.includes('src/components/common')) {
            return 'common-components';
          }
          if (id.includes('src/components/booking')) {
            return 'booking-components';
          }
          if (id.includes('src/components/admin')) {
            return 'admin-components';
          }
          if (id.includes('src/api') || id.includes('src/services')) {
            return 'data-layer';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
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
