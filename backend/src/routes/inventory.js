"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = inventoryRoutes;
const inventory_controller_1 = require("../controllers/inventory.controller");
const inventoryController = new inventory_controller_1.InventoryController();
async function inventoryRoutes(fastify) {
    fastify.addHook('preValidation', async (request, reply) => {
        try {
            await request.jwtVerify({ onlyCookie: true });
        }
        catch (err) {
            reply.send(err);
        }
    });
    fastify.get('/', inventoryController.getInventory.bind(inventoryController));
    fastify.post('/', inventoryController.createInventoryItem.bind(inventoryController));
}
//# sourceMappingURL=inventory.js.map