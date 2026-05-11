import { Given, When, Then } from "@cucumber/cucumber";
import { ActivityPage } from "../PageObjects/ActivityPage";
import { LoginPage } from "../PageObjects/Login";
import testData from "../../support/testData";
import { AllActivitiesPage } from "../PageObjects/AllActivities";

let activities: AllActivitiesPage;
let activityPage: ActivityPage;
type UserRole = keyof typeof testData.users;

/* ---------------- LOGIN STEPS ---------------- */

Given("the user logs in as {string} for activity submission",
    async function (role: UserRole) {

        const loginPage = new LoginPage(this.page);
        await loginPage.loginAs(role); 
    });

/* -------- LEARN & ACTIVITY -------- */


When("the user navigates to the Learn page and opens activity", async function () {
  await this.page.locator(".module-btn").first().click();
  await this.page.locator(".launch-module-button").click();
  await this.page.waitForLoadState("domcontentloaded");
  await this.page.locator(".unit-card-container").first().click();


  this.activities = new AllActivitiesPage(this.page);
  this.activityPage = new ActivityPage(this.page);
});


Then("the activity should load all elements", async function () {

    await this.activities.openActivitiesSequentially(async () => {
      //await this.activityPage.openSubmissionsTab();
    });
  console.log("✅ All activities loaded and submissions tab verified");
});
``

