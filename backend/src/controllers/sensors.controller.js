"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorsController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class SensorsController {
    async getSensors(request, reply) {
        try {
            const user = request.user;
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
        }
        catch (err) {
            return reply.status(500).send({ success: false, error: { message: err.message || 'Error fetching sensors' } });
        }
    }
}
exports.SensorsController = SensorsController;
//# sourceMappingURL=sensors.controller.js.map