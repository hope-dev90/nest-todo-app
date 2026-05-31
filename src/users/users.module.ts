import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Todo } from './note.entity'; // Now using Todo instead of Note
import { UsersService } from './users.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Todo]), MailModule], 
  providers: [UsersService],
  exports: [UsersService], 
})
export class UsersModule {}