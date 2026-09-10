"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const ai_service_1 = require("../services/ai.service");
const ai_schema_1 = require("../schemas/ai.schema");
const zod_1 = require("zod");
const aiService = new ai_service_1.AiService();
class AiController {
    async ocrExtract(request, reply) {
        try {
            const body = ai_schema_1.ocrSchema.parse(request.body);
            const data = await aiService.ocrExtract(body);
            return reply.send({ success: true, data });
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                return reply.status(400).send({ success: false, error: { message: err.issues } });
            }
            if (err.message === 'AI service unavailable') {
                return reply.status(503).send({ success: false, error: { message: err.message } });
            }
            return reply.status(400).send({ success: false, error: { message: err.message || 'Error' } });
        }
    }
    async demandPrediction(request, reply) {
        try {
            const body = ai_schema_1.demandPredictionSchema.parse(request.body);
            const data = await aiService.demandPrediction(body);
            return reply.send({ success: true, data });
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                return reply.status(400).send({ success: false, error: { message: err.issues } });
            }
            return reply.status(500).send({ success: false, error: { message: err.message || 'Error' } });
        }
    }
}
exports.AiController = AiController;
//# sourceMappingURL=ai.controller.js.map