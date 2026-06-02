import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log("=== Starting NestJS App ===");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("PORT:", process.env.PORT);

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

  // Exclude static/frontend routes from the API prefix
  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });

  // SPA fallback: serve index.html for any unmatched non-API route
  const clientBuild = join(process.cwd(), 'client', 'build');
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get(/^(?!\/api).*$/, (_req: any, res: any) => {
    res.sendFile(join(clientBuild, 'index.html'));
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();
