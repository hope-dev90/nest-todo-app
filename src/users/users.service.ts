import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private mailService: MailService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    if (!email) return null; 
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(email: string, password: string, verificationToken?: string, name?: string): Promise<User> {
    const user = this.usersRepository.create({ 
      email, 
      password, 
      verificationToken, 
      name, 
      isVerified: true 
    });
    return this.usersRepository.save(user);
  }
  async findByVerificationToken(token: string): Promise<User | null> {
    if (!token) return null;
    return this.usersRepository.findOne({ where: { verificationToken: token } });
  }
async delete(email: string): Promise<DeleteResult | null> {
  if (!email) return null;

  return this.usersRepository.delete({ email });
}
async findAll(): Promise <User[]>{
    return this.usersRepository.find();

}
async verifyEmail(email: string, token: string): Promise<User | null> {
  if (!email || !token) return null;
  return this.usersRepository.findOne({ where: { email, verificationToken: token } });
}

async markAsVerified(user: User): Promise<User> {
  user.isVerified = true;
  user.verificationToken = null; 
  return this.usersRepository.save(user);
}
async forgotPassword(email: string): Promise<boolean> {
  if (!email) return false;

  const user = await this.usersRepository.findOne({ where: { email } });

  if (!user) return false;


  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetOtp = otp;
  user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await this.usersRepository.save(user);


  await this.mailService.sendPasswordResetOtp(email, otp);

  return true;
}
async resetPassword(email: string, otp: string, newPassword: string): Promise<boolean> {
  const user = await this.usersRepository.findOne({ where: { email } });

  if (!user) return false;

  if (
    user.resetOtp !== otp ||
    !user.resetOtpExpiry ||
    user.resetOtpExpiry < new Date()
  ) {
    return false;
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetOtp = null;
  user.resetOtpExpiry = null;

  await this.usersRepository.save(user);

  return true;
}
}
