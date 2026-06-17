import { Given, When, Then } from '@cucumber/cucumber';
import { LoginPage } from "../PageObjects/Login";
import testData  from "../../support/testData";
import { ApplyLeavePage } from '../PageObjects/ApplyLeavePopUp';

let applyLeavePage: ApplyLeavePage;
type UserRole = keyof typeof testData.users;

Given('the user logs in as {string} to apply for leave',
  async function (role: UserRole) {
  
      const loginPage = new LoginPage(this.page);
      await loginPage.loginAs(role);
  this.applyLeavePage = new ApplyLeavePage(this.page);
});


When('user navigates to apply leave page', async function () {
  await this.applyLeavePage.navigateToApplyLeave();
});

When('user fills leave form', async function () {
  await this.applyLeavePage.fillLeaveForm();
});

When('user submits leave request', async function () {
  await this.applyLeavePage.submitLeave();
});

Then('leave should be applied successfully', async function () {
  await this.applyLeavePage.verifyLeaveSuccess();
});
