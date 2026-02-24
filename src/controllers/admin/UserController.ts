import { db, COLLECTIONS } from "@/lib/firebase";

export interface AdminUserView {
    id: string;
    uid: string;
    email: string;
    phoneNumber?: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    createdAt?: string;
    updatedAt?: string;
}

export async function getAdminUsers(): Promise<AdminUserView[]> {
    const snapshot = await db.collection(COLLECTIONS.USERS).get();

    const users = snapshot.docs.map((doc) => {
        const data = doc.data() as Record<string, any>;

        const createdAtFromField =
            typeof data.createdAt?.toDate === "function"
                ? data.createdAt.toDate().toISOString()
                : undefined;

        const createdAtFromDoc =
            !createdAtFromField && typeof doc.createTime?.toDate === "function"
                ? doc.createTime.toDate().toISOString()
                : undefined;

        const createdAt = createdAtFromField ?? createdAtFromDoc;

        const updatedAt =
            typeof data.updatedAt?.toDate === "function"
                ? data.updatedAt.toDate().toISOString()
                : undefined;

        return {
            id: doc.id,
            uid: data.uid ?? doc.id,
            email: data.email ?? "",
            phoneNumber: data.phoneNumber,
            displayName: data.displayName,
            firstName: data.firstName,
            lastName: data.lastName,
            createdAt,
            updatedAt,
        };
    });

    users.sort((a, b) => {
        const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
        const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
        return bTime - aTime;
    });

    return users;
}

