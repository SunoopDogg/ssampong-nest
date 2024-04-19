import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from './interfaces/auth.interface';
import { UserInterface, UserPayload } from './interfaces/user.interface';

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
  ): Promise<UserPayload | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: {
        roles: true,
      },
    });
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      password;
      return result;
    }
    return null;
  }

  async generateAccessToken(user: UserInterface): Promise<string> {
    const payload: JwtPayload = {
      email: user.email,
      username: user.name,
      roles: user.roles.map((role) => role.name),
    };

    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(user: UserInterface): Promise<string> {
    const payload: JwtPayload = {
      email: user.email,
      username: user.name,
      roles: user.roles.map((role) => role.name),
    };

    return this.jwtService.sign(payload, {
      secret: process.env['JWT_REFRESH_SECRET'],
      expiresIn: process.env['JWT_REFRESH_EXPIRES_IN'],
    });
  }
}
