import { db, COLLECTIONS } from "@/lib/firebase";
import { toTimestamp } from "./utils";
import type { AuditLog } from "@/models/audit";

export async function createAuditLog(data: Omit<AuditLog, "id" | "createdAt">): Promise<AuditLog> {
    const now = new Date();
    const logRef = db.collection(COLLECTIONS.AUDIT_LOGS).doc();

    await logRef.set({
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        details: data.details || null,
        createdAt: toTimestamp(now),
    });

    return {
        id: logRef.id,
        ...data,
        createdAt: now,
    };
}
