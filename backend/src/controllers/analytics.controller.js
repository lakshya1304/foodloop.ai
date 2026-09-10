"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analytics_service_1 = require("../services/analytics.service");
const analyticsService = new analytics_service_1.AnalyticsService();
class AnalyticsController {
    async getImpact(request, reply) {
        try {
            const data = await analyticsService.getImpact();
            return reply.send({ success: true, data });
        }
        catch (err) {
            return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
        }
    }
    async getKitchenDashboard(request, reply) {
        try {
            const data = await analyticsService.getKitchenDashboard(request.user);
            return reply.send({ success: true, data });
        }
        catch (err) {
            if (err.message === 'Kitchen not found') {
                return reply.status(404).send({ success: false, error: { message: 'Kitchen not found' } });
            }
            return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
        }
    }
    async getSystemOverview(request, reply) {
        try {
            const data = await analyticsService.getSystemOverview(request.user);
            return reply.send({ success: true, data });
        }
        catch (err) {
            if (err.message === 'Unauthorized') {
                return reply.status(403).send({ success: false, error: { message: 'Unauthorized' } });
            }
            return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
        }
    }
    async getActivityTimeline(request, reply) {
        try {
            const data = await analyticsService.getActivityTimeline(request.user);
            return reply.send({ success: true, data });
        }
        catch (err) {
            if (err.message === 'Unauthorized') {
                return reply.status(403).send({ success: false, error: { message: 'Unauthorized' } });
            }
            return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
        }
    }
    async getOrganizations(request, reply) {
        try {
            const data = await analyticsService.getOrganizations(request.user);
            return reply.send({ success: true, data });
        }
        catch (err) {
            if (err.message === 'Unauthorized') {
                return reply.status(403).send({ success: false, error: { message: 'Unauthorized' } });
            }
            return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
        }
    }
}
exports.AnalyticsController = AnalyticsController;
//# sourceMappingURL=analytics.controller.js.map