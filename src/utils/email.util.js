import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASS } from '../constants/env.constant.js';
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendEmailVerificationCode = async (email) => {
  // 이메일 인증 번호 생성
  const verificationCode = crypto.randomBytes(3).toString('hex');
  // 이메일 발송 형식
  const mailForm = {
    form: EMAIL_USER,
    to: email,
    subject: '회원가입 이메일 인증번호입니다.',
    text: `${verificationCode} 인증번호를 회원가입 창에서 입력해주세요`,
  };
  // 이메일 발송
  await transporter.sendMail(mailForm);
  return verificationCode;
};
