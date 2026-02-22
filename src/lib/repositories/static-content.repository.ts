import type { DocumentSnapshot } from "firebase-admin/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { isValidId } from "@/lib/parse-form";
import { toDate, toTimestamp } from "./utils";
import type { StaticContent } from "@/models/static-content";

/** Key can be string identifier - allow non-empty string. */
function isValidKey(key: string | null | undefined): boolean {
    return typeof key === "string" && key.trim().length > 0;
}

export async function getStaticContentByKey(
    key: string | null | undefined
): Promise<StaticContent | null> {
    if (!isValidKey(key)) return null;
    const snapshot = await db
        .collection(COLLECTIONS.STATIC_CONTENT)
        .where("key", "==", key!.trim())
        .limit(1)
        .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
        id: doc.id,
        key: data.key as string,
        url: data.url as string,
        type: data.type as "video" | "image",
        redirectUrl: (data.redirectUrl as string | null) || null,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
    };
}

export async function getAllStaticContent(): Promise<StaticContent[]> {
    const snapshot = await db
        .collection(COLLECTIONS.STATIC_CONTENT)
        .orderBy("key", "asc")
        .get();

    return snapshot.docs.map((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (!data) throw new Error(`StaticContent document ${doc.id} has no data`);
        return {
            id: doc.id,
            key: data.key as string,
            url: data.url as string,
            type: data.type as "video" | "image",
            redirectUrl: (data.redirectUrl as string | null) || null,
            createdAt: toDate(data.createdAt),
            updatedAt: toDate(data.updatedAt),
        } as StaticContent;
    });
}

export async function upsertStaticContent(
    key: string | null | undefined,
    url: string | null | undefined,
    type: "video" | "image" | null | undefined,
    redirectUrl?: string | null
): Promise<StaticContent | null> {
    if (!isValidKey(key) || !url || typeof url !== "string" || !url.trim()) return null;
    const validType = type === "video" || type === "image" ? type : "image";
    const now = new Date();
    const existing = await getStaticContentByKey(key!.trim());

    if (existing) {
        const updateData: Record<string, unknown> = {
            url: url.trim(),
            type: validType,
            updatedAt: toTimestamp(now),
        };
        if (redirectUrl !== undefined) updateData.redirectUrl = redirectUrl || null;

        await db.collection(COLLECTIONS.STATIC_CONTENT).doc(existing.id).update(updateData);

        return {
            ...existing,
            url: url.trim(),
            type: validType,
            redirectUrl: redirectUrl !== undefined ? (redirectUrl || null) : existing.redirectUrl,
            updatedAt: now,
        };
    } else {
        const ref = db.collection(COLLECTIONS.STATIC_CONTENT).doc();
        await ref.set({
            key: key!.trim(),
            url: url.trim(),
            type: validType,
            redirectUrl: redirectUrl || null,
            createdAt: toTimestamp(now),
            updatedAt: toTimestamp(now),
        });

        return {
            id: ref.id,
            key: key!.trim(),
            url: url.trim(),
            type: validType,
            redirectUrl: redirectUrl || null,
            createdAt: now,
            updatedAt: now,
        };
    }
}

export async function deleteStaticContent(key: string | null | undefined): Promise<void> {
    if (!isValidKey(key)) return;
    const content = await getStaticContentByKey(key!.trim());
    if (content) {
        await db.collection(COLLECTIONS.STATIC_CONTENT).doc(content.id).delete();
    }
}
