import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import {TypeOrmModule} from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
@Module({

imports: [
  ConfigModule.forRoot({ isGlobal: true }),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
  }),
  TypeOrmModule.forRoot({
 type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'h1o2p3e4@2010',
      database: 'todo_db',
      autoLoadEntities: true,
      synchronize: true, 
  }),
  AuthModule, UsersModule, MailModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
