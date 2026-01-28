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
                React: 'readonly'
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
            'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]
        }
    }
];
