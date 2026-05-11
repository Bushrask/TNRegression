import { Page } from "@playwright/test";
import { ActivityPage } from "./ActivityPage";

export class ActivityValidator {
    private readonly ActivityPage: ActivityPage;


    constructor(private readonly page: Page) {
        this.ActivityPage = new ActivityPage(page);

    }

    // Centralized Locators
    private readonly locators = {
        video: this.page.locator("video"),
        file: this.page.locator("#cke_editor1"),
        annotation: this.page.locator(".annotation-toolbar"),
        assessment: this.page.locator("form, textarea"),
        readonly: this.page.locator(".readonly-content"),

        // Validation-specific locators
        ckEditorData: this.page.locator(".cke_editor1"),
        annotateVideo: this.page.locator(".annotation-toolbar"),
        body: this.page.locator("body"),
    };


    async validateCurrentActivity(): Promise<void> {
        // Wait for page to fully load before checking activity elements
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(2000); // Additional wait for dynamic content

        const type = await this.detectActivityType();
        console.log(`Detected activity type: ${type}`);

        if (type === false) {
            console.log("Unknown activity type detected; skipping validator.");
            return;
        }

        await this.validators[type]();

        console.log("✅ Activity loaded successfully");
    }


    private async detectActivityType(): Promise<ActivityType | false> {
        if (await this.locators.video.count()) return "video";

        if (await this.locators.file.count()) return "file";

        if (await this.locators.annotation.count()) return "annotation";

        if (await this.locators.assessment.count()) return "assessment";

        if (await this.locators.readonly.count()) return "readonly";
        
        // fallback
        await this.ActivityPage.closeActivity();
        return false;
    }


    private validators: Record<ActivityType, () => Promise<void>> = {


        file: async () => {
            await this.locators.file.first().waitFor({ state: "visible" });
        },

        readonly: async () => {
            await this.locators.ckEditorData.waitFor({ state: "visible" });
        },

        video: async () => {
            await this.locators.annotateVideo.waitFor({ state: "visible" });
        },

        videoContainer: async () => {
            await this.locators.annotation.waitFor({ state: "visible" });
        },

        annotation: async () => {
            await this.locators.annotation.waitFor({ state: "visible" });
        },

        assessment: async () => {
            await this.locators.assessment.waitFor({ state: "visible" });
        },

        /*unknown: async () => {
            await this.page.waitForLoadState("domcontentloaded");

            const bodyContent = await this.locators.body.textContent();

            if (!bodyContent || bodyContent.trim().length === 0) {
                throw new Error("Activity page has no content");
            }
        },*/
    };
}


type ActivityType =
    | "file"
    | "readonly"
    | "video"
    | "videoContainer"
    | "annotation"
    | "assessment"
    //| "unknown";
``