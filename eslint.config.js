import react from 'eslint-plugin-react';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import nextConfig from 'eslint-config-next';

export default [
    {
        ignores: ['.next/**', 'node_modules/**', 'build/**', 'dist/**', '**/*.min.js', 'coverage/**', '.pnpm/**']
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                React: 'readonly',
                // Jest globals
                describe: 'readonly',
                it: 'readonly',
                test: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                jest: 'readonly'
            },
            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module'
        }
    },
    js.configs.recommended,
    ...nextConfig,
    {
        plugins: {
            react
        },
        rules: {
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            '@next/next/no-html-link-for-pages': 'off',
            '@next/next/no-img-element': 'off' // Allow img tags in test files
        }
    }
];
