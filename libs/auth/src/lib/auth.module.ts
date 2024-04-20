import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { RoleService } from './services/role.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

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
  controllers: [AuthController],
  providers: [AuthService, RoleService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
