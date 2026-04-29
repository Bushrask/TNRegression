import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { LoginPage } from "../PageObjects/Login";
import testData from "../../support/testData";

type UserRole = keyof typeof testData.users;
let loginPage: LoginPage;

Given("the user is on the login page", async function () {
  loginPage = new LoginPage(this.page);
  await loginPage.navigateToLoginPage();
});

When("the user logs in as {string}", async function (role: UserRole) {
  const loginPage = new LoginPage(this.page);
  await loginPage.loginAs(role);
});

Then("the user should be redirected to the home page", async function () {
  expect(this.page.url()).toContain("/home");
});





