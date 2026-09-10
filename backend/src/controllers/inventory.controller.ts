import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { InventoryService } from '../services/inventory.service';
import { inventorySchema } from '../schemas/inventory.schema';

const inventoryService = new InventoryService();

export class InventoryController {
  async getInventory(request: FastifyRequest, reply: FastifyReply) {
    try {
      const items = await inventoryService.getInventory(request.user);
      return reply.send({ success: true, data: items });
    } catch (err: any) {
      if (err.message === 'Kitchen not found for org') {
        return reply.status(404).send({ success: false, error: { message: err.message } });
      }
      return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
    }
  }

  async createInventoryItem(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = inventorySchema.parse(request.body);
      const item = await inventoryService.createInventoryItem(request.user, body);
      return reply.send({ success: true, data: item });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({ success: false, error: { message: err.issues } });
      }
      if (err.message === 'Unauthorized') {
        return reply.status(403).send({ success: false, error: { message: 'Unauthorized' } });
      }
      if (err.message === 'Kitchen not found for org') {
        return reply.status(404).send({ success: false, error: { message: err.message } });
      }
      return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
    }
  }
}
