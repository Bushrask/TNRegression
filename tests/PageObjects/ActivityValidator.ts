import { Page } from "@playwright/test";
import { ActivityPage } from "./ActivityPage";
import { setDefaultTimeout } from "@cucumber/cucumber";

setDefaultTimeout(100000); // 100 seconds

export class ActivityValidator {
  private readonly ActivityPage: ActivityPage;


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
    submit_activity: this.page.locator("#submit-activity"),
    candidate_rubrics: this.page.getByRole("radio").nth(1),
    video_rubrics_collapse: this.page.locator("#lessonRubricsContainer .collapse-btn")

  };


  async validateCurrentActivity(): Promise<void> {
    // Wait for page to fully load before checking activity elements
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(2000); // Additional wait for dynamic content

    const type = await this.detectActivityType();
    console.log(`Detected activity type: ${type}`);

    await this.submitActivity(type);
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
    // Handle submission based on activity type
    switch (type) {
      case "videoEvaluation":
        await this.submitVideoActivity();
        break;
      case "file":
          await this.submitFileActivity();
          break;
      case "annotation":
        await this.submitAnnotationActivity();
        break;
      case "selfAssessment":
          await this.submitAssessmentActivity();
          break;
      case "studentDataEval":
          await this.submitStudentDataEvalActivity();
          break;
      case "multiDataEval":
          await this.submitMultiDataEvalActivity();
          break;
      default:
        console.warn("Unknown activity type for submission");
    }

  }


  private async submitVideoActivity(): Promise<void> {
    console.log("Submitting video activity...");
    await this.locators.annotation_text.click();
    await this.locators.annotation_text.fill("Text video eval submission");
    await this.locators.annotation_submit.click();
    await this.locators.video_rubrics_collapse.click();
    await this.locators.candidate_rubrics.click();
    await this.locators.submit_activity.click();

  }

  private async submitFileActivity(): Promise<void> {
    console.log("Submitting file activity...");
    await this.locators.file.click();
    await this.locators.file.fill("Text file submission");
    await this.locators.submit_activity.click();
  }

  private async submitAnnotationActivity(): Promise<void> {
    console.log("Submitting annotation activity...");
    await this.locators.annotation_text.click();
    await this.locators.annotation_text.fill("Text annotation submission");
    await this.locators.annotation_submit.click();
    await this.locators.submit_activity.click();
  }

  private async submitAssessmentActivity(): Promise<void> {
    console.log("Submitting assessment activity...");
    await this.locators.file.click();
    await this.locators.file.fill("Text Self assessment submission submission");
    await this.locators.submit_eval.click();
  }

  private async submitStudentDataEvalActivity(): Promise<void> {
    console.log("Submitting student data evaluation activity...");
    await this.locators.sde_checkbox.check();
    await this.locators.sde_editbox.fill("30");
    await this.locators.sde_dd.click();
    await this.locators.sde_ddoption.click();
    await this.locators.file.click();
    await this.locators.file.fill("Text student data evaluation submission");
    await this.locators.submit_activity.click();
  }

  private async submitMultiDataEvalActivity(): Promise<void> {
    console.log("Submitting multi data evaluation activity...");
    await this.locators.candidate_rubrics.click();;
    await this.locators.submit_eval.click();
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

