import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
@Module({

imports: [
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
  AuthModule, UsersModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
