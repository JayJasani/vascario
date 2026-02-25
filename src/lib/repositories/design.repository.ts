import type { DocumentSnapshot } from "firebase-admin/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { toDate, toTimestamp } from "./utils";
import type { Design } from "@/models/design";

export async function getDesignById(id: string): Promise<Design | null> {
    const doc: DocumentSnapshot = await db.collection(COLLECTIONS.DESIGNS).doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data()!;
    return {
        id: doc.id,
        imageUrl: data.imageUrl,
        placement: data.placement,
        createdAt: toDate(data.createdAt),
    } as Design;
}

export async function createDesign(data: Omit<Design, "id" | "createdAt">): Promise<Design> {
    const now = new Date();
    const designRef = db.collection(COLLECTIONS.DESIGNS).doc();

    await designRef.set({
        imageUrl: data.imageUrl,
        placement: data.placement,
        createdAt: toTimestamp(now),
    });

    return {
        id: designRef.id,
        ...data,
        createdAt: now,
    };
}
