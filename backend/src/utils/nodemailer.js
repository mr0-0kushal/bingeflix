import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
import fs from 'fs';
import path from 'path';
const welcomeMailHTML = './public/static/emailTemplates/welcomeMail.html';
const otpMail = './public/static/emailTemplates/otpMail.html';

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

const welcomeMail = async (emailReceiver, fullname) => {

  const templatePath = path.resolve(welcomeMailHTML);
  let htmlContent = fs.readFileSync(templatePath, 'utf-8');

  // Simple replace for variables like {{userName}}
  htmlContent = htmlContent.replace('{{userName}}', fullname.toUpperCase());

  const mailOptions = {
    from: `"BingeFlix" <${process.env.EMAIL_USER}>`,
    to: emailReceiver,
    subject: 'Welcome to BingeFlix 🎉',
    html: htmlContent,
  }

  const info = await transporter.sendMail(mailOptions);
  return info
}

const sendOTPEmail = async (emailReceiver, fullname, otp) => {

  const templatePath = path.resolve(otpMail);
  let htmlContent = fs.readFileSync(templatePath, 'utf-8');

  // Simple replace for variables like {{userName}}
  htmlContent = htmlContent.replace('{{userName}}', fullname.toUpperCase());
  htmlContent = htmlContent.replace('{{OTP}}', otp )

  const mailOptions = {
    from: `"BingeFlix" <${process.env.EMAIL_USER}>`,
    to: emailReceiver,
    subject: 'OTP for login',
    html: htmlContent,
  }

  const info = await transporter.sendMail(mailOptions);
  return info
}

export {
  welcomeMail,
  sendOTPEmail
}