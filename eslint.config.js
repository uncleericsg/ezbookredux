import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';

export default [
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**', '.git', '*.min.js', 'build/**'] },
  {
    files: ['**/*.{js,jsx,ts,tsx,mts,cts}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        React: 'readonly',
        JSX: 'readonly'
      },
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.app.json',
        ecmaFeatures: {
          jsx: true,
          modules: true,
          impliedStrict: true
        },
        tsconfigRootDir: '.',
        warnOnUnsupportedTypeScriptVersion: true
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
      noInlineConfig: false
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react': react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'import': importPlugin
    },
    settings: {
      'react': {
        version: 'detect',
        componentWrapperFunctions: ['memo'],
        linkComponents: ['Link', 'NavLink'],
        formComponents: ['Form']
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx', '.mts', '.cts']
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.app.json'
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.mts', '.cts', '.json']
        }
      },
      'import/extensions': [
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
        '.mts',
        '.cts'
      ]
    },
    rules: {
      // Base rules
      'no-unused-vars': 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-undef': 'error',
      'no-duplicate-imports': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always'],
      
      // React rules
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off', // We use TypeScript instead
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/jsx-no-undef': 'error',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      
      // Module rules
      'import/no-unresolved': 'error',
      'import/extensions': ['error', 'never', { 
        css: 'always',
        json: 'always',
        scss: 'always' 
      }],
      'import/order': ['error', {
        'groups': [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type'
        ],
        'pathGroups': [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '@admin/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '@components/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '@services/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '@store/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '@hooks/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '@utils/**',
            group: 'internal',
            position: 'before'
          }
        ],
        'pathGroupsExcludedImportTypes': ['builtin', 'object'],
        'newlines-between': 'always',
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true
        }
      }],
      'import/no-cycle': 'error',
      'import/no-duplicates': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-self-import': 'error',
      'import/first': 'error',
      'import/no-webpack-loader-syntax': 'error',
      
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        disallowTypeAnnotations: false,
        fixStyle: 'separate-type-imports'
      }],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': ['warn', {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': true,
        'ts-nocheck': true,
        'ts-check': false,
        minimumDescriptionLength: 3
      }],
      '@typescript-eslint/consistent-type-assertions': ['error', {
        assertionStyle: 'as',
        objectLiteralTypeAssertions: 'allow-as-parameter'
      }],
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-empty-interface': 'error'
    }
  }
];
