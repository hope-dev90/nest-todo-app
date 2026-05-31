import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { RolesGuard } from '../common/guards/roles.guard';
import { Reflector } from '@nestjs/core'; 

@Module({
  imports: [UsersModule, JwtModule.register({})],
  providers: [AuthService, JwtStrategy, RolesGuard, Reflector], 
  controllers: [AuthController],
})
export class AuthModule {}