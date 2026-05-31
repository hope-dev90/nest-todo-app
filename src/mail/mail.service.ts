import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  async sendWelcome(email: string) {
    console.log(`Sending welcome email to ${email}`);
    // Here you would implement actual email sending logic
  }
}
