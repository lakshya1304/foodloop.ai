"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const zod_1 = require("zod");
const inventory_service_1 = require("../services/inventory.service");
const inventory_schema_1 = require("../schemas/inventory.schema");
const inventoryService = new inventory_service_1.InventoryService();
class InventoryController {
    async getInventory(request, reply) {
        try {
            const items = await inventoryService.getInventory(request.user);
            return reply.send({ success: true, data: items });
        }
        catch (err) {
            if (err.message === 'Kitchen not found for org') {
                return reply.status(404).send({ success: false, error: { message: err.message } });
            }
            return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
        }
    }
    async createInventoryItem(request, reply) {
        try {
            const body = inventory_schema_1.inventorySchema.parse(request.body);
            const item = await inventoryService.createInventoryItem(request.user, body);
            return reply.send({ success: true, data: item });
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
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
exports.InventoryController = InventoryController;
//# sourceMappingURL=inventory.controller.js.map