import { Page, test, expect} from "@playwright/test";    
import { LoginPage, CommonPages, CandidatePages, InstructorPages, MentorPages } from "../PageObjects/Login";

const login = "https://test.teach-now.com"
const homePageUrl = "https://test.teach-now.com/home"        


/* 🔹 Runs before every test in this file
test.beforeEach(async ({ page }) => {
  console.log('This runs before every test');
  page.on('dialog', dialog => dialog.dismiss());
  await page.locator('#close-btn').click();
});*/


test('Non B2B CERT user', async ({page}) => {
    const loginPage = new LoginPage(page);  
    const commonPages = new CommonPages(page);
    const candidatePages = new CandidatePages(page);
    await page.goto(login);

    // Login to user
    await loginPage.login('bushra6@gmail.com', 'te@ch');    
    await page.waitForURL(homePageUrl);
    await page.waitForLoadState('networkidle');

   await page.addLocatorHandler(
    page.locator('#close-btn'),
    async () => {
      await page.locator('#close-btn').click();
    }
   )

    // navigate to common pages
    await commonPages.navigateToCommonPages();
    //navigate to candidate pages
    await candidatePages.navigateToCandidatePages();
})

test('B2B CERT user', async ({page}) => {
    const loginPage = new LoginPage(page);  
    const commonPages = new CommonPages(page);
    const candidatePages = new CandidatePages(page);
    await page.goto(login);

    // Login to user
    await loginPage.login('aawalker@ccps.org', 'te@ch');    
    await page.waitForURL(homePageUrl);
    await page.waitForLoadState('networkidle');

    await page.addLocatorHandler(
    page.locator('#close-btn'),
    async () => {
      await page.locator('#close-btn').click();
     }
    )

    // navigate to common pages
    await commonPages.navigateToCommonPages();
    //navigate to candidate pages
    await candidatePages.navigateToCandidatePages();
})

test('MED user', async ({page}) => {
    const loginPage = new LoginPage(page);  
    const commonPages = new CommonPages(page);
    const candidatePages = new CandidatePages(page);
    await page.goto(login);

    // Login to user
    await loginPage.login('paige.fuller2@icloud.com', 'te@ch');    //arielarosia@yahoo.com add on 
    await page.waitForURL(homePageUrl);
    await page.waitForLoadState('networkidle');

    await page.addLocatorHandler(
    page.locator('#close-btn'),
    async () => {
      await page.locator('#close-btn').click();
    }
   )

    // navigate to common pages
    await commonPages.navigateToCommonPages();
    //navigate to candidate pages
    await candidatePages.navigateToCandidatePages();
})

test('MEL user', async ({page}) => {
    const loginPage = new LoginPage(page);  
    const commonPages = new CommonPages(page);
    const candidatePages = new CandidatePages(page);
    await page.goto(login);

    // Login to user
    await loginPage.login('trevor.miller@phcharter.org', 'te@ch');    
    await page.waitForURL(homePageUrl);
    await page.waitForLoadState('networkidle');

    await page.addLocatorHandler(
    page.locator('#close-btn'),
    async () => {
      await page.locator('#close-btn').click();
    }
   )

    // navigate to common pages
    await commonPages.navigateToCommonPages();
    //navigate to candidate pages
    await candidatePages.navigateToCandidatePages();
})

test('MRnG user', async ({page}) => {
    const loginPage = new LoginPage(page);  
    const commonPages = new CommonPages(page);
    const candidatePages = new CandidatePages(page);
    await page.goto(login);

    // Login to user
    await loginPage.login('francispaolo.pineda@gmail.com', 'te@ch');    
    await page.waitForURL(homePageUrl);
    await page.waitForLoadState('networkidle');

    await page.addLocatorHandler(
    page.locator('#close-btn'),
    async () => {
      await page.locator('#close-btn').click();
    }
   )

    // navigate to common pages
    await commonPages.navigateToCommonPages();
    //navigate to candidate pages
    await candidatePages.navigateToCandidatePages();
})

test('Instructor user', async ({page}) => {
    const loginPage = new LoginPage(page);  
    const commonPages = new CommonPages(page);
    const instructorPages = new InstructorPages(page);
    await page.goto(login);

    // Login to user
    await loginPage.login('robinh@moreland.edu', 'te@ch');    
    await page.waitForURL(homePageUrl);

    // navigate to common pages
    await commonPages.navigateToCommonPages();
    //navigate to instructor pages
    await instructorPages.navigateToInstructorPages();
})

test('Instructor/Mentor user', async ({page}) => {
    const loginPage = new LoginPage(page);  
    const commonPages = new CommonPages(page);
    const instructorPages = new InstructorPages(page);
    await page.goto(login);

    // Login to user
    await loginPage.login('kimberlyh@moreland.edu', 'te@ch');    
    await page.waitForURL(homePageUrl);

    // navigate to common pages
    await commonPages.navigateToCommonPages();
    //navigate to instructor pages
    await instructorPages.navigateToInstructorPages();
})

test('Mentor user', async ({page}) => {
    const loginPage = new LoginPage(page);  
    const mentorPages = new MentorPages(page);
    await page.goto(login);

    // Login to user
    await loginPage.login('deanunnally29021@moreland.edu', 'te@ch');    
    await page.waitForURL(homePageUrl);

    // navigate to common pages
    await mentorPages.navigateToMentorPages();
})