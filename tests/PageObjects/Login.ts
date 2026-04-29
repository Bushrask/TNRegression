import {Locator, Page} from '@playwright/test';
import testData from "../../support/testData";

type UserRole = keyof typeof testData.users;
export class LoginPage {
  constructor(private page: Page) {}

  readonly username = this.page.getByPlaceholder("Enter email address");
  readonly password = this.page.getByPlaceholder("Enter password");
  readonly loginButton = this.page.getByRole("button", { name: "Login" });

  async navigateToLoginPage() {
    await this.page.goto(testData.urls.login);
  }

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.page.waitForTimeout(2000); // Added since button takes time to become active
    await this.loginButton.click();
  }

async loginAs(role: UserRole) {
    const user = testData.users[role];

    if (!user) {
      throw new Error(`User role '${role}' not found in test data`);
    }

    await this.navigateToLoginPage();
    await this.login(user.email, user.password);
    await this.page.waitForURL(testData.urls.home, { timeout: 30000 });
    await this.page.waitForLoadState("domcontentloaded");
  }
}


export class CommonPages{
  readonly page: Page;
  readonly discussionForum: Locator;
  readonly library: Locator;
  readonly clinical: Locator;
  readonly videoLibrary: Locator;
  readonly certification: Locator;
  readonly profile: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.discussionForum = page.getByRole('link', { name: 'Discussion Forum' });
    this.library = page.locator('//*[@id="library"]');
    this.clinical = page.getByRole('link', { name: 'Clinical' });
    this.videoLibrary = page.getByRole('link', { name: 'Video Library' });
    this.certification = page.getByRole('link', { name: 'Certification' });
    this.profile = page.getByAltText('profile picture');

}

  async navigateToCommonPages() {
    
    
    await this.discussionForum.waitFor({ state: "visible", timeout: 20_000 });
    await this.discussionForum.click();
    await this.library.waitFor({ state: "visible", timeout: 20_000 });
    await this.library.click();
    //await this.page.waitForLoadState('load');


try {
  await this.clinical.waitFor({ state: "visible", timeout: 10_000 });
  await this.clinical.click();
  await this.page.waitForLoadState("load");
} catch {
  console.log("Clinical link is not available for this user or role");
}


try {
  await this.certification.waitFor({ state: "visible", timeout: 10_000 });
  await this.certification.click();
  await this.page.waitForLoadState("load");
} catch {
  console.log("Certification link is not available for this user");
}
    
    await this.videoLibrary.waitFor({ state: "visible", timeout: 20_000 });
    await this.videoLibrary.click();
    await this.profile.waitFor({timeout: 20_000 });
    await this.profile.click();
    await this.page.waitForLoadState('load');
    console.log("Finished CommonPages navigation");
  }
}

export class CandidatePages{
  readonly page: Page;
  readonly learn: Locator;
  readonly grades: Locator;
  readonly managePayments: Locator;
  

  constructor(page: Page) {
    this.page = page;
    this.learn = page.getByRole('link', { name: 'Learn' });
    this.grades = page.getByRole('link', { name: 'Grades' });
    this.managePayments = page.locator('//*[@id="managePayments"]');
  
}

async navigateToCandidatePages() {

    await this.learn.waitFor({ state: "visible", timeout: 20_000 });
    await this.learn.click();
    await this.grades.waitFor({ state: "visible", timeout: 20_000 });
    await this.grades.click();
    await this.page.waitForLoadState('domcontentloaded');


  try {
  await this.managePayments.waitFor({ state: "visible", timeout: 10_000 });
  await this.managePayments.click();
  await this.page.waitForLoadState("load");
} catch {
  console.log("Manage Payments link is not available for this user or role");
}

    console.log("Finished CandidatePages navigation");

  /*const isVisible = await this.managePayments.isVisible();
if (isVisible) {
  await Promise.all([
    this.page.waitForLoadState('networkidle'),
    this.managePayments.click()
  ]);
} else {
  console.log("Manage Payments link is not visible for this user");
}*/

    
  }
}

  export class InstructorPages{
  readonly page: Page;
  readonly teach : Locator;
  readonly reports: Locator;
  readonly syllabus: Locator;
  readonly mentor: Locator;

  constructor(page: Page) {
    this.page = page;
    this.teach = page.getByRole('link', { name: 'Teach' });
    this.reports = page.getByRole('link', { name: 'Reports' });
    this.syllabus = page.getByRole('link', { name: 'Syllabus' });  
    this.mentor = page.getByRole('link', { name: 'Mentor' });
}
async navigateToInstructorPages() {
  
    await this.teach.waitFor({ state: "visible", timeout: 10_000 });
    await this.teach.click();
    await this.reports.waitFor({ state: "visible", timeout: 10_000 }); 
    await this.reports.click();
    await this.syllabus.waitFor({ state: "visible", timeout: 10_000 });
    await this.syllabus.click();
    await this.page.waitForLoadState('load');
    console.log("Finished InstructorPages navigation");
}
}

  export class MentorPages{
  readonly page: Page;
  readonly profile : Locator;
  readonly activity: Locator;

  constructor(page: Page) {
    this.page = page;
    this.profile = page.locator('//*[@id="topBandHolder"]/div[2]/div/header/div/div/div/nav/ul/li[3]/div/a/img');
    this.activity = page.getByRole('link', { name: 'Activity 2: Mentor Evaluation for InTASC Standards 1, 2, and 3' });
  }
async navigateToMentorPages() {
    await this.activity.waitFor({ state: "visible", timeout: 10_000 });
    await this.activity.click();
    await this.profile.waitFor({ state: "visible", timeout: 10_000 });
    await this.profile.click();
    await this.page.waitForLoadState('domcontentloaded'); 
    
  }
}