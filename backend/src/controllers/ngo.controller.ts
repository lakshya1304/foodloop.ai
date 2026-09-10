import { FastifyRequest, FastifyReply } from 'fastify';
import { NgoService } from '../services/ngo.service';
import { acceptSurplusSchema } from '../schemas/ngo.schema';
import { z } from 'zod';

const ngoService = new NgoService();

export class NgoController {
  async getAvailableSurplus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const surpluses = await ngoService.getAvailableSurplus();
      return reply.send({ success: true, data: surpluses });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
    }
  }

  async getDashboardStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const stats = await ngoService.getDashboardStats(request.user);
      return reply.send({ success: true, data: stats });
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        return reply.status(403).send({ success: false, error: { message: 'Unauthorized' } });
      }
      if (err.message === 'NGO not found') {
        return reply.status(404).send({ success: false, error: { message: 'NGO not found' } });
      }
      return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
    }
  }

  async acceptSurplus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = acceptSurplusSchema.parse(request.body);
      const result = await ngoService.acceptSurplus(request.user, body);
      return reply.send({ success: true, data: result });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({ success: false, error: { message: err.issues } });
      }
      if (err.message === 'Unauthorized') {
        return reply.status(403).send({ success: false, error: { message: 'Unauthorized' } });
      }
      if (err.message === 'NGO not found') {
        return reply.status(404).send({ success: false, error: { message: 'NGO not found' } });
      }
      return reply.status(400).send({ success: false, error: { message: err.message || 'Error' }});
    }
  }
}
