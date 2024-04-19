import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthenticationController } from './authentication.controller';
import { AuthenticationAppService } from './authentication.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

import { PrismaClientModule } from '@ssampong-nest/prisma-client';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env['JWT_SECRET'],
      signOptions: { expiresIn: process.env['JWT_EXPIRES_IN'] },
    }),
    PassportModule,
    PrismaClientModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationAppService, LocalStrategy, JwtStrategy],
  exports: [AuthenticationAppService],
})
export class AuthenticationModule {}
