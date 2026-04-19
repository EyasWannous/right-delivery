import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { env } from '@/infrastructure/config/env';
import { container } from 'tsyringe';
import { ICaptainRepository } from '@/domain/captain/repositories/captain.repository.interface';
import { CaptainStatus } from '@/domain/captain/entities/captain.enums';
import { registerAdminHandler } from '@/interfaces/socket/handlers/admin.handler';
import { registerCaptainLocationHandler } from '@/interfaces/socket/handlers/captain-location.handler';

let io: SocketIOServer | null = null;

export function initSocketServer(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.NODE_ENV === 'production' ? [] : '*',
      methods: ['GET', 'POST'],
    },

    transports: ['websocket', 'polling'],
  });

  io.use(async (socket: Socket, next) => {
    try {
      const role = socket.handshake.query.role;
      if (role === 'admin') {
        return next();
      }

      const captainId = socket.handshake.query.captainId;
      if (!captainId || typeof captainId !== 'string') {
        return next(new Error('Missing captainId in handshake query.'));
      }

      const captainRepository = container.resolve<ICaptainRepository>(ICaptainRepository);
      const captain = await captainRepository.findById(captainId);

      if (!captain) {
        return next(new Error('Captain not found.'));
      }

      if (captain.status !== CaptainStatus.Active) {
        return next(new Error('Captain is not active.'));
      }

      socket.data.captainId = captainId;
      next();
    } catch (error) {
      console.error('Socket Auth Error:', error);
      next(new Error('Internal Authentication Error.'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const role = socket.handshake.query.role;

    const currentIo = io as SocketIOServer;

    if (role !== 'admin') {
      const captainId = socket.data.captainId;
      socket.join(`captain:${captainId}`);
      socket.emit('connected', { message: 'Connected successfully', captainId });
      console.info(`Captain ${captainId} connected`);

      socket.on('disconnect', () => {
        console.info(`Captain ${captainId} disconnected`);
      });
    }

    registerAdminHandler(currentIo, socket);
    registerCaptainLocationHandler(currentIo, socket);
  });

  console.info('Socket.IO server initialized');
  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.IO server has not been initialized. Call initSocketServer() first.');
  }
  return io;
}
