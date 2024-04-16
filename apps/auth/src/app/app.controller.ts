import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AppService } from './app.service';
import { UserDto } from './dto/user.dto';

import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(
    @Request() req: { user: UserDto },
    @Res({ passthrough: true })
    res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken } = await this.appService.login(req.user);

    res.setHeader('Authorization', `Bearer ${accessToken})`);
    res.cookie('access_token', accessToken, { httpOnly: true });

    return { accessToken };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req): Promise<UserDto> {
    return req.user;
  }
}
