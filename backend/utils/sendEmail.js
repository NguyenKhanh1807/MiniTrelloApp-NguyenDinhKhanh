import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendVerificationEmail = async (to, code) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Mini Trello" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your Verification Code',
      html: `<p>Your verification code is: <b>${code}</b></p>`
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};