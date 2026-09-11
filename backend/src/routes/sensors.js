"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sensorsRoutes;
const sensors_controller_1 = require("../controllers/sensors.controller");
const sensorsController = new sensors_controller_1.SensorsController();
async function sensorsRoutes(fastify) {
    fastify.addHook('preValidation', async (request, reply) => {
        try {
            await request.jwtVerify({ onlyCookie: true });
        }
        catch (err) {
            reply.send(err);
        }
    });
    fastify.get('/', sensorsController.getSensors.bind(sensorsController));
}
//# sourceMappingURL=sensors.js.map