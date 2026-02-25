import type { Timestamp } from "firebase-admin/firestore";
import { Timestamp as FirestoreTimestamp } from "firebase-admin/firestore";

export function toDate(timestamp: Timestamp | Date | undefined | unknown): Date {
    if (!timestamp) return new Date();
    if (timestamp instanceof Date) return timestamp;
    return (timestamp as Timestamp).toDate();
}

export function toTimestamp(date: Date): Timestamp {
    return FirestoreTimestamp.fromDate(date);
}
