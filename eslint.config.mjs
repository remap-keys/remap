// This file was generated automatically by `npx @eslint/migrate-config .eslintrc.json`.
// https://www.npmjs.com/package/@eslint/migrate-config

import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import react from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "prettier/react",
)), {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
        react: fixupPluginRules(react),
        prettier: fixupPluginRules(prettier),
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.browser,
            HIDDevice: "readonly",
            describe: "readonly",
            test: "readonly",
            expect: "readonly",
            fail: "readonly",
            assert: "readonly",
        },

        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "module",

        parserOptions: {
            version: 2018,

            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    rules: {
        "prettier/prettier": ["warn", {}, {
            usePrettierrc: true,
        }],

        "no-unused-vars": "warn",
        "react/prop-types": "warn",
    },
}];