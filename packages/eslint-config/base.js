import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";

/** @type {import("eslint").Linter.FlatConfig[]} */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "unused-imports": unusedImportsPlugin,
      "simple-import-sort": simpleImportSortPlugin,
      turbo: turboPlugin,
      onlyWarn,
    },
    rules: {
      // React
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/display-name": "off",
      "react/jsx-key": "off",
      "react/no-unescaped-entities": "off",
      "react/no-children-prop": "off",

      // TypeScript ESLint
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unnecessary-template-expression": "error",
      "@typescript-eslint/default-param-last": "error",
      "@typescript-eslint/no-useless-empty-export": "error",
      "@typescript-eslint/no-duplicate-type-constituents": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-empty-interface": "off",

      // JS Rules
      "prefer-const": "off",
      "no-unsafe-optional-chaining": "off",
      "no-empty": "off",
      "no-prototype-builtins": "off",
      "no-duplicate-imports": "error",
      "prefer-template": "error",
      "no-unneeded-ternary": "error",

      // React Hooks
      "react-hooks/rules-of-hooks": "error",

      // Plugins
      "unused-imports/no-unused-imports": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react", "styled-components", "^zustand", "^@?\\w"],
            [
              "^utils",
              "^lib",
              "^config",
              "^pages",
              "^components",
              "^styles",
              "./components",
              "./",
            ],
            ["^service"],
            ["styles/icons", "^asset"],
            ["^.+\\.?(css)$"],
          ],
        },
      ],

      // Turbo
      "turbo/no-undeclared-env-vars": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // Override for Table files
  {
    files: ["*Table.ts", "*Table.tsx"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
    },
  },

  // Ignore patterns
  {
    ignores: [
      "/publish/*",
      "public/mockServiceWorker.js",
      "jest.config.js",
      "public/assets/trading-view/",
      "src/lib/trading-view/",
      "src/lib/trading-view/**/*",
      "generate-sitemap.js",
      "dist/**",
    ],
  },
];
