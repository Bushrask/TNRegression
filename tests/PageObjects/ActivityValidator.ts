import { expect, Page } from "@playwright/test";
import { ActivityPage } from "./ActivityPage";
import { setDefaultTimeout } from "@cucumber/cucumber";

setDefaultTimeout(100000); // 100 seconds

export class ActivityValidator {
  private readonly ActivityPage: ActivityPage;
  attach: any;


  constructor(private readonly page: Page) {
    this.ActivityPage = new ActivityPage(page);

  }

  // Centralized Locators
  private readonly locators = {
    video: this.page.locator("#lessonRubricsContainer"),
    file: this.page.frameLocator(".cke_wysiwyg_frame ").locator("body"), //can also use 'div[role="application"]#cke_editor1'
    annotation: this.page.locator(".annotation-text-container "),
    assessment: this.page.locator("#self-feedback .conversation-title", { hasText: "My Evaluation Comment" }),
    readonly: this.page.locator(".status-text", { hasText: "Read Only" }).first(),
    studentDataEval: this.page.locator("#studentEvaluation[role='table']"),
    multiDataEval: this.page.locator("#self-evaluation .criteria-container"),

    videorubrics: this.page.locator("#lessonRubricsContainer"),
    annotation_text: this.page.getByRole("textbox").first(),
    annotation_submit: this.page.locator(".submit-annotation"),
    assessment_rte: this.page.locator("#cke_editor"),
    sde_checkbox: this.page.getByRole("checkbox").first(),
    sde_editbox: this.page.locator("#student-rating-1-30"),
    sde_dd: this.page.locator(".common-dropdown"),
    sde_ddoption: this.page.locator("#student-eval-dropdown-option-1 "),
    sde_rte: this.page.locator("#cke_editor3"),
    submit_eval: this.page.locator("#submit-evaluation"),
    revise_eval: this.page.locator("#revise-evaluation"),
    submit_activity: this.page.locator("#submit-activity"),
    revise_activity: this.page.locator("#revise-activity"),
    activity_status: this.page.locator("#activityStatus .activity-status").nth(1),
    candidate_rubrics: this.page.getByRole("radio").nth(1),
    video_rubrics_collapse: this.page.locator("#lessonRubricsContainer .collapse-btn")

  };


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



  async validateCurrentActivity(): Promise<void> {
    // Wait for page to fully load before checking activity elements
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(2000); // Additional wait for dynamic content

    const type = await this.detectActivityType();
    console.log(`Detected activity type: ${type}`);


    await this.safelyExecute("File Submission", async () => {
      await this.submitActivity(type);
    });

    console.log(`Activity submitted for: ${type}`);
    await this.ActivityPage.closeActivity();  // Close activity after submission

    if (type === false) {
      console.log("Unknown activity type detected; skipping validator.");
      await this.ActivityPage.closeActivity();

      await this.page.locator(".activity-list-table").first()
        .waitFor({ state: "visible", timeout: 10000 });

      return;
    }

    console.log("✅ Activity loaded successfully");

    await this.ActivityPage.openSubmissionsTab
    // close activity page and return to learn page
    await this.ActivityPage.closeActivity();

    await this.page.locator(".activity-list-table").first()
      .waitFor({ state: "visible", timeout: 10000 });

  }


  private async detectActivityType(): Promise<ActivityType | false> {
    if (await this.locators.video.count()) return "videoEvaluation";

    if (await this.locators.annotation.count()) return "annotation";

    if (await this.locators.assessment.count()) return "selfAssessment";

    if (await this.locators.studentDataEval.count()) return "studentDataEval";

    if (await this.locators.multiDataEval.count()) return "multiDataEval";

    if (await this.locators.readonly.count()) return "readonly";

    if (await this.locators.file.count()) return "file";

    return false;
  }


