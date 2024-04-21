import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from '@ssampong-nest/auth';
import { PrismaClientModule } from '@ssampong-nest/prisma-client';

@Module({
  imports: [AuthModule, PrismaClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
