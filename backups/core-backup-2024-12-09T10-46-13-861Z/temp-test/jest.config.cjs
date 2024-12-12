/** @type {import('jest').Config} */
const path = require('path');

const config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': path.resolve(__dirname, '../src/$1'),
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '^@iaircon/core/(.*)$': path.resolve(__dirname, '../src/$1'),
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  rootDir: '.',
  testMatch: ['<rootDir>/tests/**/*.test.{ts,tsx}'],
  moduleDirectories: ['node_modules', '../node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    '../src/**/*.{ts,tsx}',
    '!../src/**/*.d.ts',
    '!../src/**/index.{ts,tsx}',
    '!../src/**/*.stories.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = config;
