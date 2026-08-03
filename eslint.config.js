import js from '@eslint/js';
import unicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['dist/**', 'node_modules/**'],
    },

    js.configs.recommended,

    ...tseslint.configs.recommended,

    unicorn.configs['flat/recommended'],

    {
        files: ['src/**/*.ts'],

        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },

        rules: {
            'no-console': 'warn',

            'unicorn/filename-case': [
                'error',
                {
                    case: 'kebabCase',
                },
            ],

            'unicorn/prevent-abbreviations': [
                'error',
                {
                    allowList: {
                        api: true,
                        db: true,
                        id: true,
                        url: true,
                    },
                },
            ],

            'unicorn/no-null': 'off',
        },
    },
);
