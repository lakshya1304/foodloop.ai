"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const client_1 = require("@prisma/client");
const inventory_repository_1 = require("../repositories/inventory.repository");
const prisma = new client_1.PrismaClient();
const inventoryRepo = new inventory_repository_1.InventoryRepository();
class InventoryService {
    async getInventory(user) {
        let kitchenId;
        if (user.role === 'KITCHEN_MANAGER') {
            if (!user.organizationId)
                throw new Error('Kitchen not found for org');
            const kitchen = await prisma.kitchen.findFirst({ where: { organizationId: user.organizationId } });
            if (!kitchen)
                throw new Error('Kitchen not found for org');
            kitchenId = kitchen.id;
        }
        return inventoryRepo.findManyByKitchenId(kitchenId);
    }
    async createInventoryItem(user, input) {
        if (user.role !== 'KITCHEN_MANAGER' && user.role !== 'ADMIN') {
            throw new Error('Unauthorized');
        }
        if (!user.organizationId)
            throw new Error('Kitchen not found for org');
        const kitchen = await prisma.kitchen.findFirst({ where: { organizationId: user.organizationId } });
        if (!kitchen)
            throw new Error('Kitchen not found for org');
        return inventoryRepo.create({
            kitchenId: kitchen.id,
            productName: input.productName,
            category: input.category,
            quantity: input.quantity,
            unit: input.unit,
            batchNumber: input.batchNumber ?? null,
            barcode: input.barcode ?? null,
            manufacturingDate: input.manufacturingDate ? new Date(input.manufacturingDate) : null,
            expiryDate: input.expiryDate ? new Date(input.expiryDate) : null,
            storageLocation: input.storageLocation ?? null,
            status: 'SAFE'
        });
    }
}
exports.InventoryService = InventoryService;
//# sourceMappingURL=inventory.service.js.map