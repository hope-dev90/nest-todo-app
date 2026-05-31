import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Note } from './note.entity';
import { UsersService } from './users.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Note]), MailModule], 
  providers: [UsersService],
  exports: [UsersService], 
})
export class UsersModule {}