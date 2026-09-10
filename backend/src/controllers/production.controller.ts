import { FastifyRequest, FastifyReply } from 'fastify';
import { ProductionService } from '../services/production.service';
import { prodSchema, consSchema } from '../schemas/production.schema';
import { z } from 'zod';

const prodService = new ProductionService();

export class ProductionController {
  async recordProduction(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = prodSchema.parse(request.body);
      const data = await prodService.recordProduction(request.user, body);
      return reply.send({ success: true, data });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({ success: false, error: { message: err.issues } });
      }
      if (err.message === 'Kitchen not found') {
        return reply.status(404).send({ success: false, error: { message: 'Kitchen not found' } });
      }
      return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
    }
  }

  async consumeAndSurplus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = consSchema.parse(request.body);
      const data = await prodService.consumeAndCalculateSurplus(request.user, body);
      return reply.send({ success: true, data });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({ success: false, error: { message: err.issues } });
      }
      if (err.message === 'Kitchen not found') {
        return reply.status(404).send({ success: false, error: { message: 'Kitchen not found' } });
      }
      return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
    }
  }
}
