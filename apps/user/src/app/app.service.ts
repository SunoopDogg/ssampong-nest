import { Injectable } from '@nestjs/common';

import { CreateUserPayload, UserInterface } from './interfaces/user.interface';

import { PrismaClientService } from '@ssampong-nest/prisma-client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaClientService) {}

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  async create(payload: CreateUserPayload): Promise<UserInterface> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(payload.password, saltOrRounds);
    payload.password = hash;

    return this.prismaService.user.create({
      data: {
        email: payload.email,
        password: payload.password,
        name: payload.name,
        roles: {
          connect: payload.roles.map((role) => ({ name: role })),
        },
      },
    });
  }
}
