import { Page, Expect, test} from "@playwright/test";    
import { LoginPage, CommonPages, CandidatePages } from "../PageObjects/Login";

const login = "https://test.teach-now.com"
const homePageUrl = "https://test.teach-now.com/home"        

test('CERT user', async ({page}) => {
    const loginPage = new LoginPage(page);  
    const commonPages = new CommonPages(page);
    const candidatePages = new CandidatePages(page);
    await page.goto(login);

    // Login to user
    await loginPage.login('vatchina2@gmail.com', 'te@ch');    
    await page.waitForURL(homePageUrl);

    // navigate to common pages
    //await commonPages.navigateToCommonPages();
    await candidatePages.navigateToCandidatePages();
})