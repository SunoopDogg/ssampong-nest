import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtSign, UserInterface } from './interfaces/auth.interface';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getData() {
    return this.authService.getData();
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: { user: UserInterface }): Promise<JwtSign> {
    const accessToken = await this.authService.generateAccessToken(req.user);
    const refreshToken = await this.authService.generateRefreshToken(req.user);

    return { accessToken, refreshToken };
  }
}
