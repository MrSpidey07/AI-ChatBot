import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { otpEmailTemplate } from "../emails/otpEmailTemplate.js";
dotenv.config();

const transporter = process.env.EMAIL_SERVICE === "gmail" ? nodemailer.createTransport({
    service: "gmail", 
    auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
}) : nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

export const sendOtp = async (email) => {
    try {
        const otp = generateOtp().toString();

        const mailOptions = {
            from: `"Eliora AI" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Sign-in code for Eliora AI",
            html: otpEmailTemplate(otp),
        };

        transporter.sendMail(mailOptions)
            .then(() => console.log("OTP sent"))
            .catch(err => console.error("Mail error", err));

        return otp;
    } catch (error) {
        console.error("Error sending OTP", error);
        return null;
    }
}
