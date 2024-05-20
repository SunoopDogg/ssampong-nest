import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { CreateUserPayload, UserInterface } from './interfaces/user.interface';
import { UserService } from './user.service';

import { JwtAuthGuard, Role, Roles } from '@ssampong-nest/auth';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getData() {
    return this.userService.getData();
  }

  @Post('create')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  async register(@Body() payload: CreateUserPayload): Promise<UserInterface> {
    return await this.userService.create(payload);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @Request() req: Request & { user: UserInterface },
  ): Promise<UserInterface> {
    return req.user;
  }
}
