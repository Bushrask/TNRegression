import { Page, Locator } from "@playwright/test";

export class ActivityPage {
  constructor(private readonly page: Page) { }

  private submissionsTab: Locator =
    this.page.locator("button:is(:has-text('SUBMISSION'), :has-text('EVALUATION'))");

  private closeBtn: Locator =
    this.page.locator(".icon-arrow_back");

  private descTab: Locator =
    this.page.getByRole("tab").first();

  async openSubmissionsTab(): Promise<void> {
    await this.page.waitForLoadState("load");
    await this.descTab.waitFor({ state: 'visible' });

    try {
      await this.submissionsTab.waitFor({ state: 'visible', timeout: 5000 });
      await this.submissionsTab.click();
      await this.page.waitForLoadState("domcontentloaded");
    }
    catch {
      console.log("Submission/Evaluation tab is not visible.");
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