import type { Query, DocumentSnapshot } from "firebase-admin/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { toDate, toTimestamp } from "./utils";
import type { ContactSubmission } from "@/models/contact";

export async function createContactSubmission(
    data: Omit<ContactSubmission, "id" | "createdAt">
): Promise<ContactSubmission> {
    const now = new Date();
    const ref = db.collection(COLLECTIONS.CONTACT_SUBMISSIONS).doc();

    await ref.set({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        query: data.query,
        createdAt: toTimestamp(now),
    });

    return {
        id: ref.id,
        ...data,
        createdAt: now,
    };
}

export async function getContactSubmissions(limit?: number): Promise<ContactSubmission[]> {
    let q: Query = db.collection(COLLECTIONS.CONTACT_SUBMISSIONS).orderBy("createdAt", "desc");
    if (typeof limit === "number" && limit > 0) q = q.limit(limit);
    const snapshot = await q.get();
    return snapshot.docs.map((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (!data) throw new Error(`ContactSubmission ${doc.id} has no data`);
        return {
            id: doc.id,
            firstName: data.firstName as string,
            lastName: data.lastName as string,
            email: data.email as string,
            query: data.query as string,
            createdAt: toDate(data.createdAt),
        } as ContactSubmission;
    });
}
