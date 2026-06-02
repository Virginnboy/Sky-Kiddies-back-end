const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY)

const sendEmail = async ({ to, subject, html }) => {
  return await resend.emails.send({
    from: "SKY KIDDIES <onboarding@resend.dev>",
    to,
    subject,
    html
  });
};

module.exports = sendEmail;