// @ts-check
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ...tsPlugin.configs['flat/recommended'],
];