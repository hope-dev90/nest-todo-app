import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false, // true for 465, false for 587
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: `"Auth App" <${this.configService.get('MAIL_FROM')}>`,
      to,
      subject,
      html,
    });
  }

  // 👇 ready-made methods you'll use in auth
  async sendWelcome(to: string) {
    await this.sendMail(
      to,
      'Welcome!',
      `<h1>Welcome to Auth App!</h1><p>Your account has been created successfully.</p>`
    );
  }

  async sendPasswordReset(to: string, resetToken: string) {
    await this.sendMail(
      to,
      'Password Reset',
      `<h1>Reset your password</h1>
       <p>Click the link below to reset your password. It expires in 15 minutes.</p>
       <a href="http://localhost:3000/auth/reset-password?token=${resetToken}">Reset Password</a>`
    );
  }
}