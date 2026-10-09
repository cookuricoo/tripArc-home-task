import { shared } from './wdio.shared.js';
import { androidCapabilities } from './capabilities.js';
import { artifactRoot } from './environment.js';
import { join } from 'node:path';
export const config: WebdriverIO.Config = {
  ...shared, hostname: '127.0.0.1', port: 4723, path: '/',
  services: [['appium', { command: 'appium', logPath: join(artifactRoot, 'appium'), args: { address: '127.0.0.1', port: 4723 } }]],
  capabilities: androidCapabilities(),
};
