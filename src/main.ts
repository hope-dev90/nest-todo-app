import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { AppModule } from './app.module';

export async function bootstrap(): Promise<NestExpressApplication> {
  const uploadsDir = join(process.cwd(), 'uploads', 'agenda');
  if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/api/uploads/',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  return app;
}

let appPromise: Promise<NestExpressApplication>;

export async function getApp(): Promise<NestExpressApplication> {
  if (!appPromise) {
    appPromise = bootstrap();
  }
  return appPromise;
}

if (process.env.VERCEL !== '1') {
  (async () => {
    const port = process.env.PORT || 3000;
    const app = await bootstrap();
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Server running on port ${port}`);
  })();
}
