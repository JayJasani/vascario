import { getNewsletterSubscriptions } from "@/lib/firebase-helpers";

export interface AdminNewsletterView {
    id: string;
    email: string;
    createdAt: string;
}

export async function getAdminNewsletterSubscriptions(): Promise<AdminNewsletterView[]> {
    const list = await getNewsletterSubscriptions();
    return list.map((s) => ({
        id: s.id,
        email: s.email,
        createdAt: s.createdAt.toISOString(),
    }));
}
