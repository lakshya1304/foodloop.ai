import { Server } from 'socket.io';
import { FastifyInstance } from 'fastify';

let io: Server;

export function setupSocket(server: FastifyInstance) {
  io = new Server(server.server, {
    cors: {
      origin: true,
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    server.log.info(`Socket connected: ${socket.id}`);

    socket.on('join_room', (room) => {
      socket.join(room);
      server.log.info(`Socket ${socket.id} joined room ${room}`);
    });

    socket.on('leave_room', (room) => {
      socket.leave(room);
      server.log.info(`Socket ${socket.id} left room ${room}`);
    });

    socket.on('disconnect', () => {
      server.log.info(`Socket disconnected: ${socket.id}`);
    });
  });

  server.decorate('io', io);
}

export { io };
