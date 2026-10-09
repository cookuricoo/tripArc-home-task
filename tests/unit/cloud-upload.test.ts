import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CloudUploadHelper } from '../../src/helpers/CloudUploadHelper.js';

test('cloud upload validates the returned app ID and does not expose response bodies on failure', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'triparc-upload-'));
  const previousUser = process.env.SAUCE_USERNAME;
  const previousKey = process.env.SAUCE_ACCESS_KEY;
  const previousRegion = process.env.SAUCE_REGION;
  process.env.SAUCE_USERNAME = 'unit-test-user';
  process.env.SAUCE_ACCESS_KEY = 'unit-test-key';
  process.env.SAUCE_REGION = 'us-west-1';
  try {
    const file = join(directory, 'fixture.apk');
    await writeFile(file, 'unit-test fixture, not an app binary');
    const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({
      item: { id: '379c301a-199c-4b40-ad45-4a95e5f30a3a' },
    }));
    assert.equal(await CloudUploadHelper.upload(file), 'storage:379c301a-199c-4b40-ad45-4a95e5f30a3a');
    assert.equal(fetch.mock.calls[0].arguments[0], 'https://api.us-west-1.saucelabs.com/v1/storage/upload');
    fetch.mock.mockImplementation(async () => new Response('private response details', { status: 401 }));
    await assert.rejects(CloudUploadHelper.upload(file), /^Error: Sauce Labs upload failed: HTTP 401$/);
    fetch.mock.mockImplementation(async () => Response.json({ item: { id: 'not-a-storage-id' } }));
    await assert.rejects(CloudUploadHelper.upload(file), /valid storage id/);
  } finally {
    if (previousUser === undefined) delete process.env.SAUCE_USERNAME;
    else process.env.SAUCE_USERNAME = previousUser;
    if (previousKey === undefined) delete process.env.SAUCE_ACCESS_KEY;
    else process.env.SAUCE_ACCESS_KEY = previousKey;
    if (previousRegion === undefined) delete process.env.SAUCE_REGION;
    else process.env.SAUCE_REGION = previousRegion;
    await rm(directory, { recursive: true });
  }
});
