import { Controller, Post,Delete,Query, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

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
delete(@Body('email') email: string) {
  return this.authService.delete(email);
}

}