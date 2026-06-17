import { Before, After, setDefaultTimeout, AfterStep } from "@cucumber/cucumber";

setDefaultTimeout(240*1000); // 4 minutes


  Before(async function () {
  await this.init();



await this.page.addLocatorHandler(
  this.page.locator('#close-btn'),
  async () => {
    // Optional: skip specific popup
    const title = await this.page.locator('#popup-div .modal-content.popup-info-container').textContent();

    if (title && title.includes('Memorandum of Understanding (MoU)')) {
      return; // skip MoU popup
    }

    await this.page.locator('#close-btn').click();
  }
);
  })



After(async function () {
  await this.cleanup();
});


AfterStep(async function ({ result }) {
  if (result?.status === "FAILED") {
    const path = `screenshots/error_${Date.now()}.png`;
    const screenshot = await this.page.screenshot({path, fullPage: true });
    this.attach(screenshot, "image/png");
  }
});