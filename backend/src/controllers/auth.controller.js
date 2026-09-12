"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const zod_1 = require("zod");
const auth_service_1 = require("../services/auth.service");
const auth_schema_1 = require("../schemas/auth.schema");
const authService = new auth_service_1.AuthService();
class AuthController {
    async register(request, reply) {
        try {
            const data = auth_schema_1.registerSchema.parse(request.body);
            const user = await authService.registerUser(data);
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
        catch (err) {
            if (err instanceof zod_1.z.ZodError)
                return reply.status(400).send({ success: false, error: { message: err.issues } });
            if (err.message === 'Email already exists')
                return reply.status(400).send({ success: false, error: { message: err.message } });
            return reply.status(500).send({ success: false, error: { message: err.message, stack: err.stack } });
        }
    }
    async login(request, reply) {
        try {
            const { email, password } = auth_schema_1.loginSchema.parse(request.body);
            const user = await authService.validateUser(email, password);
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
        catch (err) {
            if (err instanceof zod_1.z.ZodError)
                return reply.status(400).send({ success: false, error: { message: err.issues } });
            if (err.message === 'Invalid credentials')
                return reply.status(401).send({ success: false, error: { message: err.message } });
            return reply.status(500).send({ success: false, error: { message: err.message, stack: err.stack } });
        }
    }
    async refresh(request, reply) {
        try {
            const refreshToken = request.cookies.refreshToken;
            if (!refreshToken)
                return reply.status(401).send({ success: false, error: { message: 'No refresh token' } });
            const user = await authService.refreshTokens(refreshToken);
            const fastify = request.server;
            const accessToken = fastify.jwt.sign({ id: user.id, role: user.role, organizationId: user.organizationId }, { expiresIn: '15m' });
            reply.setCookie('accessToken', accessToken, {
                path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', maxAge: 15 * 60
            });
            return reply.send({ success: true, message: 'Token refreshed' });
        }
        catch (err) {
            return reply.status(401).send({ success: false, error: { message: err.message } });
        }
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
        try {
            const { email } = auth_schema_1.forgotPasswordSchema.parse(request.body);
            await authService.forgotPassword(email);
            return reply.send({ success: true, message: 'If email exists, reset link sent' });
        }
        catch (err) {
            return reply.status(400).send({ success: false, error: { message: err.issues || 'Invalid request' } });
        }
    }
    async resetPassword(request, reply) {
        try {
            const { token, newPassword } = auth_schema_1.resetPasswordSchema.parse(request.body);
            await authService.resetPassword(token, newPassword);
            return reply.send({ success: true, message: 'Password updated' });
        }
        catch (err) {
            return reply.status(400).send({ success: false, error: { message: err.message || err.issues } });
        }
    }
    async me(request, reply) {
        try {
            const userPayload = request.user;
            const user = await authService.getUserById(userPayload.id);
            return reply.send({ success: true, data: user });
        }
        catch (err) {
            return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map