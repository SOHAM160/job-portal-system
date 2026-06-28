const axios = require("axios");

const sendEmail = async (options) => {
  try {
    console.log("📧 Sending email to:", options.email);

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "HireHub",
          email: process.env.EMAIL_FROM,
        },
        to: [
          {
            email: options.email,
          },
        ],
        subject: options.subject,
        htmlContent: options.html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent successfully!");
    console.log(response.data);

    return response.data;
  } catch (err) {
    console.error("❌ Brevo API Error:");

    if (err.response) {
      console.error(err.response.data);
    } else {
      console.error(err.message);
    }

    throw err;
  }
};

module.exports = sendEmail;