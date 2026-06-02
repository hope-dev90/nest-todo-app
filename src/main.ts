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
  console.log("CWD:", process.cwd());

  const uploadsDir = join(process.cwd(), 'uploads', 'agenda');
  if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS must be enabled before any other middleware
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Serve uploaded files
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  // Serve React static build
  const clientBuildPath = join(process.cwd(), 'client', 'build');
  console.log("Client build path:", clientBuildPath);
  console.log("Client build exists:", existsSync(clientBuildPath));

  if (existsSync(clientBuildPath)) {
    app.useStaticAssets(clientBuildPath);

    // SPA fallback — all non-API routes return index.html
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.get(/^(?!\/api).*$/, (_req: any, res: any) => {
      res.sendFile(join(clientBuildPath, 'index.html'));
    });
  }

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();
