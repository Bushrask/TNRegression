import {Locator, Page} from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator
  readonly loginButton: Locator

  constructor(page: Page) {
    this.page = page;
    this.username = page.getByPlaceholder('Email address');
    this.password = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });

}
  async login(username: string, password: string) {
    await this.username.fill(username); 
    await this.password.fill(password);
    await this.page.waitForTimeout(2500);
    await this.loginButton.click({force: true});
  }
}

export class CommonPages{
  readonly page: Page;
  readonly discussionForum: Locator;
  readonly library: Locator;
  readonly clinical: Locator;
  readonly videoLibrary: Locator;
  readonly profile: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.discussionForum = page.getByRole('link', { name: 'Discussion Forum' });
    this.library = page.locator('//*[@id="library"]');
    this.clinical = page.getByRole('link', { name: 'Clinical' });
    this.videoLibrary = page.getByRole('link', { name: 'Video Library' });
    this.profile = page.getByTitle('Profile ');
}

  async navigateToCommonPages() {
    await this.discussionForum.click();
    await this.page.waitForLoadState('load');
    await this.library.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.clinical.click();
    await this.page.waitForLoadState('load');
    await this.videoLibrary.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.profile.click();
    await this.page.waitForLoadState('load');
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
  const isVisible = await this.managePayments.isVisible();
if (isVisible) {
  await Promise.all([
    this.page.waitForLoadState('networkidle'),
    this.managePayments.click()
  ]);
} else {
  console.log("Manage Payments link is not visible for this user");
}
    await this.learn.click();
    await this.page.waitForLoadState('load'); 
    await this.grades.click();
    await this.page.waitForLoadState('domcontentloaded');
    
  }}

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
  const isVisible = await this.mentor.isVisible();
if (isVisible) {
  await Promise.all([
    this.page.waitForLoadState('networkidle'),
    this.mentor.click()
  ]);
} else {
  console.log("Manage Payments link is not visible for this user");
}
    await this.teach.click();
    await this.page.waitForLoadState('load'); 
    await this.reports.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.syllabus.click();
    await this.page.waitForLoadState('load');
    
  }}

  export class MentorPages{
  readonly page: Page;
  readonly profile : Locator;
  readonly activity: Locator;

  constructor(page: Page) {
    this.page = page;
    this.profile = page.getByTitle('Profile ');
    this.activity = page.getByRole('link', { name: 'Activity 2: Mentor Evaluation for InTASC Standards 1, 2, and 3' });
  }
async navigateToMentorPages() {
    await this.activity.click();
    await this.page.waitForLoadState('load');
    await this.profile.click();
    await this.page.waitForLoadState('load'); 
    
  }}