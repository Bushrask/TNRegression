import { Page, Locator } from "@playwright/test";
import { ActivityValidator } from "./ActivityValidator";
import { ActivityPage } from "./ActivityPage";

export class AllActivitiesPage {
  private readonly validator: ActivityValidator;
  private readonly ActivityPage: ActivityPage;

  constructor(private readonly page: Page) {
    this.validator = new ActivityValidator(page);
    this.ActivityPage = new ActivityPage(page);
  }

  private activityRows = () =>
    this.page.locator("#parentContentHolder .activity-list-table tbody tr");


  async openActivitiesSequentially(
    perActivityAction: () => Promise<void>
  ): Promise<void> {
    let count = await this.activityRows().count();

    for (let i = 0; i < count; i++) {
      let row = this.activityRows().nth(i);

      console.log(`▶ Opening activity ${i + 1}/${count}`);
      await row.click();
      await this.page.waitForLoadState("load");

      await this.ActivityPage.openSubmissionsTab(); // click on submissions tab to open acitvity submisions window
      
      await this.validator.validateCurrentActivity();

      await perActivityAction(); //

      await this.page.waitForSelector(".activity-list-table");

      count = await this.activityRows().count();
    }
  }
}
