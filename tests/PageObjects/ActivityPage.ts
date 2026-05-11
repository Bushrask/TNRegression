import { Page, Locator } from "@playwright/test";

export class ActivityPage {
  constructor(private readonly page: Page) {}

  private submissionsTab: Locator =
    this.page.locator("button:has-text('SUBMISSION')");

  private closeBtn: Locator =
    this.page.locator(".icon-arrow_back");

  async openSubmissionsTab(): Promise<void> {
      await this.page.waitForLoadState("load");
    if (await this.submissionsTab.isVisible()) {
      await this.submissionsTab.click();
      await this.page.waitForLoadState("domcontentloaded");
    }
    else {
      console.log("Submissions tab is not visible.");
    }
  }

  async closeActivity(): Promise<void> {
    if (await this.closeBtn.count()) {
      await this.closeBtn.click();
    } else {
      await this.page.goBack();
    }
    await this.page.waitForLoadState("domcontentloaded");
  }
}