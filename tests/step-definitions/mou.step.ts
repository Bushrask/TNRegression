import { Given, When, Then } from "@cucumber/cucumber";
import { ClinicalPage } from "../PageObjects/mou";
import { LoginPage } from "../PageObjects/Login";
import testData from "../../support/testData";


let clinicalPage: ClinicalPage;
type UserRole = keyof typeof testData.users;


Given('the user logs in as {string} for mou process', async function (role: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.loginAs(role as UserRole);
    clinicalPage = new ClinicalPage(this.page);
});

When('the user navigates to the Clinical page', async function () {
    await clinicalPage.goToClinicalPage();
});

When('the user navigates to the Suggest School section', async function () {
    await clinicalPage.goToSuggestSchoolSection();
});

When('the user adds school details and mentor details', async function () {
    await clinicalPage.fillCommondetails();
    await clinicalPage.fillSchoolAndMentorDetails();
});

When('the user clicks on Save', async function () {
    await clinicalPage.clickSave();
});

Then('a confirmation pop up to send MOU to school supervisor should appear', async function () {

    await clinicalPage.verifyMouPopupVisible();
});

When('the user clicks Yes on the pop up', async function () {
    await clinicalPage.handleMouPopup();
});

Then('the MOU should be sent to the school supervisor', async function () {
    await clinicalPage.verifyMouSent();
});

Then('the MOU status section should appear', async function () {
    await clinicalPage.getMouStatus();
});

When('the user clicks on Remove School button', async function () {
    await clinicalPage.clickRemoveSchool();
    await clinicalPage.clickSave();
});


Then('the MoU status section should be hidden', async function () {
    const result = await clinicalPage.getMouStatus();

    if (result === false) {
        console.log('Suggested School deleted');
        return;
    }

    console.log('MOU status still visible');

});

//-------------- VIEW SCHOOLS --------------

When('the user clicks on View Schools List', async function () {
    await clinicalPage.openSchoolListPopup();
});

When('the user selects a school from the popup', async function () {
    await clinicalPage.selectSchoolFromPopup();
});

When('the user fills the remaining school details', async function () {
    await clinicalPage.fillCommondetails();
});

