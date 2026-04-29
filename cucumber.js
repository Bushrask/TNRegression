module.exports = {
  default: {
    paths: ["tests/features/**/*.feature"],
    require: [
      "tests/step-definitions/**/*.ts",
      "support/**/*.ts"
    ],
    requireModule: ["ts-node/register/transpile-only"],
    format: ["progress",
        "json:reports/cucumber-report.json"
    ],
    publishQuiet: true
  }
};
``