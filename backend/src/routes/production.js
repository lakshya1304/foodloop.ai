"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = productionRoutes;
const production_controller_1 = require("../controllers/production.controller");
const productionController = new production_controller_1.ProductionController();
async function productionRoutes(fastify) {
    fastify.addHook('preValidation', async (request, reply) => {
        try {
            await request.jwtVerify({ onlyCookie: true });
        }
        catch (err) {
            reply.send(err);
        }
    });
    fastify.post('/record', productionController.recordProduction.bind(productionController));
    fastify.post('/consume-and-surplus', productionController.consumeAndSurplus.bind(productionController));
}
//# sourceMappingURL=production.js.map