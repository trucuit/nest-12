// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // take token from Authorization header
      ignoreExpiration: false, // don't ignore token expiration
      secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecret', // secret key
    });
  }

  async validate(payload: any) {
    // payload is the token content
    const user = await this.usersService.findOneById(payload.sub);
    if (!user) {
      return null;
    }

    return {
      userId: payload.sub,
      email: user.email,
      username: payload.username,
      role: payload.role,
    };
  }
}
