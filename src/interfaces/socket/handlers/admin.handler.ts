import { Server, Socket } from 'socket.io';

export function registerAdminHandler(io: Server, socket: Socket): void {
  const role = socket.handshake.query.role;
  if (role === 'admin') {
    socket.join('admin');
    socket.emit('connected', { message: 'Joined admin room. Listening for location updates.' });
    console.info('Admin joined admin room');
  }
}
