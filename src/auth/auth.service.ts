import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  async register(email: string, password: string, name?: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new ConflictException('Email already in use');

    const verificationToken = uuidv4();
    const user = await this.usersService.create(email, password, verificationToken, name);

    await this.mailService.sendVerificationEmail(email, verificationToken);

    return { message: 'Registration successful. Please verify your email.' };
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user) throw new BadRequestException('Invalid or expired token');

    await this.usersService.markAsVerified(user);
    return { message: 'Email verified successfully!' };
  }

  async login(email: string, password: string) {
    console.log('AuthService login - email:', email, 'password:', password);
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    console.log('Found user:', user);
    if (!password || !user.password) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user.id, user.email);
    return { user: { id: user.id, email: user.email, name: user.name }, ...tokens };
  }

  async generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'), 
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'), 
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
  async delete(email : string){
    const existing = await this.usersService.findByEmail(email);
    if(!existing) return "user doesn't exist";
    return this.usersService.delete(email);
  }
  async findAll(){
    return this.usersService.findAll();
  }
  async forgotPassword(email: string){
    return this.usersService.forgotPassword(email);
  }
  async resetPassword(email: string, otp: string, newPassword: string){
    return this.usersService.resetPassword(email, otp, newPassword);
  }
}