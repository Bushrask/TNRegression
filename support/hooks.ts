import { Before, After, setDefaultTimeout, AfterStep } from "@cucumber/cucumber";

setDefaultTimeout(90 * 1000); // 90 seconds

Before(async function () {
  await this.init();

  await this.page.addLocatorHandler(
    this.page.locator('#close-btn'),
    async () => {
      await this.page.locator('#close-btn').click();
    }
  );
});

After(async function () {
  await this.cleanup();
});


AfterStep(async function ({ result }) {
  if (result?.status === "FAILED") {
    const screenshot = await this.page.screenshot({ fullPage: true });
    this.attach(screenshot, "image/png");
  }
});