import { Before, After, setDefaultTimeout, AfterStep } from "@cucumber/cucumber";

setDefaultTimeout(240*1000); // 4 minutes


Before(async function () {
  await this.init();

  this.skipPopupHandler = false;
  

/*await this.page.addLocatorHandler(
  this.page.locator('#close-btn'),
  async () => {
    const isMouPopupVisible = await this.page
      .locator('#popup-div .modal-content.popup-info-container') 
      .isVisible()
      .catch(() => false);

    // ❗ skip closing if it's MOU popup
    if (!isMouPopupVisible) {
      await this.page.locator('#close-btn').click();
    }
  }
);*/


await this.page.addLocatorHandler(
  this.page.locator('.non-mou-popup #close-btn'), // ✅ scope here
  async () => {
    await this.page.locator('.non-mou-popup #close-btn').click();
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