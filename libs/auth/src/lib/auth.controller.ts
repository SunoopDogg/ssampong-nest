import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtSign } from './interfaces/auth.interface';
import { UserInterface } from './interfaces/user.interface';

import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getData() {
    return this.authService.getData();
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Request() req: { user: UserInterface },
    @Res({ passthrough: true }) res: Response,
  ): Promise<JwtSign> {
    const accessToken = await this.authService.generateAccessToken(req.user);
    const refreshToken = await this.authService.generateRefreshToken(req.user);

    res.setHeader('Authorization', `Bearer ${accessToken})`);
    res.cookie('access_token', accessToken, { httpOnly: true });
    res.cookie('refresh_token', accessToken, { httpOnly: true });

    return { accessToken, refreshToken };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @Request() req: Request & { user: UserInterface },
  ): Promise<UserInterface> {
    return req.user;
  }
}
