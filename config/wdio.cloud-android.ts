import { shared } from './wdio.shared.js';
import { cloudCapabilities } from './capabilities.js';
import { sauceConnection } from './sauce.js';
process.env.EXECUTION_TARGET = 'saucelabs';
export const config: WebdriverIO.Config = {
  ...shared, ...sauceConnection(),
  capabilities: cloudCapabilities('android'),
};
