import { FastifyRequest, FastifyReply } from 'fastify';
import { AnalyticsService } from '../services/analytics.service';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
  async getImpact(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await analyticsService.getImpact();
      return reply.send({ success: true, data });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
    }
  }

  async getKitchenDashboard(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await analyticsService.getKitchenDashboard(request.user);
      return reply.send({ success: true, data });
    } catch (err: any) {
      if (err.message === 'Kitchen not found') {
        return reply.status(404).send({ success: false, error: { message: 'Kitchen not found' } });
      }
      return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
    }
  }

  async getSystemOverview(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await analyticsService.getSystemOverview(request.user);
      return reply.send({ success: true, data });
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        return reply.status(403).send({ success: false, error: { message: 'Unauthorized' } });
      }
      return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
    }
  }

  async getActivityTimeline(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await analyticsService.getActivityTimeline(request.user);
      return reply.send({ success: true, data });
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        return reply.status(403).send({ success: false, error: { message: 'Unauthorized' } });
      }
      return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
    }
  }

  async getOrganizations(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await analyticsService.getOrganizations(request.user);
      return reply.send({ success: true, data });
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        return reply.status(403).send({ success: false, error: { message: 'Unauthorized' } });
      }
      return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
    }
  }

  async getLeaderboard(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await analyticsService.getLeaderboard();
      return reply.send({ success: true, data });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
    }
  }
}
