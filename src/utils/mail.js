import nodemailer from 'nodemailer';

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async sendEmail(targetEmail, subject, content) {
        try {
            const info = await this.transporter.sendMail({
                from: `"OpenMusic API" <${process.env.SMTP_USER}>`,
                to: targetEmail,
                subject: subject,
                text: content,
                html: `<pre>${content}</pre>`,
            });

            console.log('✅ Email sent:', info.messageId);
            return info;
        } catch (error) {
            console.error('❌ Email send error:', error);
            throw error;
        }
    }
}

export default new MailService();