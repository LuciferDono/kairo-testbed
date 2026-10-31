const typescriptEslintPlugin = require("@typescript-eslint/eslint-plugin");
const typescriptEslintParser = require("@typescript-eslint/parser");

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  {
    files: ["**/*.ts"],
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
    },
    languageOptions: {
      parser: typescriptEslintParser,
    },
    rules: {
      ...typescriptEslintPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    },
  },
];
