import { Locator, Page } from '@playwright/test';


export class MakePaymentPage {
    readonly page: Page;
    readonly enterAmount: Locator;
    readonly customPaymentAmount: Locator;
    readonly payPalOption: Locator;
    readonly nameField: Locator;
    readonly addressLine1Field: Locator;
    readonly countryDropdown: Locator;
    readonly stateDropdown: Locator;
    readonly cityField: Locator;
    readonly zipCodeField: Locator
    readonly phoneNumberField: Locator;
    readonly useForFutureCheckbox: Locator
    readonly checkoutButton: Locator;
    readonly ppcheckout: Locator;
    readonly paypalConsentButton: Locator;
    attach: any;


    constructor(page: Page) {
        this.page = page;
        const page1Promise = page.waitForEvent('popup');

        this.enterAmount = page.getByRole('radio', { name: 'Enter amount' });
        this.customPaymentAmount = page.getByRole('spinbutton', { name: 'Custom payment amount' });
        this.payPalOption = page.getByRole('radio', { name: 'Pay Pal' });
        this.nameField = page.getByRole('textbox', { name: 'Name' });
        this.addressLine1Field = page.getByRole('textbox', { name: 'Address line 1' });
        this.countryDropdown = page.getByLabel('Country');
        this.stateDropdown = page.getByLabel('State');
        this.cityField = page.getByRole('textbox', { name: 'City' });
        this.zipCodeField = page.getByRole('textbox', { name: 'Zip code' });
        this.phoneNumberField = page.getByRole('textbox', { name: 'Phone number' });
        this.useForFutureCheckbox = page.getByRole('checkbox', { name: 'Use this method for future' });
        this.checkoutButton = page.getByRole('button', { name: 'CHECKOUT' });
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

    async makePayment() {

        await this.enterAmount.check();
        await this.customPaymentAmount.click();
        await this.customPaymentAmount.fill('1');
        await this.payPalOption.check();
        await this.nameField.click();
        await this.nameField.fill('test billingname');
        await this.addressLine1Field.click();
        await this.addressLine1Field.fill('test addressline1');
        await this.countryDropdown.click();
        await this.countryDropdown.selectOption('840');
        await this.stateDropdown.click();
        await this.stateDropdown.selectOption('41');
        await this.cityField.click();
        await this.cityField.fill('test city');
        await this.zipCodeField.click();
        await this.zipCodeField.fill('12345');
        await this.phoneNumberField.click();
        await this.phoneNumberField.fill('+36554875');
        await this.useForFutureCheckbox.uncheck();
        await this.checkoutButton.click();
        await this.page.waitForTimeout(15000);
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

    }
}