import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['node_modules/**', 'artifacts/**', 'apps/**', '.tools/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { rules: { 'no-undef': 'off', '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }] } },
  {
    files: ['tests/specs/**/*.ts'],
    rules: {
      'no-restricted-globals': ['error', { name: 'browser', message: 'Use page objects or helper classes.' },
        { name: 'driver', message: 'Use page objects or helper classes.' }, { name: '$', message: 'Locators belong in locator maps.' },
        { name: '$$', message: 'Locators belong in locator maps.' }],
      'no-restricted-imports': ['error', {
        paths: [{ name: '@wdio/globals', importNames: ['browser', 'driver', '$', '$$'], message: 'Specs contain business logic and assertions only.' },
          { name: 'webdriverio', message: 'Use page objects and helpers.' }],
        patterns: [{ group: ['**/locators/**'], message: 'Locators are private to page objects.' }],
      }],
      'no-restricted-syntax': ['error',
        { selector: 'FunctionDeclaration', message: 'Reusable functions belong in helper classes.' },
        { selector: 'VariableDeclarator[init.type="ArrowFunctionExpression"]', message: 'Reusable functions belong in helper classes.' },
        { selector: 'VariableDeclarator[init.type="FunctionExpression"]', message: 'Reusable functions belong in helper classes.' },
        { selector: 'ForStatement', message: 'Interaction loops belong in pages/helpers.' },
        { selector: 'WhileStatement', message: 'Interaction loops belong in pages/helpers.' }],
    },
  },
);
