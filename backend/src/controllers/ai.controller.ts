import { FastifyRequest, FastifyReply } from 'fastify';
import { AiService } from '../services/ai.service';
import { ocrSchema, demandPredictionSchema, analyzeQualitySchema } from '../schemas/ai.schema';
import { z } from 'zod';

const aiService = new AiService();

export class AiController {
  async ocrExtract(request: FastifyRequest, reply: FastifyReply) {
    const body = ocrSchema.parse(request.body);
    const data = await aiService.ocrExtract(body);
    return reply.send({ success: true, data });
  }

  async demandPrediction(request: FastifyRequest, reply: FastifyReply) {
    const body = demandPredictionSchema.parse(request.body);
    const data = await aiService.demandPrediction(body);
    return reply.send({ success: true, data });
  }

  async analyzeQuality(request: FastifyRequest, reply: FastifyReply) {
    const body = analyzeQualitySchema.parse(request.body);
    const data = await aiService.analyzeQuality(body);
    return reply.send({ success: true, data });
  }

  async getRecommendations(request: FastifyRequest, reply: FastifyReply) {
    const data = await aiService.getRecommendations();
    return reply.send({ success: true, data });
  }
}
