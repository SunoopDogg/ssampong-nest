import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  postData(): { message: string } {
    return { message: 'Post API' };
  }

  putData(): { message: string } {
    return { message: 'Put API' };
  }

  patchData(): { message: string } {
    return { message: 'Patch API' };
  }

  deleteData(): { message: string } {
    return { message: 'Delete API' };
  }
}
