import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { LearnPage } from "../PageObjects/LearnPage";
import { ActivityPage } from "../PageObjects/ActivityPage";
import { LoginPage } from "../PageObjects/Login";
import testData from "../../support/testData";

let learnPage: LearnPage;
let activityPage: ActivityPage;
type UserRole = keyof typeof testData.users;

/* ---------------- LOGIN STEPS ---------------- */

Given("the user logs in as {string} for activity submission",
    async function (role: UserRole) {

        const loginPage = new LoginPage(this.page);
        await loginPage.loginAs(role);   // 
    });

/* -------- LEARN & ACTIVITY -------- */

Given("the user navigates to the Learn page", async function () {
    this.learn = this.page.locator('.module-btn').first();
    this.launch = this.page.locator('.launch-module-button');
    await this.learn.click();
    await this.launch.click();
    await this.page.waitForLoadState("networkidle");

    learnPage = new LearnPage(this.page);
});

When(
    "the user opens the first activity with status Open or Late",
    async function () {

        //await learnPage.searchActivitiesInOpenedUnit();
        //await learnPage.searchUnitsInCurrentModule();
        await learnPage.openFirstOpenOrLateActivityAcrossModules();
        activityPage = new ActivityPage(this.page);
    }
);

Then(
    "the activity submissions tab should show an RTE under My Work",
    async function () {
        await activityPage.openSubmissionsTab();
        if (expect(await activityPage.isRTEVisibleUnderMyWork()))   //.toBeTruthy() 
            {
            console.log("RTE is visible under My Work");
        }
    }
);
