import type { Platform } from '../src/types/domain.js';
import { cloudApp, deviceIds, localApp, required } from './environment.js';
import { fileURLToPath } from 'node:url';

export const specFiles = [
  './tests/specs/purchase.spec.ts', './tests/specs/cart.spec.ts',
  './tests/specs/checkout-validation.spec.ts', './tests/specs/lifecycle.spec.ts',
].map(path => fileURLToPath(new URL(`../${path}`, import.meta.url)));

export function androidCapabilities(parallel = false, env: NodeJS.ProcessEnv = process.env) {
  const devices = deviceIds(env);
  if (parallel && devices.length !== 2) throw new Error('Parallel execution requires exactly two ANDROID_UDIDS');
  return (parallel ? devices : devices.slice(0, 1)).map((udid, index) => ({
    platformName: 'Android', 'appium:automationName': 'UiAutomator2',
    'appium:app': localApp(env), 'appium:udid': udid,
    'appium:deviceName': udid, 'appium:systemPort': 8200 + index,
    'appium:mjpegServerPort': 9100 + index,
    'appium:appPackage': 'com.saucelabs.mydemoapp.android',
    'appium:appActivity': '.view.activities.SplashActivity',
    'appium:appWaitActivity': '*.MainActivity',
    'appium:language': 'en', 'appium:locale': 'US',
    'appium:noReset': false, 'appium:fullReset': true,
    'appium:autoGrantPermissions': true, 'appium:newCommandTimeout': 120,
    'wdio:maxInstances': 1,
    // Partition specs rather than executing the whole suite on each emulator.
    ...(parallel ? { 'wdio:specs': specFiles.filter((_, i) => i % 2 === index) } : {}),
  }));
}

export function cloudCapabilities(platform: Platform, env: NodeJS.ProcessEnv = process.env) {
  const android = platform === 'android';
  return [{
    platformName: android ? 'Android' : 'iOS',
    'appium:automationName': android ? 'UiAutomator2' : 'XCUITest',
    'appium:app': cloudApp(platform, env),
    'appium:deviceName': required(android ? 'SAUCE_ANDROID_DEVICE' : 'SAUCE_IOS_DEVICE', env),
    'appium:platformVersion': required(android ? 'SAUCE_ANDROID_OS' : 'SAUCE_IOS_OS', env),
    'appium:noReset': false,
    'appium:language': 'en', 'appium:locale': android ? 'US' : 'en_US',
    'appium:newCommandTimeout': 120,
    'wdio:maxInstances': 1,
    // The suite deliberately handles its shipping-validation alert.
    ...(android ? { 'appium:autoGrantPermissions': true } : {}),
    'sauce:options': {
      appiumVersion: env.SAUCE_APPIUM_VERSION?.trim() || 'stable',
      name: `${platform} native business scenarios`,
      build: env.BUILD_NAME || `triparc-${new Date().toISOString().slice(0, 10)}`,
    },
  }];
}
