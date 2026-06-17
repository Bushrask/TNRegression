import { Locator, Page, expect } from '@playwright/test';

export class ApplyLeavePage {
    private page: Page;
    readonly reasonDropdown: Locator;
    readonly reasonOption: Locator;
    readonly description: Locator;
    readonly uploadBtn: Locator;
    readonly leaveFromDate: Locator
    readonly returnDate: Locator;
    readonly applyLeaveBtn: Locator;
    readonly errorMessage: Locator;
    readonly successMessage: Locator;
    readonly okButton: Locator  


  constructor(page: Page) {
            this.page = page;
            
// ✅ Scoped popup (important for stability)
  const popup = this.page.locator('.popup-info-body');

  // ✅ Locators
  this.reasonDropdown = this.page.locator('button.reason-select');

  this.reasonOption = 
    this.page.locator(`.reason-dropdown-menu li[data-reason-id="2"]`);

  this.description = this.page.locator('#leave-reason-description');

this.uploadBtn = this.page.locator('button.upload-link');

  this.leaveFromDate = this.page.locator('#dateOfLeave');
  this.returnDate = this.page.locator('#dateOfReturn');

  this.applyLeaveBtn = this.page.locator('#applyForLeaveBtn');

  this.errorMessage = this.page.locator('.error-message-container');

  this.successMessage = this.page.locator('text=Your leave request has been');

  this.okButton = this.page.locator('button:has-text("OK")');

  const datePicker = page.locator('#ui-datepicker-div');
  datePicker.locator('a.ui-state-default');
  datePicker.locator('.ui-state-highlight');
  datePicker.locator('.ui-datepicker-month')
datePicker.locator('.ui-datepicker-year')


  }

  async navigateToApplyLeave() {
    await this.page.locator('.menubar-right li').last().click();
    await this.page.getByRole('menuitem', { name: 'Apply For Leave' }).click();
  }

  async fillLeaveForm() {
    await this.reasonDropdown.click();
    await this.reasonOption.click();

    await this.description.fill('test reason');

    // Leave From Date
    await this.leaveFromDate.click();
    await this.page.getByRole('link', { name: '17' }).click();

    // Return Date
await this.returnDate.click();
    await this.page.getByRole('link', { name: '22' }).click();
  }

  async submitLeave() {
    await this.page.getByRole('button', { name: 'Apply for Leave' }).click();
  }

  async verifyLeaveSuccess() {
    await expect(this.page.getByText('Your leave request has been')).toBeVisible();
    await this.page.getByRole('button', { name: 'OK' }).click();
  }

  
async getCurrentMonthYear() {
  const month = await this.page.locator('.ui-datepicker-month').textContent();
  const year = await this.page.locator('.ui-datepicker-year').textContent();

  return { month, year };
}

async selectFutureStartDate() {
  await this.leaveFromDate.click();

  const datePicker = this.page.locator('#ui-datepicker-div');
  await datePicker.waitFor();

  // all enabled visible days
  const dates = datePicker.locator('a.ui-state-default');

  const count = await dates.count();

  for (let i = 0; i < count; i++) {
    const dayText = await dates.nth(i).textContent();

    const day = Number(dayText);

    const today = new Date().getDate();

    if (day > today) {
      await dates.nth(i).click();
      return day; // return selected start date
    }
  }

  // fallback → next month first date
  await datePicker.locator('.ui-datepicker-next').click();
  await datePicker.locator('a.ui-state-default').first().click();

  return 1;
}

async selectReturnDateAfter3Months(startDay: number) {
  await this.returnDate.click();

  const datePicker = this.page.locator('#ui-datepicker-div');
  await datePicker.waitFor();

  const today = new Date();

  // Calculate future date (+3 months)
  const futureDate = new Date(today);
  futureDate.setMonth(futureDate.getMonth() + 3);

  const targetMonthIndex = futureDate.getMonth();
  const targetYear = futureDate.getFullYear();
  const targetDay = futureDate.getDate();

  // Navigate to correct month/year
  while (true) {
    const currentMonthText = await datePicker.locator('.ui-datepicker-month').textContent();
    const currentYearText = await datePicker.locator('.ui-datepicker-year').textContent();

    const currentMonthIndex = new Date(`${currentMonthText} 1, 2024`).getMonth();
    const currentYear = Number(currentYearText);

    if (currentMonthIndex === targetMonthIndex && currentYear === targetYear) {
      break;
    }

    await datePicker.locator('.ui-datepicker-next').click();
  }

  // Select day (fallback safe)
  const dayLocator = datePicker.locator(`a.ui-state-default:text("${targetDay}")`);

  if (await dayLocator.isVisible()) {
    await dayLocator.click();
  } else {
    // fallback → last available date
    await datePicker.locator('a.ui-state-default').last().click();
  }
}


async fillDatesSmart() {
  const startDay = await this.selectFutureStartDate();
  await this.selectReturnDateAfter3Months(startDay);
}

}
