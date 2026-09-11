import { PrismaClient } from '@prisma/client';
import { AnalyticsRepository } from '../repositories/analytics.repository';

const prisma = new PrismaClient();
const analyticsRepo = new AnalyticsRepository();

export class AnalyticsService {
  async getImpact() {
    return analyticsRepo.getLatestImpact();
  }

  async getKitchenDashboard(user: any) {
    if (!user.organizationId) throw new Error('Kitchen not found');
    const kitchen = await prisma.kitchen.findFirst({ where: { organizationId: user.organizationId }});
    if (!kitchen) throw new Error('Kitchen not found');

    return analyticsRepo.getKitchenDashboard(kitchen.id);
  }

  async getSystemOverview(user: any) {
    if (user.role !== 'ADMIN') throw new Error('Unauthorized');
    return analyticsRepo.getSystemOverview();
  }

  async getActivityTimeline(user: any) {
    if (user.role !== 'ADMIN') throw new Error('Unauthorized');
    return analyticsRepo.getActivityTimeline();
  }

  async getOrganizations(user: any) {
    if (user.role !== 'ADMIN') throw new Error('Unauthorized');
    return analyticsRepo.getOrganizations();
  }

  async getLeaderboard() {
    return analyticsRepo.getLeaderboard();
  }
}
