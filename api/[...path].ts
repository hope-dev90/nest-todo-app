import { NestExpressApplication } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { getApp } from '../src/main';

export default async function handler(req: Request, res: Response) {
  const app = await getApp() as NestExpressApplication;
  await app.init();
  const server = app.getHttpServer();
  server.emit('request', req, res);
}
