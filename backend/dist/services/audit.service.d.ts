export declare class AuditService {
    logAction(data: {
        entityId: string;
        entityType: string;
        action: string;
        actorId?: string;
        details?: any;
    }): Promise<any>;
    getAuditLogs(): Promise<any>;
}
//# sourceMappingURL=audit.service.d.ts.map