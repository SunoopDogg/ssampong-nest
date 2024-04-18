import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from './dto/jwt-payload.dto';
import { UserDto } from './dto/user.dto';

import { PrismaClientService } from '@ssampong-nest/prisma-client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationAppService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaClientService,
  ) {}

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<UserDto, 'password'> | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      password;
      return result;
    }
    return null;
  }

  async login(user: UserDto): Promise<{ accessToken: string }> {
    const payload: JwtPayload = {
      email: user.email,
      username: user.name,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}