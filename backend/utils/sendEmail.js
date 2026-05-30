const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const sendEmail = async ({ to, subject, html, attachments }) => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendSmtpEmail = {
      sender: {
        name: "Bigwig Media Digital",
        email: "devashish@bigwigmedia.in",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    };

    // ✅ Only add attachment if it exists and has items
    if (attachments && attachments.length > 0) {
      sendSmtpEmail.attachment = attachments;
    }

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Brevo Email Error:", error?.response?.body || error);
    throw error;
  }
};

module.exports = sendEmail;
