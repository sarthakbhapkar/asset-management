"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.MAILHOG_HOST || 'mailhog',
    port: Number(process.env.MAILHOG_PORT) || 1025,
    secure: false,
});
async function sendEmail(to, subject, text) {
    try {
        await transporter.sendMail({
            from: '"Asset-Management" <no-reply@noovosoft.com>',
            to,
            subject,
            text
        });
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
}
