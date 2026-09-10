import { FastifyInstance } from 'fastify';
import { DeliveryController } from '../controllers/delivery.controller';

const deliveryController = new DeliveryController();

export default async function deliveryRoutes(fastify: FastifyInstance) {
  fastify.addHook('preValidation', async (request, reply) => {
    try { await request.jwtVerify({ onlyCookie: true }) } catch (err) { reply.send(err) }
  });

  fastify.get('/', deliveryController.getDeliveries.bind(deliveryController));
  fastify.post('/:id/status', deliveryController.updateDeliveryStatus.bind(deliveryController));
}
