const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (options) => {
  try {
    console.log("Sending email to:", options.email);

    const info = await transporter.sendMail({
      from: `"HireHub" <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Email Error:", err);
    throw err;
  }
};

module.exports = sendEmail;