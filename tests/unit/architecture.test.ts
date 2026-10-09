import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ESLint } from 'eslint';
test('lint enforces Page Object boundaries in business specs', async () => {
  const eslint = new ESLint();
  const [result] = await eslint.lintText(`
    import { browser } from '@wdio/globals';
    import { cart } from '../../src/locators/screens.js';
    function repeatedAction() { return browser.$(cart); }
    repeatedAction();
  `, { filePath: 'tests/specs/boundary.spec.ts' });
  assert.ok(result.messages.some(m => m.ruleId === 'no-restricted-imports'));
  assert.ok(result.messages.some(m => m.ruleId === 'no-restricted-syntax'));
});
