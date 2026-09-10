"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionController = void 0;
const production_service_1 = require("../services/production.service");
const production_schema_1 = require("../schemas/production.schema");
const zod_1 = require("zod");
const prodService = new production_service_1.ProductionService();
class ProductionController {
    async recordProduction(request, reply) {
        try {
            const body = production_schema_1.prodSchema.parse(request.body);
            const data = await prodService.recordProduction(request.user, body);
            return reply.send({ success: true, data });
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                return reply.status(400).send({ success: false, error: { message: err.issues } });
            }
            if (err.message === 'Kitchen not found') {
                return reply.status(404).send({ success: false, error: { message: 'Kitchen not found' } });
            }
            return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
        }
    }
    async consumeAndSurplus(request, reply) {
        try {
            const body = production_schema_1.consSchema.parse(request.body);
            const data = await prodService.consumeAndCalculateSurplus(request.user, body);
            return reply.send({ success: true, data });
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                return reply.status(400).send({ success: false, error: { message: err.issues } });
            }
            if (err.message === 'Kitchen not found') {
                return reply.status(404).send({ success: false, error: { message: 'Kitchen not found' } });
            }
            return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
        }
    }
}
exports.ProductionController = ProductionController;
//# sourceMappingURL=production.controller.js.map