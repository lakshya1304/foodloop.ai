"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionService = void 0;
const client_1 = require("@prisma/client");
const production_repository_1 = require("../repositories/production.repository");
const prisma = new client_1.PrismaClient();
const prodRepo = new production_repository_1.ProductionRepository();
class ProductionService {
    async recordProduction(user, input) {
        const kitchen = await prisma.kitchen.findFirst({ where: { organizationId: user.organizationId } });
        if (!kitchen)
            throw new Error('Kitchen not found');
        return prodRepo.recordProduction(kitchen.id, input.foodItem, input.quantityProduced, input.unit);
    }
    async consumeAndCalculateSurplus(user, input) {
        const kitchen = await prisma.kitchen.findFirst({ where: { organizationId: user.organizationId } });
        if (!kitchen)
            throw new Error('Kitchen not found');
        return prodRepo.consumeAndCalculateSurplus(kitchen.id, input.foodItem, input.quantityConsumed, input.unit);
    }
}
exports.ProductionService = ProductionService;
//# sourceMappingURL=production.service.js.map