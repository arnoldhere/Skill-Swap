const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (email, subject, text) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host:"smtp.gmail.com",
      port: 465,
      secure: true, // or 'STARTTLS'
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: text,
    });

    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};

module.exports = sendEmail;

// 