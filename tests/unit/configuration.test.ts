import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { androidCapabilities, cloudCapabilities, specFiles } from '../../config/capabilities.js';
import { cloudApp, deviceIds, required } from '../../config/environment.js';
import { sauceRegion } from '../../config/sauce.js';
import { LocatorHelper, pair } from '../../src/locators/strategies.js';

test('parallel workers partition specs and do not share device IDs or ports', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'triparc-config-'));
  try {
    const app = join(directory, 'fixture.apk');
    await writeFile(app, 'capability validation only');
    const caps = androidCapabilities(true, { ANDROID_UDIDS: 'emulator-5554,emulator-5556', ANDROID_APP_PATH: app });
    assert.equal(new Set(caps.map(c => c['appium:systemPort'])).size, 2);
    assert.equal(new Set(caps.map(c => c['appium:udid'])).size, 2);
    assert.equal(new Set(caps.map(c => c['appium:mjpegServerPort'])).size, 2);
    assert.deepEqual(caps.flatMap(c => c['wdio:specs']).sort(), [...specFiles].sort());
    assert.equal(new Set(caps.flatMap(c => c['wdio:specs'])).size, specFiles.length);
  } finally { await rm(directory, { recursive: true }); }
});
test('invalid local and cloud configuration fails before starting a session', () => {
  assert.throws(() => deviceIds({ ANDROID_UDIDS: 'same,same' }), /unique/);
  assert.throws(() => androidCapabilities(true, { ANDROID_UDIDS: 'one' }), /exactly two/);
  assert.throws(() => required('TOKEN', {}), /Missing TOKEN/);
  assert.throws(() => cloudApp('ios', { SAUCE_IOS_APP: 'bs://abc' }), /storage:/);
  assert.throws(() => cloudCapabilities('ios', { SAUCE_IOS_APP: 'storage:379c301a-199c-4b40-ad45-4a95e5f30a3a' }), /SAUCE_IOS_DEVICE/);
  assert.throws(() => sauceRegion({ SAUCE_REGION: 'us-central-1' }), /SAUCE_REGION/);
});
test('iOS capabilities and selector resolution express concrete platform differences', () => {
  const caps = cloudCapabilities('ios', { SAUCE_IOS_APP: 'storage:379c301a-199c-4b40-ad45-4a95e5f30a3a',
    SAUCE_IOS_DEVICE: 'iPhone 15', SAUCE_IOS_OS: '17' });
  assert.equal(caps[0]['appium:automationName'], 'XCUITest');
  assert.equal(caps[0]['appium:deviceName'], 'iPhone 15');
  assert.equal(caps[0]['sauce:options'].appiumVersion, 'stable');
  assert.equal(LocatorHelper.resolve(pair('id=android-id', '~ios-id'), 'ios'), '~ios-id');
});
