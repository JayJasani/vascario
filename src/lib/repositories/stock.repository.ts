import type { DocumentSnapshot } from "firebase-admin/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { isValidId } from "@/lib/parse-form";
import type { StockLevel } from "@/models/stock";

export async function getStockLevelsByProductId(
    productId: string | null | undefined
): Promise<StockLevel[]> {
    if (!isValidId(productId)) return [];
    const snapshot = await db
        .collection(COLLECTIONS.STOCK_LEVELS)
        .where("productId", "==", productId)
        .get();

    return snapshot.docs.map((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (!data) throw new Error(`StockLevel document ${doc.id} has no data`);
        return {
            id: doc.id,
            productId: data.productId as string,
            size: data.size as string,
            quantity: data.quantity as number,
            lowThreshold: data.lowThreshold as number,
        } as StockLevel;
    });
}

export async function getAllStockLevels(): Promise<StockLevel[]> {
    const snapshot = await db.collection(COLLECTIONS.STOCK_LEVELS).get();
    return snapshot.docs.map((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (!data) throw new Error(`StockLevel document ${doc.id} has no data`);
        return {
            id: doc.id,
            productId: data.productId as string,
            size: data.size as string,
            quantity: data.quantity as number,
            lowThreshold: data.lowThreshold as number,
        } as StockLevel;
    });
}

export async function getStockTotalsByProduct(): Promise<Record<string, number>> {
    const levels = await getAllStockLevels();
    return levels.reduce<Record<string, number>>((acc, level) => {
        acc[level.productId] = (acc[level.productId] ?? 0) + level.quantity;
        return acc;
    }, {});
}

export async function createStockLevel(data: Omit<StockLevel, "id">): Promise<StockLevel> {
    const stockRef = db.collection(COLLECTIONS.STOCK_LEVELS).doc();
    await stockRef.set({
        productId: data.productId,
        size: data.size,
        quantity: data.quantity,
        lowThreshold: data.lowThreshold,
    });
    return { id: stockRef.id, ...data };
}

export async function updateStockLevel(
    id: string | null | undefined,
    quantity: number
): Promise<StockLevel | null> {
    if (!isValidId(id) || typeof quantity !== "number" || isNaN(quantity) || quantity < 0)
        return null;
    await db.collection(COLLECTIONS.STOCK_LEVELS).doc(id!).update({ quantity });
    const doc = await db.collection(COLLECTIONS.STOCK_LEVELS).doc(id!).get();
    const data = doc.data()!;
    return {
        id: doc.id,
        productId: data.productId,
        size: data.size,
        quantity: data.quantity,
        lowThreshold: data.lowThreshold,
    };
}

export async function getLowStockAlerts(): Promise<StockLevel[]> {
    const snapshot = await db.collection(COLLECTIONS.STOCK_LEVELS).get();
    return snapshot.docs
        .map((doc: DocumentSnapshot) => {
            const data = doc.data();
            if (!data) throw new Error(`StockLevel document ${doc.id} has no data`);
            return {
                id: doc.id,
                productId: data.productId as string,
                size: data.size as string,
                quantity: data.quantity as number,
                lowThreshold: data.lowThreshold as number,
            } as StockLevel;
        })
        .filter((stock: StockLevel) => stock.quantity <= stock.lowThreshold);
}

export async function deleteStockLevelsByProductId(
    productId: string | null | undefined
): Promise<void> {
    if (!isValidId(productId)) return;
    const snapshot = await db
        .collection(COLLECTIONS.STOCK_LEVELS)
        .where("productId", "==", productId)
        .get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    if (!snapshot.empty) await batch.commit();
}
