const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // your Outlook email address
    pass: process.env.EMAIL_PASS, // your Outlook email password
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Sistema de gestion estudiantil" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
