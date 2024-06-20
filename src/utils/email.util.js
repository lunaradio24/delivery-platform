import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email) => {
  const verificationNumber = crypto.randomBytes(3).toString('hex');
  const mailForm = {
    form: process.env.EMAIL_USER,
    to: email,
    subject: '회원가입 이메일 인증번호입니다.',
    text: `${verificationNumber} 인증번호를 회원가입 창에서 입력해주세요`,
  };
  await transporter.sendMail(mailForm);
  return verificationNumber;
};