import { Injectable } from '@nestjs/common';

@Injectable()
export class LogService {
  create(data: any) {
    console.log(data);
  }
}
