import { Page } from "@playwright/test";

export class ActivityPage {
  constructor(private page: Page) {}

  submissionsTab = this.page.getByRole("tab", { name: "SUBMISSION" });
  myWorkLabel = this.page.getByText("My Work");
  rteEditor = this.page.locator(".cke_editor1"); // update selector if needed

  async openSubmissionsTab() {
    await this.submissionsTab.click();
    await this.page.waitForLoadState("networkidle");
  }

  async isRTEVisibleUnderMyWork(): Promise<boolean> {
    await this.myWorkLabel.scrollIntoViewIfNeeded();
    return await this.rteEditor.isVisible();
  }
}