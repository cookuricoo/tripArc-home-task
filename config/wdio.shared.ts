import { SessionHelper } from '../src/helpers/SessionHelper.js';
import { ArtifactHelper } from '../src/helpers/ArtifactHelper.js';
import { specFiles } from './capabilities.js';
import { artifactRoot } from './environment.js';
import { join } from 'node:path';

export const shared: WebdriverIO.Config = {
  capabilities: [],
  runner: 'local', specs: specFiles, maxInstances: 1,
  framework: 'mocha', mochaOpts: { ui: 'bdd', timeout: 180_000, retries: 0 },
  logLevel: 'warn', outputDir: join(artifactRoot, 'wdio'),
  waitforTimeout: 15_000, waitforInterval: 300,
  connectionRetryTimeout: 120_000, connectionRetryCount: 1, specFileRetries: 0,
  reporters: [
    'spec', ['junit', { outputDir: join(artifactRoot, 'junit'), outputFileFormat: options => `results-${options.cid}.xml` }],
    ['allure', { outputDir: join(artifactRoot, 'allure-results'), disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false }],
  ],
  beforeTest: async function (test) { await SessionHelper.beforeScenario(test.title); },
  afterTest: async function (test, _context, result) {
    await SessionHelper.afterScenario(test.title, result.passed);
  },
  afterHook: async function (test, _context, result) {
    if (result.error) {
      try { await ArtifactHelper.capture(`hook-${test.title}`); }
      catch (error) { console.warn('Hook artifact capture failed:', error); }
    }
  },
};