  private async submitActivity(type: ActivityType | false): Promise<void> {

    const activity_status_text = (await this.locators.activity_status.innerText()).toLowerCase();

    // Handle submission based on activity type
    switch (type) {
      case "videoEvaluation":
        await this.submitVideoActivity(activity_status_text);
        break;
      case "file":
        await this.submitFileActivity(activity_status_text);
        break;
      case "annotation":
        await this.submitAnnotationActivity(activity_status_text);
        break;
      /*case "selfAssessment":
          await this.submitAssessmentActivity(activity_status_text);
          break;*/
      case "studentDataEval":
        await this.submitStudentDataEvalActivity(activity_status_text);
        await this.page.pause();

        break;
      case "multiDataEval":
        await this.submitMultiDataEvalActivity(activity_status_text);
        break;
      case "readonly":
        await this.submitReadOnlyActivity(activity_status_text);
        break;

      default:
        console.warn("Unknown activity type for submission");
    }

  }


  private async submitVideoActivity(activity_status_text: string): Promise<void> {
    console.log("Submitting video activity...");
    await this.locators.annotation_text.click();
    await this.locators.annotation_text.fill("Text video eval submission");
    await this.locators.annotation_submit.click();
    await this.locators.video_rubrics_collapse.click();
    await this.locators.candidate_rubrics.click();
    await this.locators.file.click();
    await this.locators.file.fill("Text Video Eval activity overall feedback");
    await this.locators.submit_activity.click();
    await expect(this.locators.revise_activity).toBeVisible({ timeout: 10000 });
    await expect(activity_status_text).toBe('submitted');


  }

  private async submitFileActivity(activity_status_text: string): Promise<void> {
    await this.locators.file.click();
    await this.locators.file.fill("Text file submission");
    await this.locators.submit_activity.click();
    await this.page.waitForLoadState("load");
    await expect(this.locators.revise_activity).toBeVisible();
    await expect(activity_status_text).toBe('submitted');
  }

  private async submitAnnotationActivity(activity_status_text: string): Promise<void> {
    await this.locators.annotation_text.click();
    await this.locators.annotation_text.fill("Text annotation submission");
    await this.locators.annotation_submit.click();
    await this.locators.submit_activity.click();
    await this.page.waitForLoadState("load");
    await expect(this.locators.revise_activity).toBeVisible();
    await expect(activity_status_text).toBe('submitted');

  }

  private async submitAssessmentActivity(activity_status_text: string): Promise<void> {
    await this.locators.file.click();
    await this.locators.file.fill("Text Self assessment submission submission");
    await this.locators.submit_eval.click();
    await this.page.waitForLoadState("load");
    await expect(this.locators.revise_activity).toBeVisible();
    await expect(activity_status_text).toBe('submitted');
  }

  private async submitStudentDataEvalActivity(activity_status_text: string): Promise<void> {
    await this.locators.sde_checkbox.check();
    await this.locators.sde_editbox.fill("30");
    await this.locators.sde_dd.click();
    await this.locators.sde_ddoption.click();
    await this.locators.file.click();
    await this.locators.file.fill("Text student data evaluation submission");
    await this.locators.submit_activity.click();
    await this.page.waitForLoadState("load");
    await expect(this.locators.revise_activity).toBeVisible();
    await expect(activity_status_text).toBe('submitted');
  }

  private async submitMultiDataEvalActivity(activity_status_text: string): Promise<void> {
    await this.locators.candidate_rubrics.click();;
    await this.locators.submit_eval.click();
    await this.page.waitForLoadState("load");
    await expect(activity_status_text).toBe('submitted');


  }

  private async submitReadOnlyActivity(activity_status_text: string): Promise<void> {
    await this.page.keyboard.press('End');
    await this.page.waitForTimeout(1500);
    await expect(activity_status_text).toBe('completed');
  }

};



type ActivityType =
  | "file"
  | "readonly"
  | "videoEvaluation"
  | "annotation"
  | "selfAssessment"
  | "studentDataEval"
  | "multiDataEval"
//| "unknown";
``

