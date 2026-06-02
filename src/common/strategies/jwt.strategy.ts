import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service'; // ✅ relative path

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService, private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET') || 'fallback-secret-for-development-only',
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) return null;
    return user;
  }
}