import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/auth.schema';

const authService = new AuthService();

export class AuthController {
  
  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = registerSchema.parse(request.body);
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
    } catch (err: any) {
      if (err instanceof z.ZodError) return reply.status(400).send({ success: false, error: { message: err.issues } });
      if (err.message === 'Email already exists') return reply.status(400).send({ success: false, error: { message: err.message } });
      return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password } = loginSchema.parse(request.body);
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
    } catch (err: any) {
      if (err instanceof z.ZodError) return reply.status(400).send({ success: false, error: { message: err.issues } });
      if (err.message === 'Invalid credentials') return reply.status(401).send({ success: false, error: { message: err.message } });
      return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
    }
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    try {
      const refreshToken = request.cookies.refreshToken;
      if (!refreshToken) return reply.status(401).send({ success: false, error: { message: 'No refresh token' } });

      const user = await authService.refreshTokens(refreshToken);
      const fastify = request.server;
      const accessToken = fastify.jwt.sign({ id: user.id, role: user.role, organizationId: user.organizationId }, { expiresIn: '15m' });
      
      reply.setCookie('accessToken', accessToken, {
        path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', maxAge: 15 * 60
      });

      return reply.send({ success: true, message: 'Token refreshed' });
    } catch (err: any) {
      return reply.status(401).send({ success: false, error: { message: err.message } });
    }
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const refreshToken = request.cookies.refreshToken;
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    reply.clearCookie('accessToken', { path: '/' });
    reply.clearCookie('refreshToken', { path: '/' });
    return reply.send({ success: true, message: 'Logged out' });
  }

  async forgotPassword(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email } = forgotPasswordSchema.parse(request.body);
      await authService.forgotPassword(email);
      return reply.send({ success: true, message: 'If email exists, reset link sent' });
    } catch (err: any) {
      return reply.status(400).send({ success: false, error: { message: err.issues || 'Invalid request' } });
    }
  }

  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { token, newPassword } = resetPasswordSchema.parse(request.body);
      await authService.resetPassword(token, newPassword);
      return reply.send({ success: true, message: 'Password updated' });
    } catch (err: any) {
      return reply.status(400).send({ success: false, error: { message: err.message || err.issues } });
    }
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userPayload = request.user as any;
      const user = await authService.getUserById(userPayload.id);
      return reply.send({ success: true, data: user });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
    }
  }
}
