import { Page, expect, Locator } from "@playwright/test";

export class ClinicalPage {
    private page: Page;
    readonly schoolNameInput: Locator;
    readonly schoolPhoneInput: Locator;
    readonly schoolAddressInput: Locator
    readonly schoolWebsiteInput: Locator;
    readonly supervisorNameInput: Locator;
    readonly supervisorEmailInput: Locator;
    readonly supervisorPositionInput: Locator;
    readonly gradesCheckboxes: Locator;
    readonly schoolCountryDropdown: Locator;
    readonly schoolCountrOption: Locator;
    readonly schoolStateDropdown: Locator
    readonly schoolStateOption: Locator;
    readonly schoolSettingDropdown: Locator;
    readonly schoolSettingOption: Locator;
    readonly mentorFirstNameInput: Locator;
    readonly mentorLastNameInput: Locator;
    readonly mentorEmailInput: Locator;
    readonly mentorPositionInput: Locator;
    readonly mouPopup: Locator;
    readonly mouStatus: Locator;
    readonly viewSchoolsListBtn: Locator;
    readonly confirmationPopup: Locator;
    readonly schoolListPopup: Locator;
    readonly schoolListItems: Locator;
    readonly selectSchoolButton: Locator;
    readonly removeSchoolButton: Locator;
    attach: any;

    constructor(page: Page) {
        this.page = page;
        this.schoolNameInput = page.locator('input.school-name[type="text"]');
        this.schoolPhoneInput = page.locator('input.school-phone[type="text"]');
        this.schoolAddressInput = page.locator('input.school-address[type="text"]');
        this.schoolWebsiteInput = page.locator('input.school-website[type="text"]');
        this.supervisorNameInput = page.locator('input.supervisor-name[type="text"]');
        this.supervisorEmailInput = page.locator('input.supervisor-email[type="text"]');
        this.supervisorPositionInput = page.locator('input.supervisor-position[type="text"]');
        this.gradesCheckboxes = page.locator('fieldset.grades-checkbox .checkbox-label input[type="checkbox"]');
        this.schoolCountryDropdown = page.locator('.school-country-container .dropdown-toggle');
        this.schoolCountrOption = page.locator('#school-country-listbox li');
        this.schoolStateDropdown = page.locator('.school-state-container .dropdown-toggle');
        this.schoolStateOption = page.locator('#school-state-listbox li');
        this.schoolSettingDropdown = page.locator('.school-setting-container .dropdown-toggle');
        this.schoolSettingOption = page.locator('.dropdown-menu li', { hasText: 'International' }).nth(1);
        this.mentorFirstNameInput = page.locator('.mentor-first');
        this.mentorLastNameInput = page.locator('.mentor-last');
        this.mentorEmailInput = page.locator('.mentor-email');
        this.mentorPositionInput = page.locator('.mentor-position');
        this.mouPopup = page.locator('#popup-div .modal-content.popup-info-container');
        this.mouStatus = page.locator('.mou-status-text');
        this.confirmationPopup = page.locator('#popup-div #popup-body-text')
        this.viewSchoolsListBtn = page.locator('.view_school_list');
        this.schoolListPopup = page.locator('#schoolMoUDetailsPopup');
        this.schoolListItems = page.locator('.schoolMoU-details-list [role="row"]');
        this.selectSchoolButton = page.locator('#schoolMoUDetailsPopup .save-school-details');
        this.removeSchoolButton = page.locator('.delete-school');
    }



    // -------- NAVIGATION --------
    async goToClinicalPage() {
        await this.page.locator('#clinical').click(); // Clinical menu 
    }

    async goToSuggestSchoolSection() {
        // Scroll to school section container
        await this.page.locator('text=Clinical School Details').first().scrollIntoViewIfNeeded(); // stable section header 
    }

    // -------- FORM ACTIONS --------

