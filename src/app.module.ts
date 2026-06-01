import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import {TypeOrmModule} from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { NotesModule } from './notes/notes.module';
import { RemindersModule } from './reminders/reminders.module';
import { AgendaModule } from './agenda/agenda.module';
@Module({

imports: [
  ConfigModule.forRoot({ isGlobal: true }),
  ThrottlerModule.forRoot([{
    ttl: 60000, 
    limit: 1000, 
  }]),
  TypeOrmModule.forRootAsync({
    useFactory: (configService: ConfigService) => {
      const databaseUrl = configService.get('DATABASE_URL');
      if (databaseUrl) {
        return {
          type: 'postgres',
          url: databaseUrl,
          autoLoadEntities: true,
          synchronize: true,
          ssl: { rejectUnauthorized: false },
        };
      }
      return {
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      };
    },
    inject: [ConfigService],
  }),
  AuthModule,
  UsersModule,
  MailModule,
  NotesModule,
  RemindersModule,
  AgendaModule,
  ServeStaticModule.forRoot(
    {
      rootPath: join(process.cwd(), 'client', 'build'),
      serveRoot: '/',
      serveStaticOptions: {
        fallthrough: true,
      },
    },
    {
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }
  ),
],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  
})
export class AppModule {}
