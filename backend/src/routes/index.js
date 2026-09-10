"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = routes;
const auth_1 = require("./auth");
const inventory_1 = require("./inventory");
const analytics_1 = require("./analytics");
const ngos_1 = require("./ngos");
const deliveries_1 = require("./deliveries");
const ai_1 = require("./ai");
const production_1 = require("./production");
async function routes(fastify) {
    fastify.register(auth_1.default, { prefix: '/auth' });
    fastify.register(inventory_1.default, { prefix: '/inventory' });
    fastify.register(analytics_1.default, { prefix: '/analytics' });
    fastify.register(ngos_1.default, { prefix: '/ngos' });
    fastify.register(deliveries_1.default, { prefix: '/deliveries' });
    fastify.register(ai_1.default, { prefix: '/ai' });
    fastify.register(production_1.default, { prefix: '/production' });
}
//# sourceMappingURL=index.js.map