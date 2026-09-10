import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DeliveryRepository {
  async findDriverByUserId(userId: string) {
    return prisma.driver.findUnique({ where: { userId } });
  }

  async findDeliveriesByDriverId(driverId: string) {
    return prisma.delivery.findMany({
      where: { driverId },
      include: {
        redistribution: {
          include: { surplus: { include: { kitchen: true } }, ngo: true }
        }
      }
    });
  }

  async updateDeliveryStatusTransaction(deliveryId: string, status: string) {
    return prisma.$transaction(async (tx) => {
      const delivery = await tx.delivery.update({
        where: { id: deliveryId },
        data: { status }
      });

      if (status === 'PICKED_UP') {
        await tx.redistribution.update({
          where: { id: delivery.redistributionId },
          data: { status: 'PICKED_UP' }
        });
      } else if (status === 'DELIVERED') {
        await tx.redistribution.update({
          where: { id: delivery.redistributionId },
          data: { status: 'DELIVERED' }
        });
      }

      return delivery;
    });
  }
}
