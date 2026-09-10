import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SensorsController {
  async getSensors(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).user;
      
      const kitchen = await prisma.kitchen.findFirst({
        where: { organizationId: user.organizationId }
      });

      if (!kitchen) {
        return reply.status(404).send({ success: false, error: { message: 'Kitchen not found for user' } });
      }

      const sensors = await prisma.sensor.findMany({
        where: { kitchenId: kitchen.id },
        include: {
          readings: {
            orderBy: { timestamp: 'desc' },
            take: 1
          }
        }
      });
      
      return reply.send({ success: true, data: sensors });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: { message: err.message || 'Error fetching sensors' }});
    }
  }
}
