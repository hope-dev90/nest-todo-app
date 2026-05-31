import { Controller, Post,Delete,Query,Get, Body,UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

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

}