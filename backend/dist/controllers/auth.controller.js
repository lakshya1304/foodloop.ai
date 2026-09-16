"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const audit_service_1 = require("../services/audit.service");
const auth_schema_1 = require("../schemas/auth.schema");
const authService = new auth_service_1.AuthService();
const auditService = new audit_service_1.AuditService();
class AuthController {
    async register(request, reply) {
        const data = auth_schema_1.registerSchema.parse(request.body);
        const user = await authService.registerUser(data);
        await auditService.logAction({
            entityId: user.id,
            entityType: 'USER',
            action: 'REGISTER',
            actorId: user.id,
            details: { email: user.email, role: user.role }
        });
        const fastify = request.server;
        const accessToken = fastify.jwt.sign({ id: user.id, role: user.role, organizationId: user.organizationId }, { expiresIn: '15m' });
        const refreshToken = await authService.createRefreshToken(user.id);
        reply.setCookie('accessToken', accessToken, {
            path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', maxAge: 15 * 60
        });
        reply.setCookie('refreshToken', refreshToken, {
            path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', maxAge: 7 * 24 * 60 * 60
        });
        return reply.status(201).send({
            success: true,
            data: { user: { id: user.id, email: user.email, name: user.name, role: user.role, organizationId: user.organizationId } }
        });
    }
    async login(request, reply) {
        const { email, password } = auth_schema_1.loginSchema.parse(request.body);
        const user = await authService.validateUser(email, password);
        await auditService.logAction({
            entityId: user.id,
            entityType: 'USER',
            action: 'LOGIN',
            actorId: user.id,
            details: { email: user.email }
        });
        const fastify = request.server;
        const accessToken = fastify.jwt.sign({ id: user.id, role: user.role, organizationId: user.organizationId }, { expiresIn: '15m' });
        const refreshToken = await authService.createRefreshToken(user.id);
        reply.setCookie('accessToken', accessToken, {
            path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', maxAge: 15 * 60
        });
        reply.setCookie('refreshToken', refreshToken, {
            path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', maxAge: 7 * 24 * 60 * 60
        });
        return reply.send({
            success: true,
            data: { user: { id: user.id, email: user.email, name: user.name, role: user.role, organizationId: user.organizationId } }
        });
    }
    async refresh(request, reply) {
        const refreshToken = request.cookies.refreshToken;
        if (!refreshToken) {
            const err = new Error('No refresh token');
            err.statusCode = 401;
            throw err;
        }
        const user = await authService.refreshTokens(refreshToken);
        const fastify = request.server;
        const accessToken = fastify.jwt.sign({ id: user.id, role: user.role, organizationId: user.organizationId }, { expiresIn: '15m' });
        reply.setCookie('accessToken', accessToken, {
            path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', maxAge: 15 * 60
        });
        return reply.send({ success: true, message: 'Token refreshed' });
    }
    async logout(request, reply) {
        const refreshToken = request.cookies.refreshToken;
        if (refreshToken) {
            await authService.logout(refreshToken);
        }
        reply.clearCookie('accessToken', { path: '/' });
        reply.clearCookie('refreshToken', { path: '/' });
        return reply.send({ success: true, message: 'Logged out' });
    }
    async forgotPassword(request, reply) {
        const { email } = auth_schema_1.forgotPasswordSchema.parse(request.body);
        await authService.forgotPassword(email);
        return reply.send({ success: true, message: 'If email exists, reset link sent' });
    }
    async resetPassword(request, reply) {
        const { token, newPassword } = auth_schema_1.resetPasswordSchema.parse(request.body);
        await authService.resetPassword(token, newPassword);
        return reply.send({ success: true, message: 'Password updated' });
    }
    async me(request, reply) {
        const userPayload = request.user;
        const user = await authService.getUserById(userPayload.id);
        return reply.send({ success: true, data: user });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map