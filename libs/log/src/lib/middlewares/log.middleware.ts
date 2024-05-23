import { Injectable, NestMiddleware } from '@nestjs/common';

import { LogService } from '../services/log.service';

import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  constructor(private readonly logService: LogService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      this.logService.create({
        ip,
        method,
        originalUrl,
        userAgent,
        statusCode,
        contentLength,
      });
    });

    next();
  }
}
