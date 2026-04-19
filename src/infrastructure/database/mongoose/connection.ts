import mongoose from 'mongoose';
import { env } from '@/infrastructure/config/env';
import { logger } from '@/infrastructure/config/logger';

export async function connectDatabase(): Promise<void> {
  mongoose.connection.on('connected', () => {
    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  });

  mongoose.connection.on('error', (err: Error) => {
    logger.error(err, 'MongoDB connection error');
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45_000,
  });
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
}
