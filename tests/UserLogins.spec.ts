import { Page, Expect, test} from "@playwright/test";    
import { LoginPage } from "../PageObjects/Login";

const login = "https://test.teach-now.com"
const homePageUrl = "https://test.teach-now.com/home"        

test('User Login Tests', async ({page}) => {
    const loginPage = new LoginPage(page);  
    await page.goto(login);

    // Login to user
    await loginPage.login('vatchina2@gmail.com', 'te@ch');    
    await page.waitForURL(homePageUrl);

})