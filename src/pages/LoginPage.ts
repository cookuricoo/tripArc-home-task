import { login } from '../locators/screens.js';
import type { Credentials } from '../types/domain.js';
import { BasePage } from './BasePage.js';
export class LoginPage extends BasePage {
  async signIn(details: Credentials): Promise<void> {
    await this.visible(login.username);
    await this.fill(login.username, details.username);
    await this.fill(login.password, details.password);
    await this.click(login.submit, true);
  }
}
