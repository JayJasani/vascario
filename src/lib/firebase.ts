import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
if (!getApps().length) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
        : undefined;

    if (serviceAccount) {
        initializeApp({
            credential: cert(serviceAccount),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`,
        });
    } else {
        // For local development, you can use application default credentials
        // or set GOOGLE_APPLICATION_CREDENTIALS environment variable
        try {
            initializeApp({
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            });
        } catch (error) {
            console.warn("Firebase Admin initialization warning:", error);
        }
    }
}

export const db = getFirestore();

// Collection names
export const COLLECTIONS = {
    PRODUCTS: "products",
    ORDERS: "orders",
    ORDER_ITEMS: "orderItems",
    DESIGNS: "designs",
    STOCK_LEVELS: "stockLevels",
    AUDIT_LOGS: "auditLogs",
    CONTACT_SUBMISSIONS: "contactSubmissions",
} as const;
