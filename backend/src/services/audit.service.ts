import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export class AuditService {
  async logAction(data: { entityId: string, entityType: string, action: string, actorId?: string, details?: any }) {
    const hashData = JSON.stringify(data) + new Date().toISOString();
    const blockchainHash = crypto.createHash('sha256').update(hashData).digest('hex');

    return prisma.auditLog.create({
      data: {
        entityId: data.entityId,
        entityType: data.entityType,
        action: data.action,
        actorId: data.actorId,
        details: data.details ? JSON.stringify(data.details) : null,
        blockchainHash
      }
    });
  }

  async getAuditLogs() {
    return prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }
}
