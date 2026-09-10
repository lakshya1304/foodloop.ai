import { FastifyRequest, FastifyReply } from 'fastify';
import { AiService } from '../services/ai.service';
import { ocrSchema, demandPredictionSchema } from '../schemas/ai.schema';
import { z } from 'zod';

const aiService = new AiService();

export class AiController {
  async ocrExtract(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = ocrSchema.parse(request.body);
      const data = await aiService.ocrExtract(body);
      return reply.send({ success: true, data });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({ success: false, error: { message: err.issues } });
      }
      if (err.message === 'AI service unavailable') {
        return reply.status(503).send({ success: false, error: { message: err.message } });
      }
      return reply.status(400).send({ success: false, error: { message: err.message || 'Error' }});
    }
  }

  async demandPrediction(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = demandPredictionSchema.parse(request.body);
      const data = await aiService.demandPrediction(body);
      return reply.send({ success: true, data });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({ success: false, error: { message: err.issues } });
      }
      return reply.status(500).send({ success: false, error: { message: err.message || 'Error' }});
    }
  }

  async analyzeQuality(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Need to import analyzeQualitySchema, will update this
      const { analyzeQualitySchema } = require('../schemas/ai.schema');
      const body = analyzeQualitySchema.parse(request.body);
      const data = await aiService.analyzeQuality(body);
      return reply.send({ success: true, data });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({ success: false, error: { message: err.issues } });
      }
      return reply.status(500).send({ success: false, error: { message: err.message || 'Error' }});
    }
  }

  async getRecommendations(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await aiService.getRecommendations();
      return reply.send({ success: true, data });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: { message: err.message || 'Error' }});
    }
  }
}
