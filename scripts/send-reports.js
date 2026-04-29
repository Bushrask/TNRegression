const nodemailer = require("nodemailer");
const path = require("path");

async function sendReport() {
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 25,
    secure: false // local SMTP never uses SSL
  });

  const mailOptions = {
    from: "local@test",  // fake sender (OK in local mode)
    to: "local@test",    // fake receiver (Papercut/MailHog will show it)
    subject: "BDD Automation Test Report",
    text: "Attached is the Cucumber HTML report.",
    attachments: [
      {
        filename: "cucumber-report.html",
        path: path.join(__dirname, "../reports/cucumber-report.html")
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Email send failed:", error);
    } else {
      console.log("📧 Report delivered locally:", info.response);
    }
  });
}

sendReport();