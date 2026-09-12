import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SensorsController {
  async getSensors(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    
    const kitchen = await prisma.kitchen.findFirst({
      where: { organizationId: user.organizationId }
    });

    if (!kitchen) {
      const err = new Error('Kitchen not found for user');
      (err as any).statusCode = 404;
      throw err;
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
  }
}
