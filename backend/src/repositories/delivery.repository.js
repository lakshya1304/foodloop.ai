"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class DeliveryRepository {
    async findDriverByUserId(userId) {
        return prisma.driver.findUnique({ where: { userId } });
    }
    async findDeliveriesByDriverId(driverId) {
        return prisma.delivery.findMany({
            where: { driverId },
            include: {
                redistribution: {
                    include: { surplus: { include: { kitchen: true } }, ngo: true }
                }
            }
        });
    }
    async updateDeliveryStatusTransaction(deliveryId, status) {
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
            }
            else if (status === 'DELIVERED') {
                await tx.redistribution.update({
                    where: { id: delivery.redistributionId },
                    data: { status: 'DELIVERED' }
                });
            }
            return delivery;
        });
    }
}
exports.DeliveryRepository = DeliveryRepository;
//# sourceMappingURL=delivery.repository.js.map