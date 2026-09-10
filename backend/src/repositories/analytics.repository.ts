import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AnalyticsRepository {
  async getLatestImpact() {
    return prisma.impactMetric.findFirst({
      orderBy: { date: 'desc' }
    });
  }

  async getKitchenDashboard(kitchenId: string) {
    const today = new Date();
    today.setHours(0,0,0,0);

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
          co2eAvoidedKg: true,
          moneySaved: true,
          waterSavedLiters: true
        }
      }),
      prisma.organization.count({ where: { type: 'KITCHEN' } }),
      prisma.organization.count({ where: { type: 'NGO' } })
    ]);

    return {
      totalSurplusRescued: impact._sum.wastePreventedKg || 0,
      co2Prevented: impact._sum.co2eAvoidedKg || 0,
      moneySaved: impact._sum.moneySaved || 0,
      waterSavedLiters: impact._sum.waterSavedLiters || 0,
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
  async getLeaderboard() {
    const kitchens = await prisma.organization.findMany({
      where: { type: 'KITCHEN' },
      include: { kitchens: { include: { surpluses: true } } }
    });

    const ngos = await prisma.organization.findMany({
      where: { type: 'NGO' },
      include: { ngos: { include: { redistributions: true } } }
    });

    const kitchenLeaderboard = kitchens.map(org => {
      const totalSurplus = org.kitchens.flatMap(k => k.surpluses).reduce((acc, s) => acc + s.quantitySurplus, 0);
      return { id: org.id, name: org.name, type: 'KITCHEN', score: totalSurplus };
    }).sort((a, b) => b.score - a.score).slice(0, 5);

    const ngoLeaderboard = ngos.map(org => {
      const totalReceived = org.ngos.flatMap(n => n.redistributions).reduce((acc, r) => acc + r.quantityMatched, 0);
      return { id: org.id, name: org.name, type: 'NGO', score: totalReceived };
    }).sort((a, b) => b.score - a.score).slice(0, 5);

    return { kitchens: kitchenLeaderboard, ngos: ngoLeaderboard };
  }
}
