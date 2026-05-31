import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '../../users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      secretOrKey: 'access-secret', 
    });
  }
  async validate(payload: { sub: number; email: string }) {
  console.log('JWT payload:', payload); 
  const user = await this.usersService.findByEmail(payload.email);
  console.log('user found:', user);    
  return user;
}
}