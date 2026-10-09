import { browser } from '@wdio/globals';
import { CatalogPage } from '../pages/CatalogPage.js';
import { ArtifactHelper } from './ArtifactHelper.js';
import { ApiSetupHelper } from './ApiSetupHelper.js';

export class SessionHelper {
  private static api = new ApiSetupHelper();

  static async beforeScenario(name: string): Promise<void> {
    // Exactly one scenario per spec: WDIO creates a fresh session per spec.
    await browser.setTimeout({ implicit: 0 });
    await this.api.setup({ scenario: name, runId: browser.sessionId });
    await new CatalogPage().waitUntilReady();
  }

  static async afterScenario(name: string, passed: boolean): Promise<void> {
    if (!passed) {
      try { await ArtifactHelper.capture(name); }
      catch (error) { console.warn('Failure artifacts unavailable:', error); }
    }
    await this.api.cleanup();
    if (process.env.EXECUTION_TARGET === 'saucelabs') {
      // Metadata failure must not replace the business test outcome.
      try {
        await browser.execute(`sauce:job-result=${passed ? 'passed' : 'failed'}`);
      } catch (error) { console.warn('Could not update cloud session status:', error); }
    }
  }
}
