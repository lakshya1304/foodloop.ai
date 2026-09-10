import { FastifyRequest, FastifyReply } from 'fastify';
import { AuditService } from '../services/audit.service';

const auditService = new AuditService();

export class AuditController {
  async getAuditLogs(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await auditService.getAuditLogs();
      return reply.send({ success: true, data });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
    }
  }
}
