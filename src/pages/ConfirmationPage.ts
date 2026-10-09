import { confirmation } from '../locators/screens.js';
import { BasePage } from './BasePage.js';
export class ConfirmationPage extends BasePage {
  async readHeading(): Promise<string> { return this.text(confirmation.heading); }
}
