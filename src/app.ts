import express, { Application, Request, Response } from 'express';
import captainRouter from '@/interfaces/http/routes/captain.routes';
import orderRouter from '@/interfaces/http/routes/order.routes';
import reportRouter from '@/interfaces/http/routes/report.routes';
import partnerRouter from '@/interfaces/http/routes/partner.routes';
import { errorMiddleware } from '@/interfaces/http/middlewares/error.middleware';
import swaggerUi from 'swagger-ui-express';
import yamljs from 'yamljs';
import path from 'path';
import pinoHttp from 'pino-http';
import { logger } from '@/infrastructure/config/logger';

export function createApp(): Application {
  const app = express();

  app.use(pinoHttp({ logger }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/captains', captainRouter);
  app.use('/orders', orderRouter);
  app.use('/reports', reportRouter);
  app.use('/partner', partnerRouter);

  const swaggerDocument = yamljs.load(path.join(process.cwd(), 'swagger.yaml'));
  app.use('/swagger/index.html', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(errorMiddleware);

  return app;
}
