import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS cho frontend gọi được API
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4321',
    credentials: true,
  });

  // Global validation pipe - tự động validate DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ properties không có trong DTO
      forbidNonWhitelisted: true, // Throw error nếu có unknown properties
      transform: true, // Tự động transform types
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}/graphql`);
}

bootstrap();
