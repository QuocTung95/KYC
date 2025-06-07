import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Connection } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const connection = app.get(Connection);
  await connection.runMigrations();
  // Enable CORS
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow some request without origin (Postman, server-side...)

      const allowedPattern =
        /^https:\/\/kyc-[\w-]+\.tungdevs-projects\.vercel\.app$/;

      if (allowedPattern.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
