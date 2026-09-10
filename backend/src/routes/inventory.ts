import { FastifyInstance } from 'fastify';
import { InventoryController } from '../controllers/inventory.controller';

const inventoryController = new InventoryController();

export default async function inventoryRoutes(fastify: FastifyInstance) {
  fastify.addHook('preValidation', async (request, reply) => {
    try { await request.jwtVerify({ onlyCookie: true }) } catch (err) { reply.send(err) }
  });

  fastify.get('/', inventoryController.getInventory.bind(inventoryController));
  fastify.post('/', inventoryController.createInventoryItem.bind(inventoryController));
}
