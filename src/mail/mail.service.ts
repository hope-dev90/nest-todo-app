import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcome(email: string) {
    try {
      console.log(`Sending welcome email to ${email}`);
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome!',
        text: 'Welcome to our app!',
        html: `<h1>Welcome!</h1><p>Thank you for signing up!</p>`,
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  }

  async sendVerificationEmail(to: string, token: string) {
    try {
      console.log(`Sending verification email to ${to} with token: ${token}`);
      await this.mailerService.sendMail({
        to: to,
        subject: 'Verify your email',
        text: `Click the link to verify your email: http://localhost:3000/auth/verify-email?token=${token}`,
        html: `<h1>Verify your email</h1><p>Click the link below to verify your email. It expires in 24 hours.</p><a href="http://localhost:3000/auth/verify-email?token=${token}">Verify Email</a>`,
      });
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }
  }

  async sendPasswordResetOtp(to: string, otp: string) {
    try {
      console.log(`Sending password reset OTP to ${to}`);
      await this.mailerService.sendMail({
        to: to,
        subject: 'Password Reset OTP',
        text: `Your OTP is ${otp}`,
        html: `<h1>Password Reset</h1><p>Your OTP is: <strong>${otp}</strong></p>`,
      });
    } catch (error) {
      console.error('Failed to send password reset OTP:', error);
    }
  }
}
