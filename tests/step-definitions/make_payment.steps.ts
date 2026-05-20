import { Given, When, Then } from "@cucumber/cucumber";
import { LoginPage } from "../PageObjects/Login";
import testData  from "../../support/testData";
import { expect } from "@playwright/test";
import { MakePaymentPage } from "../PageObjects/make_payment";

type UserRole = keyof typeof testData.users;

/* ---------------- LOGIN STEPS ---------------- */

Given("the user logs in as {string} role",
  async function (role: UserRole) {

    const loginPage = new LoginPage(this.page);
    await loginPage.loginAs(role);
  });

/* -------- MANAGE PAYMENT -------- */

When("the user navigates to the Manage Payment page and opens Make Payments pop up", async function () {
  await this.page.locator('//*[@id="managePayments"]').click();
  await this.page.waitForLoadState("domcontentloaded");
  await this.page.locator('#paymentQR').click();

  const MakePayment = new MakePaymentPage(this.page);
  await MakePayment.makePayment();
});

/* -------- PROFILE -------- */

When("the user navigates to the Profile page and opens Make Payments pop up", async function () {
  await this.page.getByAltText('profile picture').click();
  await this.page.waitForLoadState("domcontentloaded");
  await this.page.locator('#paymentQR').click();

  const MakePayment = new MakePaymentPage(this.page);
  await MakePayment.makePayment();
});

Then("the user should be able to make successful payment using PayPal", async function () {

  await this.page.waitForTimeout(6000); // Wait for the payment process to complete and the success message to appear
  await expect(this.page.getByText('Payment Successful!')).toBeVisible();
  console.log("Payment Made successfully via PayPal");
});
``

