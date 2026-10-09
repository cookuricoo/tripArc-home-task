import { payment } from '../locators/screens.js';
import type { PaymentDetails } from '../types/domain.js';
import { BasePage } from './BasePage.js';
export class PaymentPage extends BasePage {
  async waitUntilReady(): Promise<void> { await this.visible(payment.ready); }
  async enterPayment(details: PaymentDetails): Promise<void> {
    await this.waitUntilReady();
    await this.fill(payment.fullName, details.fullName);
    await this.fill(payment.cardNumber, details.cardNumber);
    await this.fill(payment.expiry, details.expiry);
    await this.fill(payment.securityCode, details.securityCode);
  }
  async reviewOrder(): Promise<void> { await this.click(payment.submit, true); }
}
