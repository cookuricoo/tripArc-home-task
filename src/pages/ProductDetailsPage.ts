import { browser } from '@wdio/globals';
import { product, navigation } from '../locators/screens.js';
import { BasePage } from './BasePage.js';
export class ProductDetailsPage extends BasePage {
  async waitUntilReady(): Promise<void> { await this.visible(product.ready); }
  async addToCart(): Promise<void> {
    await this.waitUntilReady();
    await this.click(product.add, true);
    await browser.waitUntil(async () => {
      const badge = await browser.$(this.selector(navigation.badge));
      return await badge.isDisplayed() && Number(await badge.getText()) > 0;
    }, { timeout: 15_000, timeoutMsg: 'Cart badge did not update after adding product' });
  }
}
