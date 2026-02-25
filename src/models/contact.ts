export interface ContactSubmission {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    query: string;
    createdAt: Date;
}

export type ContactSubmissionCreateInput = Omit<ContactSubmission, "id" | "createdAt">;
