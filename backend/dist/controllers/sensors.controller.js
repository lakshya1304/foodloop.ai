"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorsController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class SensorsController {
    async getSensors(request, reply) {
        const user = request.user;
        const kitchen = await prisma.kitchen.findFirst({
            where: { organizationId: user.organizationId }
        });
        if (!kitchen) {
            const err = new Error('Kitchen not found for user');
            err.statusCode = 404;
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
exports.SensorsController = SensorsController;
//# sourceMappingURL=sensors.controller.js.map