import type { DocumentSnapshot } from "firebase-admin/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { toDate, toTimestamp } from "./utils";
import type { NewsletterSubscription } from "@/models/newsletter";

export async function createNewsletterSubscription(emailRaw: string): Promise<NewsletterSubscription> {
    const email = emailRaw.toLowerCase();
    const now = new Date();
    const ref = db.collection(COLLECTIONS.NEWSLETTER_SUBSCRIPTIONS).doc(email);

    const existing = await ref.get();
    if (existing.exists) {
        const data = existing.data()!;
        return {
            id: ref.id,
            email: data.email as string,
            createdAt: toDate(data.createdAt),
        };
    }

    await ref.set({
        email,
        createdAt: toTimestamp(now),
    });

    return {
        id: ref.id,
        email,
        createdAt: now,
    };
}

export async function getNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    const snapshot = await db
        .collection(COLLECTIONS.NEWSLETTER_SUBSCRIPTIONS)
        .orderBy("createdAt", "desc")
        .get();

    return snapshot.docs.map((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (!data) throw new Error(`NewsletterSubscription ${doc.id} has no data`);
        return {
            id: doc.id,
            email: data.email as string,
            createdAt: toDate(data.createdAt),
        } as NewsletterSubscription;
    });
}
