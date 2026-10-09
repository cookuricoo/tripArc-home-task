import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MoneyHelper } from '../../src/helpers/MoneyHelper.js';
test('USD parsing uses cents and handles native app formatting', () => {
  assert.equal(MoneyHelper.toCents('$ 29.99'), 2999);
  assert.equal(MoneyHelper.toCents('$59.98'), 5998);
  assert.equal(MoneyHelper.toCents('$0'), 0);
  assert.equal(MoneyHelper.toCents('5.9'), 590);
});
test('malformed or unsupported amounts fail instead of producing NaN or partial values', () => {
  for (const amount of ['', 'price $29.99', '$29.999', '29,99', '-1', 'NaN']) {
    assert.throws(() => MoneyHelper.toCents(amount), /Invalid USD/);
  }
});
