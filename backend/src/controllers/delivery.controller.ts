import { FastifyRequest, FastifyReply } from 'fastify';
import { DeliveryService } from '../services/delivery.service';
import { deliveryStatusSchema } from '../schemas/delivery.schema';
import { z } from 'zod';

const deliveryService = new DeliveryService();

export class DeliveryController {
  async getDeliveries(request: FastifyRequest, reply: FastifyReply) {
    try {
      const deliveries = await deliveryService.getDeliveries(request.user);
      return reply.send({ success: true, data: deliveries });
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        return reply.status(403).send({ success: false, error: { message: 'Unauthorized' } });
      }
      if (err.message === 'Driver profile not found') {
        return reply.status(404).send({ success: false, error: { message: 'Driver profile not found' } });
      }
      return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
    }
  }

  async updateDeliveryStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const body = deliveryStatusSchema.parse(request.body);
      const delivery = await deliveryService.updateDeliveryStatus(id, body);
      return reply.send({ success: true, data: delivery });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({ success: false, error: { message: err.issues } });
      }
      return reply.status(400).send({ success: false, error: { message: err.message || 'Error' }});
    }
  }
}
