"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demandPredictionSchema = exports.ocrSchema = void 0;
const zod_1 = require("zod");
exports.ocrSchema = zod_1.z.object({
    text: zod_1.z.string().optional(),
    imageParts: zod_1.z.array(zod_1.z.object({
        inlineData: zod_1.z.object({
            data: zod_1.z.string(),
            mimeType: zod_1.z.string()
        })
    })).optional()
});
exports.demandPredictionSchema = zod_1.z.object({
    kitchenId: zod_1.z.string().optional(),
    targetDate: zod_1.z.string().optional(),
    historicalDemand: zod_1.z.any().optional()
});
//# sourceMappingURL=ai.schema.js.map