import { getContactSubmissions } from "@/lib/firebase-helpers";

export interface AdminContactView {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    query: string;
    createdAt: string;
}

export async function getAdminContactSubmissions(): Promise<AdminContactView[]> {
    const submissions = await getContactSubmissions();
    return submissions.map((s) => ({
        id: s.id,
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email,
        query: s.query,
        createdAt: s.createdAt.toISOString(),
    }));
}
