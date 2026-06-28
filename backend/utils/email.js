const nodemailer = require("nodemailer");

// Create transporter once
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  family: 4, // Force IPv4 (fixes Render IPv6 ENETUNREACH errors)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP connection when the server starts
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Verify Error:");
    console.error(error);
  } else {
    console.log("✅ SMTP Server is ready to send emails");
  }
});

const sendEmail = async (options) => {
  try {
    console.log("====================================");
    console.log("📧 Sending email...");
    console.log("To:", options.email);
    console.log("Subject:", options.subject);
    console.log("From:", process.env.EMAIL_USER);
    console.log("====================================");

    const info = await transporter.sendMail({
      from: `"HireHub" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);

    return info;
  } catch (err) {
    console.error("❌ EMAIL ERROR");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    console.error("Response:", err.response);
    console.error("Response Code:", err.responseCode);
    console.error("Command:", err.command);
    console.error("Stack:", err.stack);

    throw err;
  }
};

module.exports = sendEmail;