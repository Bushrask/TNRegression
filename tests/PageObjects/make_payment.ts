import { Locator, Page } from '@playwright/test';



export class MakePaymentPage {
    readonly page: Page;
    readonly enterAmount: Locator;
    readonly customPaymentAmount: Locator;
    readonly payPalOption: Locator;
    readonly nameField: Locator;
    readonly billingAddressLine1Field: Locator;
    readonly billingcountryDropdown: Locator;
    readonly billingstateDropdown: Locator;
    readonly billingcityField: Locator;
    readonly billingzipCodeField: Locator
    readonly billingphoneNumberField: Locator;
    readonly mailingAddressLine1Field: Locator;
    readonly mailingcountryDropdown: Locator;
    readonly mailingstatefield: Locator;
    readonly mailingcityField: Locator;
    readonly mailingzipCodeField: Locator
    readonly mailingphoneNumberField: Locator;
    readonly useForFutureCheckbox: Locator
    readonly checkoutButton: Locator;
    readonly checkoutTestPrepButton: Locator;
    readonly ppcheckout: Locator;
    readonly paypalConsentButton: Locator;
    attach: any;


    constructor(page: Page) {
        this.page = page;
        this.enterAmount = page.getByRole('radio', { name: 'Enter amount' });
        this.customPaymentAmount = page.getByRole('spinbutton', { name: 'Custom payment amount' });
        this.payPalOption = page.getByRole('radio', { name: 'Pay Pal' });
        this.nameField = page.getByRole('textbox', { name: 'Name' });
        this.billingAddressLine1Field = page.locator('#billing-address-1');
        this.billingcountryDropdown = page.locator('#billing-country');
        this.billingstateDropdown = page.locator('#billing-state');
        this.billingcityField = page.locator('#billing-city');
        this.billingzipCodeField = page.locator('#billing-zipcode');
        this.billingphoneNumberField = page.locator('#billing-phone');
        this.mailingAddressLine1Field = page.locator('#mailing-address-1');
        this.mailingcountryDropdown = page.locator('#mailing-country');
        this.mailingstatefield = page.locator('#mailing-state');
        this.mailingcityField = page.locator('#mailing-city');
        this.mailingzipCodeField = page.locator('#mailing-zipcode');
        this.mailingphoneNumberField = page.locator('#mailing-phone');
        this.useForFutureCheckbox = page.locator('#make-default-checkbox');
        this.checkoutButton = page.locator('#checkoutOrder');
        this.checkoutTestPrepButton = page.locator('#checkoutTestPrepOrder');
        this.ppcheckout = page.frameLocator('iframe.zoid-visible[name*="ppbutton"]').getByRole('button', { name: 'PayPal Checkout' });
        this.paypalConsentButton = page.getByTestId('consentButton');
    }

    async safelyExecute(stepName: string, action: () => Promise<void>) {
        try {
            await action();
        } catch (error) {
            console.error(`❌ Error in step: ${stepName}`, error);

            // ✅ Capture screenshot
            const screenshot = await this.page.screenshot({ fullPage: true });

            // ✅ Attach to Cucumber report
            if (this.attach) {
                this.attach(screenshot, "image/png");
            }
        }
    }

    async makeAnyAmountPayment() {


        await this.enterAmount.check();
        await this.customPaymentAmount.click();
        await this.customPaymentAmount.fill('1');
        await this.payPalOption.check();

        await this.fillBillingInfo();
    }

    async fillBillingInfo() {
        await this.safelyExecute("fill billing info", async () => {
            await this.nameField.click();
            await this.nameField.fill('test billingname');
            await this.billingAddressLine1Field.click();
            await this.billingAddressLine1Field.fill('test addressline1');
            await this.billingcountryDropdown.click();
            await this.billingcountryDropdown.selectOption('840');
            await this.billingstateDropdown.click();
            await this.billingstateDropdown.selectOption('41');
            await this.billingcityField.click();
            await this.billingcityField.fill('test city');
            await this.billingzipCodeField.click();
            await this.billingzipCodeField.fill('12345');
            await this.billingphoneNumberField.click();
            await this.billingphoneNumberField.fill('+36554875');
            await this.useForFutureCheckbox.uncheck();
            await this.checkoutButton.click();

            await this.paypal();
        }
        )
    }

