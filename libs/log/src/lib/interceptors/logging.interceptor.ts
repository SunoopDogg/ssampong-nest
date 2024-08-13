import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';

import { Response } from 'express';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const method = context.switchToHttp().getRequest<Request>().method;
    const url = decodeURIComponent(context.switchToHttp().getRequest().url);
    const app = context.getClass().name;

    const now = Date.now();

    let color = 37;
    switch (method) {
      case 'GET':
        color = 92;
        break;
      case 'POST':
        color = 93;
        break;
      case 'PUT':
      case 'PATCH':
        color = 95;
        break;
      case 'DELETE':
        color = 91;
        break;
    }

    Logger.log(`\x1b[33m<== \x1b[${color}m{ ${url} , ${method} }`, app);

    return next.handle().pipe(
      tap(() => {
        const { statusCode } = context.switchToHttp().getResponse<Response>();
        const delay = Date.now() - now;

        Logger.log(
          `\x1b[33m==> \x1b[${color}m{ ${url} , ${method} , ${statusCode} } \x1b[33m+${delay}ms`,
          app,
        );
      }),
      catchError((err) => {
        const { statusCode } = context.switchToHttp().getResponse<Response>();
        const delay = Date.now() - now;

        Logger.error(
          `\x1b[31m==> \x1b[${color}m{ ${url} , ${method} , ${statusCode} } \x1b[31m+${delay}ms`,
          err.stack,
          app,
        );

        throw err;
      }),
    );
  }
}
