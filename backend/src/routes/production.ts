import { FastifyInstance } from 'fastify';
import { ProductionController } from '../controllers/production.controller';

const productionController = new ProductionController();

export default async function productionRoutes(fastify: FastifyInstance) {
  fastify.addHook('preValidation', async (request, reply) => {
    try { await request.jwtVerify({ onlyCookie: true }) } catch (err) { reply.send(err) }
  });

  fastify.post('/record', productionController.recordProduction.bind(productionController));
  fastify.post('/consume-and-surplus', productionController.consumeAndSurplus.bind(productionController));
}
