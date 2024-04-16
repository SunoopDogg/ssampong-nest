import { Injectable } from '@nestjs/common';

import { CreateUserDto, UserDto } from './dto/user.dto';

import { PrismaClientService } from '@ssampong-nest/prisma-client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaClientService) {}

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
    createUserDto.password = hash;

    return await this.prismaService.user.create({
      data: createUserDto,
    });
  }
}
