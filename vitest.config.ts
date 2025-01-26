/// <reference types="vitest" />
import path from 'path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@store': path.resolve(__dirname, './src/store'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@admin/*': path.resolve(__dirname, './src/components/admin/*'),
      '@api/*': path.resolve(__dirname, './src/api/*'),
      '@auth/*': path.resolve(__dirname, './src/components/auth/*'),
      '@booking/*': path.resolve(__dirname, './src/components/booking/*'),
      '@common/*': path.resolve(__dirname, './src/components/common/*'),
      '@components/*': path.resolve(__dirname, './src/components/*'),
      '@config/*': path.resolve(__dirname, './src/config/*'),
      '@constants/*': path.resolve(__dirname, './src/constants/*'),
      '@data/*': path.resolve(__dirname, './src/data/*'),
      '@dev/*': path.resolve(__dirname, './src/components/dev/*'),
      '@error-boundary/*': path.resolve(__dirname, './src/components/error-boundary/*'),
      '@google/*': path.resolve(__dirname, './src/services/google/*'),
      '@hooks/*': path.resolve(__dirname, './src/hooks/*'),
      '@icons/*': path.resolve(__dirname, './src/components/icons/*'),
      '@lib/*': path.resolve(__dirname, './src/lib/*'),
      '@locations/*': path.resolve(__dirname, './src/services/locations/*'),
      '@modals/*': path.resolve(__dirname, './src/components/modals/*'),
      '@mocks/*': path.resolve(__dirname, './src/mocks/*'),
      '@notifications/*': path.resolve(__dirname, './src/components/notifications/*'),
      '@onemap/*': path.resolve(__dirname, './src/services/onemap/*'),
      '@pages/*': path.resolve(__dirname, './src/pages/*'),
      '@payment/*': path.resolve(__dirname, './src/components/payment/*'),
      '@profile/*': path.resolve(__dirname, './src/components/profile/*'),
      '@redux-types/*': path.resolve(__dirname, './src/store/types/*'),
      '@routes/*': path.resolve(__dirname, './src/routes/*'),
      '@server/*': path.resolve(__dirname, './src/server/*'),
      '@services/*': path.resolve(__dirname, './src/services/*'),
      '@slices/*': path.resolve(__dirname, './src/store/slices/*'),
      '@snapshots/*': path.resolve(__dirname, './src/snapshots/*'),
      '@store/*': path.resolve(__dirname, './src/store/*'),
      '@styles/*': path.resolve(__dirname, './src/styles/*'),
      '@teams/*': path.resolve(__dirname, './src/services/teams/*'),
      '@tech/*': path.resolve(__dirname, './src/components/tech/*'),
      '@test/*': path.resolve(__dirname, './src/components/test/*'),
      '@theme/*': path.resolve(__dirname, './src/theme/*'),
      '@types/*': path.resolve(__dirname, './src/types/*'),
      '@ui/*': path.resolve(__dirname, './src/components/ui/*'),
      '@utils/*': path.resolve(__dirname, './src/utils/*'),
      '@validation/*': path.resolve(__dirname, './src/services/validation/*'),
      '@mockup/*': path.resolve(__dirname, './mockup/*')
    },
  },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './tests/reports/coverage',
      include: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.test.{ts,tsx}',
        '!src/types/**',
        '!src/mocks/**'
      ],
      exclude: [
        'tests/**',
        'node_modules/**',
        'dist/**',
        'coverage/**',
        '*.config.{js,ts}',
        'src/vite-env.d.ts'
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      }
    },
    reporters: ['default', 'json'],
    outputFile: {
      json: './tests/reports/test-results.json'
    }
  },
})
