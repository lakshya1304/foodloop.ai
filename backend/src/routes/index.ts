import { FastifyInstance } from 'fastify';
import authRoutes from './auth';
import inventoryRoutes from './inventory';
import analyticsRoutes from './analytics';
import ngoRoutes from './ngos';
import deliveryRoutes from './deliveries';
import aiRoutes from './ai';
import productionRoutes from './production';

export default async function routes(fastify: FastifyInstance) {
  fastify.register(authRoutes, { prefix: '/auth' });
  fastify.register(inventoryRoutes, { prefix: '/inventory' });
  fastify.register(analyticsRoutes, { prefix: '/analytics' });
  fastify.register(ngoRoutes, { prefix: '/ngos' });
  fastify.register(deliveryRoutes, { prefix: '/deliveries' });
  fastify.register(aiRoutes, { prefix: '/ai' });
  fastify.register(productionRoutes, { prefix: '/production' });
  fastify.register(require('./notifications').default, { prefix: '/notifications' });
  fastify.register(require('./sensors').default, { prefix: '/sensors' });
  fastify.register(require('./audit').default, { prefix: '/audit-logs' });
}
