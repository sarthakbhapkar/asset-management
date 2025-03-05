import nodemailer, { Transporter } from 'nodemailer';
import * as url from "node:url";
import * as string_decoder from "node:string_decoder";

const transporter: Transporter = nodemailer.createTransport({
    host: process.env.MAILHOG_HOST || 'mailhog',
    port: Number(process.env.MAILHOG_PORT) || 1025,
    secure: false,
});

export async function sendEmail(to: string, subject: string, text:string): Promise<void> {
    try {
        await transporter.sendMail({
            from: '"Asset-Management" <no-reply@noovosoft.com>',
            to,
            subject,
            text
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
