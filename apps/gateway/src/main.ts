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

  const whiteList = process.env.WHITE_LIST || '';
  const whiteListArray = whiteList.split(', ');

  msaAppListArray.forEach((msaApp, index) => {
    app.use(
      `/${globalPrefix}/${msaApp}`,
      createProxyMiddleware({
        target: `http://localhost:${msaPortListArray[index]}/${globalPrefix}`,
        changeOrigin: true,
        pathRewrite: { [`^/${globalPrefix}/${msaApp}`]: '' },
        onProxyRes: (proxyRes, req, res) => {
          if (whiteListArray.includes(req.headers.origin))
            res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        },
      }),
    );
  });

  app.enableCors({
    origin: whiteListArray,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