    async fillCommondetails() {
        await this.schoolPhoneInput.fill('9999999999');       // Phone
        await this.schoolAddressInput.fill('Mumbai');           // Address
        await this.schoolWebsiteInput.fill('https://abc.com');  // Website

        await this.gradesCheckboxes.nth(3).check();
        await this.gradesCheckboxes.nth(5).check();
        await this.schoolSettingDropdown.scrollIntoViewIfNeeded();
        await this.schoolSettingDropdown.click();
        await this.schoolSettingOption.click(); //International
        await this.page.keyboard.press('Escape');

        // -------- CONDITIONAL MENTOR LOGIC --------
        const mentorSection = this.page.locator('text=Confirmed mentors'); // 
        if (await mentorSection.isVisible()) {
            console.log('✅ Mentor already exists → skipping mentor');
        } else {
            console.log('✅ No mentor → filling mentor details');

            await this.mentorFirstNameInput.fill('Emily');
            await this.mentorLastNameInput.fill('Smith');
            await this.mentorEmailInput.fill('mentor@test.com');
            await this.mentorPositionInput.fill('Teacher');
        }

    }

    async fillSchoolAndMentorDetails() {
        // ---- SCHOOL DETAILS ----

        await this.schoolNameInput.fill('ABC School');       // School Name


        // ---- SUPERVISOR  ----
        await this.supervisorNameInput.fill('John Supervisor');
        await this.supervisorEmailInput.fill('supervisor@email.com');
        await this.supervisorPositionInput.fill('Principal');

        // ---- GRADES, SCHOOL LOCATION,SETTINGS ----

        await this.schoolCountryDropdown.click()
        await this.schoolCountrOption.filter({ hasText: 'Cuba' }).click();
        await this.schoolStateDropdown.click();
        await this.schoolStateOption.filter({ hasText: 'Pinar del Río' }).click();


    }

    async clickSave() {
        await this.page.locator('#saveClinicalFormBtn').waitFor();
        await this.page.locator('#saveClinicalFormBtn').click();
        await this.removeSchoolButton.isEnabled();
        //await this.page.waitForLoadState('domcontentloaded');
    }

    // -------- POPUP --------
    async verifyMouPopupVisible() {
        await this.mouPopup.waitFor({ state: 'visible' }); //WORK ON MODAL CONTAINER TO AVOID FLAKINESS
        await expect(this.mouPopup).toBeVisible();
        await this.mouPopup.focus();
    }

    async handleMouPopup() {
        await this.page.locator('#confirm-yes-button').click();
    }

    // -------- VALIDATIONS --------
    async verifyMouSent() {
        await this.confirmationPopup.waitFor({ state: 'visible' });
        await expect(this.confirmationPopup).toContainText('A Memorandum of Understanding (MoU) document has been sent to your school supervisor');
        await this.page.locator('#popup-div button.alert-ok-button').click(); // close popup after verification
        await this.removeSchoolButton.isEnabled();
        // await this.page.waitForLoadState('domcontentloaded'); // wait for any potential page updates after closing popup
    }


    async getMouStatus(): Promise<boolean> {
        const isVisible = await this.mouStatus.isVisible();

        if (isVisible) {

            const text = await this.mouStatus.textContent();

            // ✅ Case 1: MOU Sent
            if (text?.includes('Sent to School Supervisor')) {
                await expect(this.mouStatus).toContainText('Sent to School Supervisor');
                return true;
            }

            // ✅ ✅ NEW Case 2: B2B / Pending Confirmation
            else if (text?.includes('MOU will be generated after school details are confirmed')) {
                await expect(this.mouStatus).toContainText(
                    'MOU will be generated after school details are confirmed'
                );
                return true;
            }
        }

        // ✅ Default fallback (existing behavior)
        return false;
    }


    // -------- REMOVE SCHOOL --------
    async clickRemoveSchool() {
        await expect(this.removeSchoolButton).toBeEnabled();
        await this.removeSchoolButton.click();

    }

    async verifySuggestSchoolButtonVisible() {
        await expect(
            this.page.locator('.add-more-schools')
        ).toBeVisible(); // 
    }


    // -------- SCHOOL LIST FLOW --------

    async openSchoolListPopup() {
        await this.viewSchoolsListBtn.click();
        await this.schoolListPopup.waitFor({ state: 'visible' });
    }

    async selectSchoolFromPopup() {
        await this.schoolListItems.first().click();
        await this.page.pause()// select first school
        //await this.page.waitForTimeout(2500);
        await this.selectSchoolButton.waitFor({ state: 'visible' });
        await this.selectSchoolButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
}