import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // use app password for Gmail
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: `Note App <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP for Note App',
    html: `<h2>Your OTP is: ${otp}</h2><p>It will expire in 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
