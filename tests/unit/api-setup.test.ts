import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ApiSetupHelper } from '../../src/helpers/ApiSetupHelper.js';
test('unconfigured API is explicit and does not invent fixtures', async () => {
  const helper = new ApiSetupHelper();
  assert.deepEqual(await helper.setup({ scenario: 'cart', runId: '1' }), { status: 'not-configured', fixtureIds: [] });
  await helper.cleanup();
});
test('injected API adapter receives context and cleanup receives created fixture IDs once', async () => {
  let cleaned = 0;
  const helper = new ApiSetupHelper({
    async setup(context) { assert.equal(context.runId, 'unique'); return { status: 'ready', fixtureIds: ['fixture-1'] }; },
    async cleanup(result) { cleaned++; assert.deepEqual(result.fixtureIds, ['fixture-1']); },
  });
  await helper.setup({ scenario: 'purchase', runId: 'unique' });
  await helper.cleanup();
  await helper.cleanup();
  assert.equal(cleaned, 1);
});
