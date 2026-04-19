import { Request, Response, NextFunction } from 'express';
import { env } from '@/infrastructure/config/env';

export function partnerAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || typeof apiKey !== 'string') {
    res.status(401).json({ error: 'Missing API key.' });
    return;
  }

  if (apiKey !== env.PARTNER_API_KEY) {
    res.status(403).json({ error: 'Invalid API key.' });
    return;
  }

  next();
}
