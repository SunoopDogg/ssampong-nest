/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;

  const msaAppList = process.env.MSA_APP_LIST || '';
  const msaPortList = process.env.MSA_PORT_LIST || '';

  const msaAppListArray = msaAppList.split(', ');
  const msaPortListArray = msaPortList.split(', ');

  msaAppListArray.forEach((msaApp, index) => {
    app.use(
      `/${globalPrefix}/${msaApp}`,
      createProxyMiddleware({
        target: `http://localhost:${msaPortListArray[index]}/${globalPrefix}`,
        changeOrigin: true,
      }),
    );
  });

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
