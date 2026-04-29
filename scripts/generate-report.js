const reporter = require("cucumber-html-reporter");
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

const options = {
  theme: "bootstrap",
  jsonFile: "reports/cucumber-report.json",
  output: `reports/cucumber-report-${timestamp}.html`,
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,

  metadata: {
    "App Version": "LMS",
    "Test Environment": "QA",
    "Browser": "Chrome (Playwright)",
    "Platform": process.platform,
    "Executed": "Local"
  }
};

reporter.generate(options);
