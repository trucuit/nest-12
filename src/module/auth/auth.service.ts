// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, // service handling user data
    private jwtService: JwtService, // service handling JWT
  ) {}

  async validateUser(username: string, pass: string): Promise<LoginDto | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user; // remove password from user object
      return result;
    }
    return null;
  }

  // xem lai cach sign of jwtService
  async login(user: LoginDto) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // should unique email
  async register(userDto: any) {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const user = await this.usersService.create({
      ...userDto,
      password: hashedPassword,
    });
    const { password, ...result } = user;
    return result;
  }
}
