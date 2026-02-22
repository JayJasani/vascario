export interface AuditLog {
    id: string;
    action: string;
    entity: string;
    entityId: string;
    details?: Record<string, unknown> | null;
    createdAt: Date;
}

export type AuditLogCreateInput = Omit<AuditLog, "id" | "createdAt">;
