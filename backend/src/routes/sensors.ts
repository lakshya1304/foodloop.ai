import { FastifyInstance } from 'fastify';
import { SensorsController } from '../controllers/sensors.controller';

const sensorsController = new SensorsController();

export default async function sensorsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preValidation', async (request, reply) => {
    try { await request.jwtVerify({ onlyCookie: true }) } catch (err) { reply.send(err) }
  });

  fastify.get('/', sensorsController.getSensors.bind(sensorsController));
}
