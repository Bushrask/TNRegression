import { Page, Locator } from "@playwright/test";



export class LearnPage {
    constructor(private page: Page) { }

    /* =========================
       LEARN PAGE LOCATORS
       ========================= */

    // --- Module selection ---
    moduleDropdown = this.page.locator("#module-select-trigger");
    moduleOptions = this.page.locator("#module-dropdown-menu>li.module-select-option");

    // --- Unit cards on Learn page ---
    unitCards = this.page.locator(".unit-card-container");

    // --- Unit details view ---
    unitCloseIcon = this.page.locator("#parentContentHolder .unit-details-body .icon-close"); // ❗ adjust selector

    // --- Activities inside an opened unit ---
    activityRows = this.page.locator(
        "#parentContentHolder .activity-list-table>tbody>tr" // ❗ activity row level
    );

    activityStatus(activityRow: Locator) {
        return activityRow.locator("div.status").last();
    }


    /* =========================
       PUBLIC ENTRY POINT
       ========================= */

    async openFirstOpenOrLateActivityAcrossModules(): Promise<void> {
        const moduleCount = await this.moduleOptions.count();
        console.log(`Module count: ${moduleCount}`);

        await this.searchUnitsInCurrentModule(); // First check current module before switching
        for (let m = 0; m < moduleCount; m++) {
            console.log(`Checking module ${m + 1} of ${moduleCount}...`);
            // Switch module (skip for first, already loaded)
            if (m > 0) {
                await this.switchToModule(m);
                await this.page.waitForLoadState("domcontentloaded");

                console.log(`Switched to module ${m}`);
            }
            

            const activityOpened = await this.searchUnitsInCurrentModule();
            if (activityOpened) {
                console.log("🎉 Found open/late activity!");
                return; // Stop once we've opened an activity

            }

           console.log(`No activity found in module ${m}. Moving to next...`); 
        }
        throw new Error(

                "No Open or Late activity found in any unit across all modules"
            );
    }

    /* =========================
       MODULE HANDLING
       ========================= */

    private async switchToModule(index: number): Promise<void> {
        await this.moduleDropdown.click();
        await this.page.pause();

        await this.moduleOptions.nth(index).click();
        //await this.page.waitForLoadState("networkidle");
    }

    /* =========================
       UNIT HANDLING
       ========================= */

    private async searchUnitsInCurrentModule(): Promise<boolean> {
        const unitCount = await this.unitCards.count();
        console.log(`Units found in module: ${unitCount}`);

        for (let u = 0; u < unitCount; u++) {
            const unitCard = this.unitCards.nth(u);

            await unitCard.click();
            //await this.page.waitForLoadState("networkidle");

            const found = await this.searchActivitiesInOpenedUnit();
            if (found) {
                return true;
            }

            // Close unit and continue
            await this.closeOpenedUnit();
        }

        return false;
    }

    private async closeOpenedUnit(): Promise<void> {
        await this.unitCloseIcon.click({ force: true });
        await this.page.waitForLoadState("domcontentloaded");
    }

    /* =========================
       ACTIVITY HANDLING
       ========================= */

    private async searchActivitiesInOpenedUnit(): Promise<boolean> {
        await this.page.waitForSelector(".activity-list-table", { timeout: 10000 });

        const count = await this.activityRows.count();
        console.log(`Activities found in unit: ${count}`);
        await this.page.waitForTimeout(2000); // Wait for activities to render

        for (let i = 0; i < count; i++) {
            const activity = this.activityRows.nth(i);

            const statusText = (
                await this.activityStatus(activity).innerText()
            );
            //.trim()
            //.toLowerCase();

            console.log(`Activity ${i} status: ${statusText}`);
            if (statusText === "open" || statusText === "late") {
                await activity.click();
                await this.page.waitForLoadState("domcontentloaded");
                await this.page.pause
                return true;
            }
        }
        // If no open/late activities found, then close unit
        await this.closeOpenedUnit();
        return false;
    }
}

