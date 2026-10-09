import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
const env = { ...process.env, APPIUM_HOME: resolve(process.env.APPIUM_HOME || '.appium') };
const appium = resolve('node_modules/appium/index.js');
const listed = spawnSync(process.execPath, [appium, 'driver', 'list', '--installed', '--json'], { env, encoding: 'utf8' });
if (listed.status !== 0) throw new Error('Could not inspect installed Appium drivers');
if (JSON.parse(listed.stdout).uiautomator2) console.log('Project UiAutomator2 driver already registered');
else {
  const installed = spawnSync(process.execPath, [appium, 'driver', 'install', '--source=dev', 'uiautomator2'], { env, stdio: 'inherit' });
  if (installed.status !== 0) process.exitCode = 1;
}
