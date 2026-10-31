const js = require('@eslint/js');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  { ignores: ['dist/**', 'coverage/**'] },
  js.configs.recommended,
  ...typescriptEslintPlugin.configs['flat/recommended'],
];
