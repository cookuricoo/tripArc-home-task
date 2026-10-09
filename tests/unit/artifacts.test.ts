import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ArtifactHelper } from '../../src/helpers/ArtifactHelper.js';
test('artifact collection retains source when screenshots and device logs fail', async () => {
  const root = await mkdtemp(join(tmpdir(), 'triparc-artifacts-'));
  try {
    const directory = await ArtifactHelper.capture('../../bad title', {
      async saveScreenshot() { throw new Error('session unavailable'); },
      async getPageSource() { return '<hierarchy />'; },
      async getLogs() { throw new Error('unsupported on iOS'); },
    }, root);
    assert.equal(await readFile(join(directory, 'source.xml'), 'utf8'), '<hierarchy />');
    const records = JSON.parse(await readFile(join(directory, 'capture.json'), 'utf8'));
    assert.deepEqual(records.map((r: { status: string }) => r.status), ['rejected', 'fulfilled', 'rejected']);
    assert.ok(directory.startsWith(root));
  } finally { await rm(root, { recursive: true }); }
});
