"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NgoController = void 0;
const ngo_service_1 = require("../services/ngo.service");
const ngo_schema_1 = require("../schemas/ngo.schema");
const zod_1 = require("zod");
const ngoService = new ngo_service_1.NgoService();
class NgoController {
    async getAvailableSurplus(request, reply) {
        try {
            const surpluses = await ngoService.getAvailableSurplus();
            return reply.send({ success: true, data: surpluses });
        }
        catch (err) {
            return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
        }
    }
    async getDashboardStats(request, reply) {
        try {
            const stats = await ngoService.getDashboardStats(request.user);
            return reply.send({ success: true, data: stats });
        }
        catch (err) {
            if (err.message === 'Unauthorized') {
                return reply.status(403).send({ success: false, error: { message: 'Unauthorized' } });
            }
            if (err.message === 'NGO not found') {
                return reply.status(404).send({ success: false, error: { message: 'NGO not found' } });
            }
            return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
        }
    }
    async acceptSurplus(request, reply) {
        try {
            const body = ngo_schema_1.acceptSurplusSchema.parse(request.body);
            const result = await ngoService.acceptSurplus(request.user, body);
            return reply.send({ success: true, data: result });
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                return reply.status(400).send({ success: false, error: { message: err.issues } });
            }
            if (err.message === 'Unauthorized') {
                return reply.status(403).send({ success: false, error: { message: 'Unauthorized' } });
            }
            if (err.message === 'NGO not found') {
                return reply.status(404).send({ success: false, error: { message: 'NGO not found' } });
            }
            return reply.status(400).send({ success: false, error: { message: err.message || 'Error' } });
        }
    }
}
exports.NgoController = NgoController;
//# sourceMappingURL=ngo.controller.js.map