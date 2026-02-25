import type { DocumentSnapshot } from "firebase-admin/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { isValidId } from "@/lib/parse-form";
import { toDate, toTimestamp } from "./utils";
import type { Review } from "@/models/review";

export async function getAllReviews(): Promise<Review[]> {
    const snapshot = await db
        .collection(COLLECTIONS.REVIEWS)
        .orderBy("sortOrder", "asc")
        .orderBy("createdAt", "desc")
        .get();

    return snapshot.docs.map((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (!data) throw new Error(`Review document ${doc.id} has no data`);
        return {
            id: doc.id,
            authorName: data.authorName as string,
            text: data.text as string,
            rating: (data.rating as number | null) ?? null,
            sortOrder: (data.sortOrder as number) ?? 0,
            isActive: (data.isActive as boolean) ?? true,
            createdAt: toDate(data.createdAt),
            updatedAt: toDate(data.updatedAt),
        } as Review;
    });
}

export async function getActiveReviews(): Promise<Review[]> {
    const snapshot = await db
        .collection(COLLECTIONS.REVIEWS)
        .where("isActive", "==", true)
        .orderBy("sortOrder", "asc")
        .get();

    return snapshot.docs.map((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (!data) throw new Error(`Review document ${doc.id} has no data`);
        return {
            id: doc.id,
            authorName: data.authorName as string,
            text: data.text as string,
            rating: (data.rating as number | null) ?? null,
            sortOrder: (data.sortOrder as number) ?? 0,
            isActive: true,
            createdAt: toDate(data.createdAt),
            updatedAt: toDate(data.updatedAt),
        } as Review;
    });
}

export async function createReview(
    authorName: string,
    text: string,
    rating?: number | null,
    sortOrder?: number
): Promise<Review> {
    const now = new Date();
    const ref = db.collection(COLLECTIONS.REVIEWS).doc();
    const order = sortOrder ?? 0;
    await ref.set({
        authorName,
        text,
        rating: rating ?? null,
        sortOrder: order,
        isActive: true,
        createdAt: toTimestamp(now),
        updatedAt: toTimestamp(now),
    });
    return {
        id: ref.id,
        authorName,
        text,
        rating: rating ?? null,
        sortOrder: order,
        isActive: true,
        createdAt: now,
        updatedAt: now,
    };
}

export async function updateReview(
    id: string | null | undefined,
    updates: {
        authorName?: string;
        text?: string;
        rating?: number | null;
        sortOrder?: number;
        isActive?: boolean;
    }
): Promise<Review | null> {
    if (!isValidId(id)) return null;
    const doc = await db.collection(COLLECTIONS.REVIEWS).doc(id!).get();
    if (!doc.exists) throw new Error(`Review ${id} not found`);
    const data = doc.data();
    const now = new Date();
    const updateData: Record<string, unknown> = { updatedAt: toTimestamp(now) };
    if (updates.authorName !== undefined) updateData.authorName = updates.authorName;
    if (updates.text !== undefined) updateData.text = updates.text;
    if (updates.rating !== undefined) updateData.rating = updates.rating ?? null;
    if (updates.sortOrder !== undefined) updateData.sortOrder = updates.sortOrder;
    if (updates.isActive !== undefined) updateData.isActive = updates.isActive;

    await db.collection(COLLECTIONS.REVIEWS).doc(id!).update(updateData);
    return {
        id,
        authorName: (updates.authorName ?? data?.authorName) as string,
        text: (updates.text ?? data?.text) as string,
        rating: (updates.rating !== undefined ? updates.rating : data?.rating) ?? null,
        sortOrder: (updates.sortOrder ?? data?.sortOrder ?? 0) as number,
        isActive: (updates.isActive ?? data?.isActive ?? true) as boolean,
        createdAt: toDate(data?.createdAt),
        updatedAt: now,
    };
}

export async function deleteReview(id: string | null | undefined): Promise<void> {
    if (!isValidId(id)) return;
    await db.collection(COLLECTIONS.REVIEWS).doc(id!).delete();
}
