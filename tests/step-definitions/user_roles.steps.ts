import { Then } from "@cucumber/cucumber";
import {
  CommonPages,
  CandidatePages,
  InstructorPages,
  MentorPages
} from "../PageObjects/Login";

Then(
  /^the "([^"]+)" user should be able to navigate to their dashboard pages$/,
  async function (role: string) {

    const common = new CommonPages(this.page);
    role = role.trim(); 
    console.log("ROLE =", role);


    switch (role) {
      case "NonB2B":
      case "B2B":
      case "MED":
      case "MEL":
      case "MRnG": {
        const candidate = new CandidatePages(this.page);
        await common.navigateToCommonPages();
        await this.page.waitForTimeout(5000);
        await candidate.navigateToCandidatePages();
        break;
      }

      case "Instructor": {
        const instructor = new InstructorPages(this.page);
        await common.navigateToCommonPages();
        await instructor.navigateToInstructorPages();
        break;
      }

      case "Mentor": {
        const mentor = new MentorPages(this.page);
        await mentor.navigateToMentorPages();
        break;
      }

      default:
        throw new Error(`Unsupported role: ${role}`);
    }
  }
);