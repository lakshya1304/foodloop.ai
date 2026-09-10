"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryController = void 0;
const delivery_service_1 = require("../services/delivery.service");
const delivery_schema_1 = require("../schemas/delivery.schema");
const zod_1 = require("zod");
const deliveryService = new delivery_service_1.DeliveryService();
class DeliveryController {
    async getDeliveries(request, reply) {
        try {
            const deliveries = await deliveryService.getDeliveries(request.user);
            return reply.send({ success: true, data: deliveries });
        }
        catch (err) {
            if (err.message === 'Unauthorized') {
                return reply.status(403).send({ success: false, error: { message: 'Unauthorized' } });
            }
            if (err.message === 'Driver profile not found') {
                return reply.status(404).send({ success: false, error: { message: 'Driver profile not found' } });
            }
            return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
        }
    }
    async updateDeliveryStatus(request, reply) {
        try {
            const { id } = request.params;
            const body = delivery_schema_1.deliveryStatusSchema.parse(request.body);
            const delivery = await deliveryService.updateDeliveryStatus(id, body);
            return reply.send({ success: true, data: delivery });
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                return reply.status(400).send({ success: false, error: { message: err.issues } });
            }
            return reply.status(400).send({ success: false, error: { message: err.message || 'Error' } });
        }
    }
}
exports.DeliveryController = DeliveryController;
//# sourceMappingURL=delivery.controller.js.map