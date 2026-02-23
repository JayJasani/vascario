import type { DocumentSnapshot } from "firebase-admin/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { toDate, toTimestamp } from "./utils";
import type { BackInStockNotification } from "@/models/back-in-stock";

/** Generate a stable doc ID for deduplication: same email+product+size = same id. */
function docIdFor(email: string, productId: string, size: string | null): string {
    const safe = (s: string) => s.replace(/\||\//g, "-");
    return `${safe(email)}|${productId}|${size ?? ""}`;
}

/**
 * Create a back-in-stock notification request.
 * If the same email + productId + size already exists, returns null (caller can treat as "already subscribed").
 */
export async function createBackInStockNotification(
    data: Omit<BackInStockNotification, "id" | "createdAt">
): Promise<BackInStockNotification | null> {
    const id = docIdFor(data.email.trim().toLowerCase(), data.productId, data.size ?? null);
    const ref = db.collection(COLLECTIONS.BACK_IN_STOCK_NOTIFICATIONS).doc(id);
    const existing = await ref.get();
    if (existing.exists) return null;

    const now = new Date();
    await ref.set({
        email: data.email.trim().toLowerCase(),
        productId: data.productId,
        productSlug: data.productSlug,
        size: data.size ?? null,
        createdAt: toTimestamp(now),
    });

    return {
        id: ref.id,
        ...data,
        size: data.size ?? null,
        createdAt: now,
    };
}

export async function getBackInStockNotificationsByProductId(
    productId: string
): Promise<BackInStockNotification[]> {
    const snapshot = await db
        .collection(COLLECTIONS.BACK_IN_STOCK_NOTIFICATIONS)
        .where("productId", "==", productId)
        .get();

    const list = snapshot.docs.map((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (!data) throw new Error(`BackInStockNotification ${doc.id} has no data`);
        return {
            id: doc.id,
            email: data.email as string,
            productId: data.productId as string,
            productSlug: data.productSlug as string,
            size: (data.size as string | null) ?? null,
            createdAt: toDate(data.createdAt),
        } as BackInStockNotification;
    });
    list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return list;
}

export async function getAllBackInStockNotifications(): Promise<BackInStockNotification[]> {
    const snapshot = await db
        .collection(COLLECTIONS.BACK_IN_STOCK_NOTIFICATIONS)
        .get();

    const list = snapshot.docs.map((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (!data) throw new Error(`BackInStockNotification ${doc.id} has no data`);
        return {
            id: doc.id,
            email: data.email as string,
            productId: data.productId as string,
            productSlug: data.productSlug as string,
            size: (data.size as string | null) ?? null,
            createdAt: toDate(data.createdAt),
        } as BackInStockNotification;
    });
    list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return list;
}
