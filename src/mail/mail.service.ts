import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcome(email: string) {
    console.log(`Sending welcome email to ${email}`);
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome!',
      text: 'Welcome to our app!',
      html: `<h1>Welcome!</h1><p>Thank you for signing up!</p>`,
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    console.log(`Sending verification email to ${to} with token: ${token}`);
    await this.mailerService.sendMail({
      to: to,
      subject: 'Verify your email',
      text: `Click the link to verify your email: http://localhost:3000/auth/verify-email?token=${token}`,
      html: `<h1>Verify your email</h1><p>Click the link below to verify your email. It expires in 24 hours.</p><a href="http://localhost:3000/auth/verify-email?token=${token}">Verify Email</a>`,
    });
  }
}
