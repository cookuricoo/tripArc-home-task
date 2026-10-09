import { browser } from '@wdio/globals';
import { shipping } from '../locators/screens.js';
import type { ShippingDetails } from '../types/domain.js';
import { BasePage } from './BasePage.js';
import { DeviceHelper } from '../helpers/DeviceHelper.js';
export class ShippingPage extends BasePage {
  async waitUntilReady(): Promise<void> { await this.visible(shipping.ready); }
  async fillAddress(details: ShippingDetails): Promise<void> {
    await this.waitUntilReady();
    await this.fill(shipping.fullName, details.fullName);
    await this.fill(shipping.address1, details.address1);
    await this.fill(shipping.city, details.city);
    await this.fill(shipping.zip, details.zip);
    await this.fill(shipping.state, details.state);
    await this.fill(shipping.country, details.country);
  }
  async submitShipping(): Promise<void> { await this.click(shipping.submit, true); }
  async readNameValidation(): Promise<string> {
    // Android displays an inline error; iOS shows a native modal alert.
    // Restore the top of the Android form after scrolling down to submit it.
    if (browser.isAndroid) {
      await DeviceHelper.scrollTo(this.selector(shipping.nameError), 6, 'up');
    }
    return this.text(shipping.nameError);
  }
  async dismissValidation(): Promise<void> {
    if (browser.isIOS) await this.click(shipping.dismissError);
  }
  async isCurrentScreen(): Promise<boolean> {
    return browser.$(this.selector(shipping.ready)).isDisplayed();
  }
}
