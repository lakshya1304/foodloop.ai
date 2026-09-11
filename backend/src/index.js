"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = require("fastify");
const cors_1 = require("@fastify/cors");
const jwt_1 = require("@fastify/jwt");
const client_1 = require("@prisma/client");
const helmet_1 = require("@fastify/helmet");
const cookie_1 = require("@fastify/cookie");
const compress_1 = require("@fastify/compress");
const routes_1 = require("./routes");
const auth_1 = require("./plugins/auth");
const server = (0, fastify_1.default)({ logger: true });
const prisma = new client_1.PrismaClient();
server.register(helmet_1.default, { global: true });
server.register(cors_1.default, {
    origin: true,
    credentials: true
});
server.register(cookie_1.default, {
    secret: process.env.COOKIE_SECRET || 'my-cookie-secret',
    hook: 'onRequest'
});
server.register(compress_1.default, { global: true });
server.addHook('onSend', (request, reply, payload, done) => {
    if (request.method === 'GET') {
        reply.header('Cache-Control', 'public, max-age=15, s-maxage=30, stale-while-revalidate=59');
    }
    done();
});
server.register(jwt_1.default, {
    secret: process.env.JWT_SECRET || 'supersecret',
    cookie: {
        cookieName: 'accessToken',
        signed: false
    }
});
server.register(auth_1.default);
server.register(routes_1.default, { prefix: '/api' });
// Basic check
server.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date() };
});
const start = async () => {
    try {
        await server.listen({ port: Number(process.env.PORT) || 3001, host: '0.0.0.0' });
        server.log.info(`Server running on port ${process.env.PORT || 3001}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map