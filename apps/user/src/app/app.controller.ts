import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { CreateUserPayload, UserInterface } from './interfaces/user.interface';

import { JwtAuthGuard, Role, Roles } from '@ssampong-nest/auth';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('register')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  async register(
    @Body() createUserDto: CreateUserPayload,
  ): Promise<UserInterface> {
    return await this.appService.create(createUserDto);
  }
}
