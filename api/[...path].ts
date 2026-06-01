import { Request, Response } from 'express';
import { getApp } from '../src/main';

export default async function handler(req: Request, res: Response) {
  const app = await getApp();
  const server = app.getHttpServer();
  server(req, res);
}
