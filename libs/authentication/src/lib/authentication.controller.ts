import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthenticationAppService } from './authentication.service';
import { UserDto } from './dto/user.dto';

import { Response } from 'express';

@Controller()
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationAppService,
  ) {}

  @Get()
  getData() {
    return this.authenticationService.getData();
  }

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(
    @Request() req: { user: UserDto },
    @Res({ passthrough: true })
    res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken } = await this.authenticationService.login(req.user);

    res.setHeader('Authorization', `Bearer ${accessToken})`);
    res.cookie('access_token', accessToken, { httpOnly: true });

    return { accessToken };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req: any): Promise<UserDto> {
    return req.user;
  }
}
