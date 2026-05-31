import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { DeleteResult } from 'typeorm';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    if (!email) return null; 
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(email: string, password: string, verificationToken?: string): Promise<User> {
    const user = this.usersRepository.create({ email, password, verificationToken });
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
}
