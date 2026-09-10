import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import compress from '@fastify/compress';

import routes from './routes';

const server = fastify({ logger: true });
const prisma = new PrismaClient();

server.register(helmet, { global: true });

server.register(cors, {
  origin: true,
  credentials: true
});

server.register(cookie, {
  secret: process.env.COOKIE_SECRET || 'my-cookie-secret',
  hook: 'onRequest'
});

server.register(compress, { global: true });

server.addHook('onSend', (request, reply, payload, done) => {
  if (request.method === 'GET') {
    reply.header('Cache-Control', 'public, max-age=15, s-maxage=30, stale-while-revalidate=59');
  }
  done();
});

server.register(jwt, {
  secret: process.env.JWT_SECRET || 'supersecret',
  cookie: {
    cookieName: 'accessToken',
    signed: false
  }
});

server.register(routes, { prefix: '/api' });

// Basic check
server.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date() };
});

const start = async () => {
  try {
    await server.listen({ port: Number(process.env.PORT) || 3001, host: '0.0.0.0' });
    server.log.info(`Server running on port ${process.env.PORT || 3001}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
