"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const client_1 = require("@prisma/client");
const analytics_repository_1 = require("../repositories/analytics.repository");
const prisma = new client_1.PrismaClient();
const analyticsRepo = new analytics_repository_1.AnalyticsRepository();
class AnalyticsService {
    async getImpact() {
        return analyticsRepo.getLatestImpact();
    }
    async getKitchenDashboard(user) {
        const kitchen = await prisma.kitchen.findFirst({ where: { organizationId: user.organizationId } });
        if (!kitchen)
            throw new Error('Kitchen not found');
        return analyticsRepo.getKitchenDashboard(kitchen.id);
    }
    async getSystemOverview(user) {
        if (user.role !== 'ADMIN')
            throw new Error('Unauthorized');
        return analyticsRepo.getSystemOverview();
    }
    async getActivityTimeline(user) {
        if (user.role !== 'ADMIN')
            throw new Error('Unauthorized');
        return analyticsRepo.getActivityTimeline();
    }
    async getOrganizations(user) {
        if (user.role !== 'ADMIN')
            throw new Error('Unauthorized');
        return analyticsRepo.getOrganizations();
    }
}
exports.AnalyticsService = AnalyticsService;
//# sourceMappingURL=analytics.service.js.map