    async fillMailingInfo() {
        await this.safelyExecute("fill mailing info", async () => {

            await this.mailingAddressLine1Field.click();
            await this.mailingAddressLine1Field.fill('test addressline1');
            await this.mailingcountryDropdown.click();
            await this.mailingcountryDropdown.selectOption('13');
            await this.mailingstatefield.click();
            await this.mailingstatefield.fill('test state');
            await this.mailingcityField.click();
            await this.mailingcityField.fill('test city');
            await this.mailingzipCodeField.click();
            await this.mailingzipCodeField.fill('12345');

            /*if (await this.mailingphoneNumberField.isVisible({ timeout: 5000 }) && await this.useForFutureCheckbox.isVisible() && await this.checkoutButton.isVisible()) {
                await this.mailingphoneNumberField.click();    
                await this.mailingphoneNumberField.fill('+36554875');
                await this.useForFutureCheckbox.uncheck();
                await this.checkoutButton.click();

            }*/
        })
    }

    async paypal() {

        await this.safelyExecute("PayPal", async () => {
            await this.page.waitForTimeout(10000);
            await this.ppcheckout.waitFor({ 'state': 'visible', timeout: 10000 });

            const [paypalPage] = await Promise.all([
                this.page.waitForEvent('popup'),
                this.ppcheckout.click()
            ]);

            await paypalPage.waitForLoadState();


            await Promise.race([
                paypalPage.locator("#email").waitFor({ timeout: 10000 }),
                paypalPage.locator("#consentButton").waitFor({ timeout: 10000 })
            ]);


            // ✅ If email field is present
            if (await paypalPage.locator("#email").isVisible({ timeout: 5000 }).catch(() => false)) {
                await paypalPage.locator("#email").fill("rahul.singh@zeuslearning.com");
                // ✅ If next button is present
                if (await paypalPage.locator("#btnNext").isVisible().catch(() => false)) {
                    await paypalPage.locator("#btnNext").click();
                }
                await paypalPage.locator("#password").fill("zeus@123");
                await paypalPage.locator("#btnLogin").click();
            }
            await paypalPage.locator('#consentButton').click();
            await paypalPage.waitForEvent('close')
            await this.page.bringToFront();
        })
    }

    async purchaseTestPrep() {
        await this.page.waitForTimeout(5000);
        await this.page.pause();

        await this.safelyExecute("Purchase Test Prep", async () => {
            //const checkboxes = this.page.locator('.testprep-list-body .test');

            const checkboxes = this.page.locator(
                '.testprep-list-body .test:not(:has-text("PURCHASED")) input[type="checkbox"]'
            );

            const count = await checkboxes.count();

            let isCheckboxChecked = false;


            for (let i = 0; i < count; i++) {
                const checkbox = checkboxes.nth(i);


                if (await checkbox.isVisible() && await checkbox.isEnabled()) {
                    await checkbox.check(); // ✅ no force
                    isCheckboxChecked = true;
                    break; // ✅ first valid checkbox only
                }
            }



            if (isCheckboxChecked) {
                await this.page.locator('#nextBtn').waitFor({ 'state': 'visible' });
                await this.page.locator('#nextBtn').click();
                await this.payPalOption.check();
                await this.checkoutTestPrepButton.waitFor({ 'state': 'visible' });
                await this.checkoutTestPrepButton.click();

                await this.paypal();

            }
            else {
                throw new Error('No enabled checkbox found, so Next button was not clicked');
            }
        });
    };


    async makeParchmentPayment() {
        await this.safelyExecute("Make Parchment Mailing Payment", async () => {
            await this.page.locator('#payment-parchment').check();
            await this.page.locator('#parchment-shipping-4').check();
            await this.fillMailingInfo();
            await this.payPalOption.check();
            await this.fillBillingInfo();
            await this.paypal();

        });
    }
}