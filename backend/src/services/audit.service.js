"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const client_1 = require("@prisma/client");
const crypto = require("crypto");
const prisma = new client_1.PrismaClient();
class AuditService {
    async logAction(data) {
        const hashData = JSON.stringify(data) + new Date().toISOString();
        const blockchainHash = crypto.createHash('sha256').update(hashData).digest('hex');
        return prisma.auditLog.create({
            data: {
                entityId: data.entityId,
                entityType: data.entityType,
                action: data.action,
                actorId: data.actorId ?? null,
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
exports.AuditService = AuditService;
//# sourceMappingURL=audit.service.js.map