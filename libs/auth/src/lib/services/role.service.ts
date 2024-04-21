import { Injectable, OnModuleInit } from '@nestjs/common';

import { Role } from '../decorators/roles.decorator';

import { PrismaClientService } from '@ssampong-nest/prisma-client';

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(private readonly prismaService: PrismaClientService) {}

  async onModuleInit(): Promise<void> {
    await Promise.all(
      Object.values(Role).map(async (role) => {
        if (!(await this.isRoleExist(role))) await this.createRole(role);
      }),
    );
  }

  async isRoleExist(name: string): Promise<boolean> {
    const role = await this.prismaService.role.findUnique({
      where: {
        name,
      },
    });

    return !!role;
  }

  async createRole(name: string): Promise<void> {
    await this.prismaService.role.create({
      data: {
        name,
      },
    });
  }
}
