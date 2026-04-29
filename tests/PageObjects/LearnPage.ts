import { Page, Locator } from "@playwright/test";

/*export class LearnPage {
    constructor(private page: Page) { }

    // -------- Locators --------
    moduleDropdown = this.page.locator("#module-select-trigger");
    moduleOptions = this.page.locator("#module-dropdown-menu li.module-select-option");
    unitCards = this.page.locator("#parentContentHolder .unit-content-wrapper");


    // Activity status locator inside a unit's activity card
    activityStatus(activity: Locator) {
        return activity.locator(".activity-status-text .status.label-4");
    }

    // -------- Search inside a single unit (unit is already expanded) --------
    async ifOpenOrLateActivityFoundInCurrentModule(): Promise<boolean> { 
        await this.unitCards.click();
        const activities = this.page.locator('#parentContentHolder .activity-list-table tbody tr');
        const activityCount = await activities.count();
        console.log("  Activities found in unit:", activityCount);

        if (activityCount === 0) {
            console.log(" No activities in this unit");
            return false;
        }

        for (let i = 0; i < activityCount; i++) {
            const activity = activities.nth(i);
            const status = (await this.activityStatus(activity).first().innerText()).trim();
            console.log(`  Activity ${i} status: "${status}"`);

            if (status === "Open" || status === "late") {
                console.log(`  Found ${status} activity, clicking...`);
                await activity.click();
                return true;
            }
        }

        console.log("  No Open or Late activities found in this unit");
        return false;
    }
    // -------- Main Logic: search across modules & units --------
    async tryingOtherModules() {

        console.log("=== Starting search for Open/Late activity ===");
        const moduleCount = await this.moduleOptions.count();
        console.log("Total modules:", moduleCount);

        for (let m = 0; m < moduleCount; m++) {
            console.log(`\n--- Checking module ${m} ---`);

            // Switch modules except first (already loaded)
            if (m > 0) {
                console.log(`Switching to module ${m}...`);
                await this.moduleDropdown.click();
                await this.moduleOptions.nth(m).click();
                await this.page.waitForLoadState("networkidle");
                await this.page.waitForTimeout(1000);
            }

            const activityFound = await this.tryOtherUnitsInSameModule();

            if (activityFound) {
                console.log(`=== SUCCESS: Found Open/Late activity in module ${m} ===`);
                return;
            }

            console.log(`No Open/Late activity found in module ${m}, moving to next module...`);
        }

        throw new Error("No Open or Late activity found in any module or unit");
    }

    // -------- Search inside all units --------
     async tryOtherUnitsInSameModule(): Promise<boolean> {
        let visited = new Set<number>();
        let unitCount = await this.unitCards.count();
        console.log("Units found in module:", unitCount);

        let checked = 0;
        while (checked < unitCount) {
            // Always re-query the unitCards to get the latest DOM
            unitCount = await this.unitCards.count();
            let foundUnit = false;
            for (let u = 0; u < unitCount; u++) {
                if (visited.has(u)) continue;
                foundUnit = true;
                visited.add(u);
                const unit = this.unitCards.nth(u);
                // Expand the unit
                console.log(`Opening unit ${u}...`);
                await unit.click();
                await this.page.waitForLoadState("networkidle");
                await this.page.waitForTimeout(500);

                // Check for Open or Late activities in this unit
                const activityFound = await this.ifOpenOrLateActivityFoundInCurrentModule();
                if (activityFound) {
                    console.log(`Found Open/Late activity in unit ${u}`);
                    return true;
                }

                // Collapse this unit by clicking its close icon (if present)
                const closeIcon = unit.locator('.icon-close');
                if (await closeIcon.count() > 0) {
                    await closeIcon.click();
                    await this.page.waitForTimeout(500);
                }
                checked++;
                break; // After DOM change, break to re-query units
            }
            if (!foundUnit) break; // No more unvisited units
        }
        // No activity found in any unit of this module
        return false;
    }

    /* -------- Search inside a single unit --------
     async tryOpenOpenOrLateActivityInUnit(): Promise<boolean> {
        const activities = this.page.locator(".activity-row row");
        const activityCount = await activities.count();

        for (let i = 0; i < activityCount; i++) {
            const activity = activities.nth(i);
            const status = (await this.activityStatus(activity).innerText()).trim();

            if (status === "Open" || status === "Late") {
                await activity.click();
                return true;
            }
        }

        return false;
    }
}*/



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

    /*activityStatus(activityRow: Locator) {
        return activityRow.locator(".activity-row .activity-cols .status");
    }*/

    activityStatus(activityRow: Locator) {
        return activityRow.locator("div.status").last();
    }


    /* =========================
       PUBLIC ENTRY POINT
       ========================= */

    async openFirstOpenOrLateActivityAcrossModules(): Promise<void> {
        const moduleCount = await this.moduleOptions.count();
        console.log(`Module count: ${moduleCount}`);

        for (let m = 0; m < moduleCount; m++) {
            console.log(`Checking module ${m + 1} of ${moduleCount}...`);
            // Switch module (skip for first, already loaded)
            if (m > 0) {
                await this.switchToModule(m);
                await this.page.waitForLoadState("networkidle");

                console.log(`Switched to module ${m}`);
            }


            const activityOpened = await this.searchUnitsInCurrentModule();
            if (activityOpened) {
                return; // Stop once we've opened an activity

            }

            throw new Error(

                "No Open or Late activity found in any unit across all modules"
            );
        }
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
        await this.page.waitForLoadState("networkidle");
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
                return true;
            }
        }

        return false;
    }
}

