"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NgoService = void 0;
const client_1 = require("@prisma/client");
const ngo_repository_1 = require("../repositories/ngo.repository");
const prisma = new client_1.PrismaClient();
const ngoRepo = new ngo_repository_1.NgoRepository();
class NgoService {
    async getAvailableSurplus() {
        return ngoRepo.findAvailableSurplus();
    }
    async getDashboardStats(user) {
        if (user.role !== 'NGO_STAFF') {
            throw new Error('Unauthorized');
        }
        if (!user.organizationId) {
            throw new Error('NGO not found');
        }
        const ngo = await prisma.nGO.findFirst({ where: { organizationId: user.organizationId } });
        if (!ngo)
            throw new Error('NGO not found');
        return ngoRepo.getDashboardStats(ngo.id);
    }
    async acceptSurplus(user, input) {
        if (user.role !== 'NGO_STAFF') {
            throw new Error('Unauthorized');
        }
        if (!user.organizationId) {
            throw new Error('NGO not found');
        }
        const ngo = await prisma.nGO.findFirst({ where: { organizationId: user.organizationId } });
        if (!ngo)
            throw new Error('NGO not found');
        return ngoRepo.acceptSurplusTransaction(input.surplusId, input.quantityRequested, ngo.id);
    }
}
exports.NgoService = NgoService;
//# sourceMappingURL=ngo.service.js.map