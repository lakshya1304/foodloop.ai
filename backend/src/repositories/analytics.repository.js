"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AnalyticsRepository {
    async getLatestImpact() {
        return prisma.impactMetric.findFirst({
            orderBy: { date: 'desc' }
        });
    }
    async getKitchenDashboard(kitchenId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [predictions, productions, consumptions, surpluses, alerts] = await Promise.all([
            prisma.demandPrediction.findMany({ where: { kitchenId, targetDate: { gte: today } } }),
            prisma.productionRecord.findMany({ where: { kitchenId, date: { gte: today } } }),
            prisma.consumptionRecord.findMany({ where: { kitchenId, date: { gte: today } } }),
            prisma.surplus.findMany({ where: { kitchenId, status: 'AVAILABLE' } }),
            prisma.alert.findMany({ where: { isResolved: false } }) // Actually alerts might be per kitchen, but keeping current logic
        ]);
        return { predictions, productions, consumptions, activeSurpluses: surpluses, activeAlerts: alerts };
    }
    async getSystemOverview() {
        const [impact, kitchens, ngos] = await Promise.all([
            prisma.impactMetric.aggregate({
                _sum: {
                    wastePreventedKg: true,
                    co2eAvoidedKg: true
                }
            }),
            prisma.organization.count({ where: { type: 'KITCHEN' } }),
            prisma.organization.count({ where: { type: 'NGO' } })
        ]);
        return {
            totalSurplusRescued: impact._sum.wastePreventedKg || 0,
            co2Prevented: impact._sum.co2eAvoidedKg || 0,
            activeOrgs: {
                KITCHEN: kitchens,
                NGO: ngos
            }
        };
    }
    async getActivityTimeline() {
        const recentActivity = await prisma.redistribution.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                surplus: { include: { kitchen: true } },
                ngo: true
            }
        });
        return recentActivity.map(r => ({
            id: r.id,
            title: `${r.quantityMatched} ${r.surplus.unit} of ${r.surplus.foodItem} matched`,
            description: `From ${r.surplus.kitchen?.name} to ${r.ngo?.name}`,
            status: r.status,
            timestamp: r.createdAt
        }));
    }
    async getOrganizations() {
        return prisma.organization.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { users: true }
                }
            }
        });
    }
}
exports.AnalyticsRepository = AnalyticsRepository;
//# sourceMappingURL=analytics.repository.js.map