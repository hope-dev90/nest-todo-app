import { Controller, Post,Delete,Query,Get, Body,UseGuards,Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/user.entity';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto.email, registerDto.password, registerDto.name);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
@Delete('delete')
  @UseGuards(JwtAuthGuard, RolesGuard) // 1st verify JWT, 2nd check role
  @Roles(Role.ADMIN)                   
delete(@Body('email') email: string) {
  return this.authService.delete(email);
}
@Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }
@Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.email, 
      resetPasswordDto.otp, 
      resetPasswordDto.newPassword
    );
  }
}