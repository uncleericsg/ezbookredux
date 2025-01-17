module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // Disable React in scope rule since Next.js handles this
    'react/react-in-jsx-scope': 'off',
    
    // Allow some explicit any usage where necessary
    '@typescript-eslint/no-explicit-any': 'warn',
    
    // Unused vars should be warnings not errors
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    
    // Allow unescaped entities in JSX
    'react/no-unescaped-entities': 'off',
    
    // Enforce key prop in iterators
    'react/jsx-key': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
} 