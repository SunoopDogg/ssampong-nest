/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';

import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;

  const whiteList = process.env.WHITE_LIST || '';
  const whiteListArray = whiteList.split(', ');

  app.enableCors({
    origin: whiteListArray,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

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
        pathRewrite: { [`^/${globalPrefix}/${msaApp}`]: '' },
        onProxyRes: (proxyRes, req, res) => {
          if (whiteListArray.includes(req.headers.origin))
            res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        },
      }),
    );
  });

  const config = new DocumentBuilder()
    .setTitle('Ssampong API')
    .setVersion('1.0')
    .addTag('ssampong')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document, {
    useGlobalPrefix: true,
  });

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
