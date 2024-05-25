// @ts-check
/** @type {import("eslint").Linter.FlatConfig[]} */

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import typeScriptESLintParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react,
    },
    languageOptions: {
      parser: typeScriptESLintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        HIDDevice: 'readonly',
      },
    },
    rules: {
      'prettier/prettier': 'warn',
      'no-unused-vars': 'warn',
      'react/prop-types': 'warn',
    },
  },
);
