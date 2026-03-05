/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let cachedHandler: ((req: VercelRequest, res: VercelResponse) => Promise<void>) | null = null;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return (req: VercelRequest, res: VercelResponse) => expressApp(req, res);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!cachedHandler) cachedHandler = await bootstrap();
  return cachedHandler(req, res);
}