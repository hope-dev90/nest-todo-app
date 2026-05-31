import { Controller, Post,Delete,Query,Get, Body,UseGuards,Res, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/user.entity';
import { Response } from 'express';

export class RegisterDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    console.log('body received:', body);
    console.log('email:', body.email, '| password:', body.password); // 👈 add this
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  login(@Body() body: RegisterDto) {
    return this.authService.login(body.email, body.password);
  }
@Delete('delete')
  @UseGuards(JwtAuthGuard, RolesGuard) // 1st verify JWT, 2nd check role
  @Roles(Role.ADMIN)                   
delete(@Body('email') email: string) {
  return this.authService.delete(email);
}
@Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard) // 1st verify JWT, 2nd check role
  @Roles(Role.ADMIN)
findAll(){
    return this.authService.findAll();
}

@Get('verify-email')
async verifyEmail(@Query('token') token: string, @Res() res: Response) {
  try {
    await this.authService.verifyEmail(token);
    return res.redirect('/verify-email.html');
  } catch (error) {
    return res.redirect('/verify-error.html');
  }
}
@Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }
@Post('reset-password')
  resetPassword(@Body('email') email: string, @Body('otp') otp: string, @Body('newPassword') newPassword: string) {
    return this.authService.resetPassword(email, otp, newPassword);
  }
}