import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { Connection } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // for the first init db
  //   const connection = app.get(Connection);
  //   await connection.runMigrations();

  // Enable CORS
  app.enableCors({
    origin: ['https://kyc-seven-xi.vercel.app', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
