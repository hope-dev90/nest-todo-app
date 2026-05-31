import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

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

  // API routes under /api so GET /notes (SPA page) doesn't collide with GET /api/notes
  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();