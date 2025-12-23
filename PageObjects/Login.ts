import {Locator, Page} from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator
  readonly loginButton: Locator

  constructor(page: Page) {
    this.page = page;
    this.username = page.getByPlaceholder('Email address');
    this.password = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });

}
  async login(username: string, password: string) {
    await this.username.fill(username); 
    await this.password.fill(password);
    await this.page.waitForTimeout(2500);
    await this.loginButton.click({force: true});
  }
}