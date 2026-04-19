import { Server, Socket } from 'socket.io';
import { z } from 'zod';
import { container } from 'tsyringe';
import { CaptainDomainService } from '@/domain/captain/captain.domain-service';
import { BusinessRuleError } from '@/domain/shared/errors';

export function registerCaptainLocationHandler(io: Server, socket: Socket): void {
  socket.on('location:update', async (payload: unknown) => {
    try {
      const captainId = socket.data.captainId;
      if (!captainId) return;

      const schema = z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
      });

      let data = payload;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          // Fall through, Zod will handle invalid types
        }
      }

      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        socket.emit('location:error', {
          message: 'Invalid payload.',
          errors: parsed.error.errors,
        });
        return;
      }

      const { lat, lng } = parsed.data;

      const captainDomainService = container.resolve(CaptainDomainService);

      await captainDomainService.updateCaptainLocation(captainId, lat, lng);

      const updateEvent = {
        captainId,
        lat,
        lng,
        updatedAt: new Date(),
      };

      io.to('admin').emit('location:updated', updateEvent);

      io.to(`captain:${captainId}`).emit('location:updated', updateEvent);
    } catch (error) {
      if (error instanceof BusinessRuleError) {
        socket.emit('location:error', { message: error.message });
      } else {
        console.error('Error updating captain location via socket:', error);
        socket.emit('location:error', { message: 'Internal error while updating location.' });
      }
    }
  });
}
