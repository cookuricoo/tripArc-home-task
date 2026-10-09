import { catalog } from '../locators/screens.js';
import { BasePage } from './BasePage.js';
export class CatalogPage extends BasePage {
  async waitUntilReady(): Promise<void> { await this.visible(catalog.ready); }
  async openProduct(name: string): Promise<void> {
    await this.waitUntilReady();
    await this.click(catalog.product(name), true);
  }
}
