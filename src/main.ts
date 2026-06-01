import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
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

  console.log("PORT:", process.env.PORT);
  const port = process.env.PORT || 3000;

  if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Server running on port ${port}`);
  }

  return app;
}

let appPromise: Promise<NestExpressApplication>;

export async function getApp() {
  if (!appPromise) {
    appPromise = bootstrap();
  }
  return appPromise;
}

// Run bootstrap when not in Vercel serverless environment
if (process.env.VERCEL !== '1') {
  bootstrap();
}
