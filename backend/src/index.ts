import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import compress from '@fastify/compress';
import rateLimit from '@fastify/rate-limit';
import { z } from 'zod';

import routes from './routes';
import authPlugin from './plugins/auth';

const server = fastify({ logger: true });
const prisma = new PrismaClient();

server.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

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

server.register(authPlugin);

server.register(routes, { prefix: '/api' });

// Basic check
server.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date() };
});

// Global error handler
server.setErrorHandler((error, request, reply) => {
  server.log.error(error);
  
  if (error instanceof z.ZodError) {
    return reply.status(400).send({
      success: false,
      message: 'Validation Error',
      errors: error.issues
    });
  }

  if (error.validation) {
    return reply.status(400).send({
      success: false,
      message: 'Validation Error',
      errors: error.validation
    });
  }

  const statusCode = error.statusCode || (error.message.includes('not found') ? 404 : (error.message.includes('Unauthorized') || error.message.includes('Forbidden') ? 403 : 500));
  
  reply.status(statusCode).send({
    success: false,
    message: statusCode === 500 ? 'Internal Server Error' : error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
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
