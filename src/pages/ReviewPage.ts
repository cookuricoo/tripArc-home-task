import { review } from '../locators/screens.js';
import { MoneyHelper } from '../helpers/MoneyHelper.js';
import { DeviceHelper } from '../helpers/DeviceHelper.js';
import { BasePage } from './BasePage.js';
export class ReviewPage extends BasePage {
  async waitUntilReady(): Promise<void> { await this.visible(review.ready); }
  async readOrder() {
    await this.waitUntilReady();
    const name = await this.text(review.name);
    const unitPriceCents = MoneyHelper.toCents(await this.text(review.unitPrice));
    await DeviceHelper.scrollTo(this.selector(review.total));
    const totalCents = MoneyHelper.toCents(await this.text(review.total));
    const quantity = Number.parseInt(await this.text(review.quantity), 10);
    return { name, quantity, unitPriceCents, totalCents };
  }
  async placeOrder(): Promise<void> { await this.click(review.placeOrder, true); }
}
