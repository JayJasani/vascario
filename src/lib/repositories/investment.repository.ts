import type { DocumentSnapshot } from "firebase-admin/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { isValidId } from "@/lib/parse-form";
import { toDate, toTimestamp } from "./utils";
import type { Investment } from "@/models/investment";

export async function getAllInvestments(): Promise<Investment[]> {
    const snapshot = await db
        .collection(COLLECTIONS.INVESTMENTS)
        .orderBy("createdAt", "desc")
        .get();

    return snapshot.docs.map((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (!data) throw new Error(`Investment document ${doc.id} has no data`);
        return {
            id: doc.id,
            name: data.name as string,
            description: (data.description as string) || "",
            amount: Number(data.amount),
            createdAt: toDate(data.createdAt),
            updatedAt: toDate(data.updatedAt),
        } as Investment;
    });
}

export async function createInvestment(
    data: Omit<Investment, "id" | "createdAt" | "updatedAt">
): Promise<Investment> {
    const now = new Date();
    const ref = db.collection(COLLECTIONS.INVESTMENTS).doc();
    await ref.set({
        name: data.name,
        description: data.description,
        amount: data.amount,
        createdAt: toTimestamp(now),
        updatedAt: toTimestamp(now),
    });
    return {
        id: ref.id,
        ...data,
        createdAt: now,
        updatedAt: now,
    };
}

export async function updateInvestment(
    id: string | null | undefined,
    updates: { name?: string; description?: string; amount?: number }
): Promise<Investment | null> {
    if (!isValidId(id)) return null;
    const doc = await db.collection(COLLECTIONS.INVESTMENTS).doc(id!).get();
    if (!doc.exists) throw new Error(`Investment ${id} not found`);
    const data = doc.data();
    const now = new Date();
    const updateData: Record<string, unknown> = { updatedAt: toTimestamp(now) };
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.amount !== undefined) updateData.amount = updates.amount;

    await db.collection(COLLECTIONS.INVESTMENTS).doc(id!).update(updateData);
    return {
        id,
        name: (updates.name ?? data?.name) as string,
        description: (updates.description ?? data?.description ?? "") as string,
        amount: Number(updates.amount ?? data?.amount ?? 0),
        createdAt: toDate(data?.createdAt),
        updatedAt: now,
    };
}

export async function deleteInvestment(id: string | null | undefined): Promise<void> {
    if (!isValidId(id)) return;
    await db.collection(COLLECTIONS.INVESTMENTS).doc(id!).delete();
}

export async function getTotalInvestment(): Promise<number> {
    const snapshot = await db.collection(COLLECTIONS.INVESTMENTS).get();
    let total = 0;
    snapshot.docs.forEach((d: DocumentSnapshot) => {
        const data = d.data();
        if (data?.amount != null) total += Number(data.amount);
    });
    return total;
}
