"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditController = void 0;
const audit_service_1 = require("../services/audit.service");
const auditService = new audit_service_1.AuditService();
class AuditController {
    async getAuditLogs(request, reply) {
        try {
            const data = await auditService.getAuditLogs();
            return reply.send({ success: true, data });
        }
        catch (err) {
            return reply.status(500).send({ success: false, error: { message: 'Internal server error' } });
        }
    }
}
exports.AuditController = AuditController;
//# sourceMappingURL=audit.controller.js.map