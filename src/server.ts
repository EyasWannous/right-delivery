import 'reflect-metadata';

import '@/infrastructure/config/container';

import http from 'http';
import { env } from '@/infrastructure/config/env';
import { connectDatabase, disconnectDatabase } from '@/infrastructure/database/mongoose/connection';
import { initSocketServer } from '@/infrastructure/socket/socket.server';
import { createApp } from '@/app';
import { logger } from '@/infrastructure/config/logger';

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const app = createApp();

  const httpServer = http.createServer(app);

  initSocketServer(httpServer);

  httpServer.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`\nReceived ${signal}. Shutting down gracefully…`);

    httpServer.close(async () => {
      logger.info('HTTP server closed');
      await disconnectDatabase();
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Graceful shutdown timed out — forcing exit');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error({ reason }, 'Unhandled rejection');
    void shutdown('unhandledRejection');
  });

  process.on('uncaughtException', (err) => {
    logger.error(err, 'Uncaught exception');
    void shutdown('uncaughtException');
  });
}

void bootstrap();
