import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post()
  postData() {
    return this.appService.postData();
  }

  @Put()
  putData() {
    return this.appService.putData();
  }

  @Patch()
  patchData() {
    return this.appService.patchData();
  }

  @Delete()
  deleteData() {
    return this.appService.deleteData();
  }
}
