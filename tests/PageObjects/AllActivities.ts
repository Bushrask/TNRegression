import { Page, Locator } from "@playwright/test";
import { ActivityValidator } from "./ActivityValidator";
import { ActivityPage } from "./ActivityPage";

export class AllActivitiesPage {
  private readonly validator: ActivityValidator;
  private readonly ActivityPage: ActivityPage;
  // use ActivityPage to handle submissions

  constructor(private readonly page: Page) {
    this.validator = new ActivityValidator(page);
    this.ActivityPage = new ActivityPage(page);
    // submission handled via ActivityPage
  }

  private activityRows = () =>
    this.page.locator("#parentContentHolder .activity-list-table tbody tr");

  private descTab: Locator =
    this.page.getByRole("tab").first();


  async openActivitiesSequentially(
    perActivityAction: () => Promise<void>
  ): Promise<void> {
    let count = await this.activityRows().count();

    for (let i = 0; i < count; i++) {
      let row = this.activityRows().nth(i);

      console.log(`▶ Opening activity ${i + 1}/${count}`);
      await row.click();
      await this.descTab.waitFor({ state: 'visible', timeout: 10000 });
      await this.page.waitForLoadState("domcontentloaded");

      await this.ActivityPage.openSubmissionsTab(); // click on submissions tab to open acitvity submisions window

      await this.validator.validateCurrentActivity();
      
      await perActivityAction(); //

      count = await this.activityRows().count();
    }
  }
}
