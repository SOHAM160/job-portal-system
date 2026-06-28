const brevo = require("@getbrevo/brevo");

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async (options) => {
  try {
    const email = new brevo.SendSmtpEmail();

    email.sender = {
      name: "HireHub",
      email: process.env.EMAIL_FROM,
    };

    email.to = [
      {
        email: options.email,
      },
    ];

    email.subject = options.subject;
    email.htmlContent = options.html;

    const result = await apiInstance.sendTransacEmail(email);

    console.log("✅ Email sent successfully!");
    console.log(result);

    return result;
  } catch (err) {
    console.error("❌ Brevo Email Error:");
    console.error(err.response?.body || err);
    throw err;
  }
};

module.exports = sendEmail;