const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = ({to, subject, html })=> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADMIN,
      pass: process.env.EMAIL_PASS
    }
  });

  return transporter.sendMail({
    from: `"SKY KIDDIES" ${process.env.EMAIL_ADMIN}`,
    to,
    subject,
    html
  });
};

module.exports = sendEmail