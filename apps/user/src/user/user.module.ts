import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';

import { AuthModule } from '@ssampong-nest/auth';
import { PrismaClientModule } from '@ssampong-nest/prisma-client';

@Module({
  imports: [AuthModule, PrismaClientModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
