import { Module } from '@nestjs/common';

import { PrismaClientService } from './clients/prisma-client-service.service';

@Module({
  controllers: [],
  providers: [PrismaClientService],
  exports: [PrismaClientService],
})
export class PrismaClientModule {}
