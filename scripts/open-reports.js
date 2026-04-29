const fs = require("fs");
const path = require("path");
const open = require("open");

async function openLatestReport() {
  const reportDir = path.join(__dirname, "../reports");

  const files = fs.readdirSync(reportDir)
    .filter(f => f.startsWith("cucumber-report") && f.endsWith(".html"))
    .sort((a, b) => fs.statSync(path.join(reportDir, b)).mtime - fs.statSync(path.join(reportDir, a)).mtime);

  const latestReport = path.join(reportDir, files[0]);

  await open(latestReport);
  console.log("🌐 Opened:", latestReport);
}

openLatestReport();