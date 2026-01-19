import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'


/** @type {import('eslint').Linter.Config[]} */
export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,

    // Konfigurasi untuk React
    {
        files: ['**/*.{ts,tsx}'], // Terapkan hanya pada file TypeScript
        ...react.configs.flat.recommended,
        ...react.configs.flat['jsx-runtime'],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/no-unescaped-entities': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },

    // Konfigurasi untuk React Hooks
    {
        files: ['**/*.{ts,tsx}'], // Terapkan hanya pada file TypeScript
        plugins: {
            'react-hooks': reactHooks,
        },
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
    },

    // ===== BAGIAN YANG DIPERBAIKI =====
    // Aturan kustom untuk menimpa (override) default
    {
        files: ['**/*.{ts,tsx}'], // Terapkan hanya pada file TypeScript
        rules: {
            // Izinkan variabel/argumen yang diawali dengan _ agar tidak dianggap error
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'after-used',
                    ignoreRestSiblings: true,
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
        },
    },
    // ===================================

    // File yang diabaikan
    {
        ignores: [
            'vendor',
            'node_modules',
            'public',
            'bootstrap/ssr',
            'tailwind.config.js',
            'postcss.config.js',
            'vite.config.ts',
        ],
    },

    // Konfigurasi Prettier (selalu di paling akhir)
    prettier,
]