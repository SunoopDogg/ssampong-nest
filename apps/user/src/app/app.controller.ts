import { Body, Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { CreateUserDto, UserDto } from './dto/user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return await this.appService.create(createUserDto);
  }
}
