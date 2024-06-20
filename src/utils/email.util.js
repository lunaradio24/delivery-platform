import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendVerificationEmail = (email, verificationNumber) => {
    console.log(`보내지는 이메일 ${email}`);
    const mailForm = {
        form: process.env.EMAIL_USER,
        to: email,
        subject: '이메일 인증번호입니다.',
        text: `${verificationNumber}를 회원가입 창에서 입력해주세요`,
    };
    return transporter.sendMail(mailForm);
};