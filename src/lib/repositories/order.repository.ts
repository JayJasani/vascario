import type { Query, DocumentSnapshot } from "firebase-admin/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { isValidId } from "@/lib/parse-form";
import { toDate, toTimestamp } from "./utils";
import { getProductById } from "./product.repository";
import type { Order, OrderItem, OrderStatus, OrderWithItems } from "@/models/order";

export async function getOrderById(id: string | null | undefined): Promise<Order | null> {
    if (!isValidId(id)) return null;
    const doc: DocumentSnapshot = await db.collection(COLLECTIONS.ORDERS).doc(id!).get();
    if (!doc.exists) return null;

    const data = doc.data();
    if (!data) throw new Error(`Order document ${doc.id} has no data`);
    return {
        id: doc.id,
        customerEmail: data.customerEmail as string,
        customerName: data.customerName as string,
        status: data.status as OrderStatus,
        totalAmount: Number(data.totalAmount),
        shippingAddress: (data.shippingAddress as Record<string, unknown>) || {},
        paymentId: (data.paymentId as string | null) || null,
        trackingNumber: (data.trackingNumber as string | null) || null,
        trackingCarrier: (data.trackingCarrier as string | null) || null,
        notes: (data.notes as string | null) || null,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
    } as Order;
}

export async function getAllOrders(statusFilter?: OrderStatus): Promise<Order[]> {
    let query: Query = db.collection(COLLECTIONS.ORDERS);
    if (statusFilter) query = query.where("status", "==", statusFilter);
    const snapshot = await query.orderBy("createdAt", "desc").get();

    return snapshot.docs.map((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (!data) throw new Error(`Order document ${doc.id} has no data`);
        return {
            id: doc.id,
            customerEmail: data.customerEmail as string,
            customerName: data.customerName as string,
            status: data.status as OrderStatus,
            totalAmount: Number(data.totalAmount),
            shippingAddress: (data.shippingAddress as Record<string, unknown>) || {},
            paymentId: (data.paymentId as string | null) || null,
            trackingNumber: (data.trackingNumber as string | null) || null,
            trackingCarrier: (data.trackingCarrier as string | null) || null,
            notes: (data.notes as string | null) || null,
            createdAt: toDate(data.createdAt),
            updatedAt: toDate(data.updatedAt),
        } as Order;
    });
}

export async function getRecentOrders(limit: number = 10): Promise<Order[]> {
    const snapshot = await db
        .collection(COLLECTIONS.ORDERS)
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get();

    return snapshot.docs.map((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (!data) throw new Error(`Order document ${doc.id} has no data`);
        return {
            id: doc.id,
            customerEmail: data.customerEmail as string,
            customerName: data.customerName as string,
            status: data.status as OrderStatus,
            totalAmount: Number(data.totalAmount),
            shippingAddress: (data.shippingAddress as Record<string, unknown>) || {},
            paymentId: (data.paymentId as string | null) || null,
            trackingNumber: (data.trackingNumber as string | null) || null,
            trackingCarrier: (data.trackingCarrier as string | null) || null,
            notes: (data.notes as string | null) || null,
            createdAt: toDate(data.createdAt),
            updatedAt: toDate(data.updatedAt),
        } as Order;
    });
}

async function buildOrderWithItems(
    doc: DocumentSnapshot,
    data: Record<string, unknown>
): Promise<OrderWithItems> {
    const order: Order = {
        id: doc.id,
        customerEmail: data.customerEmail as string,
        customerName: data.customerName as string,
        status: data.status as OrderStatus,
        totalAmount: Number(data.totalAmount),
        shippingAddress: (data.shippingAddress as Record<string, unknown>) || {},
        paymentId: (data.paymentId as string | null) || null,
        trackingNumber: (data.trackingNumber as string | null) || null,
        trackingCarrier: (data.trackingCarrier as string | null) || null,
        notes: (data.notes as string | null) || null,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
    };

    const itemsSnapshot = await db
        .collection(COLLECTIONS.ORDER_ITEMS)
        .where("orderId", "==", doc.id)
        .get();

    const items = await Promise.all(
        itemsSnapshot.docs.map(async (itemDoc: DocumentSnapshot) => {
            const itemData = itemDoc.data();
            if (!itemData) throw new Error(`OrderItem document ${itemDoc.id} has no data`);
            const product = await getProductById(itemData.productId as string);
            if (!product) throw new Error(`Product ${itemData.productId} not found`);
            return {
                id: itemDoc.id,
                orderId: itemData.orderId as string,
                productId: itemData.productId as string,
                designId: itemData.designId as string,
                quantity: itemData.quantity as number,
                size: itemData.size as string,
                color: itemData.color as string,
                product,
            };
        })
    );

    return { ...order, items } as OrderWithItems;
}

export async function getOrdersWithItems(statusFilter?: OrderStatus): Promise<OrderWithItems[]> {
    let query: Query = db.collection(COLLECTIONS.ORDERS);
    if (statusFilter) query = query.where("status", "==", statusFilter);
    const snapshot = await query.orderBy("createdAt", "desc").get();

    return Promise.all(
        snapshot.docs.map(async (doc: DocumentSnapshot) => {
            const data = doc.data();
            if (!data) throw new Error(`Order document ${doc.id} has no data`);
            return buildOrderWithItems(doc, data);
        })
    );
}

export async function getRecentOrdersWithItems(limit: number = 10): Promise<OrderWithItems[]> {
    const snapshot = await db
        .collection(COLLECTIONS.ORDERS)
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get();

    return Promise.all(
        snapshot.docs.map(async (doc: DocumentSnapshot) => {
            const data = doc.data();
            if (!data) throw new Error(`Order document ${doc.id} has no data`);
            return buildOrderWithItems(doc, data);
        })
    );
}

export async function createOrder(
    data: Omit<Order, "id" | "createdAt" | "updatedAt"> | null | undefined
): Promise<Order | null> {
    if (!data || typeof data !== "object") return null;
    const now = new Date();
    const orderRef = db.collection(COLLECTIONS.ORDERS).doc();
    await orderRef.set({
        ...data,
        createdAt: toTimestamp(now),
        updatedAt: toTimestamp(now),
    });
    return {
        id: orderRef.id,
        ...data,
        createdAt: now,
        updatedAt: now,
    };
}

export async function updateOrder(
    id: string | null | undefined,
    data: Partial<Order> | null | undefined
): Promise<void> {
    if (!isValidId(id) || !data || typeof data !== "object") return;
    const updateData: Record<string, unknown> = { ...data, updatedAt: toTimestamp(new Date()) };
    delete updateData.id;
    delete updateData.createdAt;
    await db.collection(COLLECTIONS.ORDERS).doc(id!).update(updateData);
}

export async function countOrders(statusFilter?: OrderStatus): Promise<number> {
    let query: Query = db.collection(COLLECTIONS.ORDERS);
    if (statusFilter) query = query.where("status", "==", statusFilter);
    const snapshot = await query.count().get();
    return snapshot.data().count;
}

export async function aggregateOrderTotal(): Promise<number> {
    const snapshot = await db.collection(COLLECTIONS.ORDERS).get();
    let total = 0;
    snapshot.docs.forEach((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (data && data.totalAmount) total += Number(data.totalAmount);
    });
    return total;
}

export async function getOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    const snapshot = await db
        .collection(COLLECTIONS.ORDER_ITEMS)
        .where("orderId", "==", orderId)
        .get();

    return snapshot.docs.map((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (!data) throw new Error(`OrderItem document ${doc.id} has no data`);
        return {
            id: doc.id,
            orderId: data.orderId as string,
            productId: data.productId as string,
            designId: data.designId as string,
            quantity: data.quantity as number,
            size: data.size as string,
            color: data.color as string,
        } as OrderItem;
    });
}

export async function createOrderItem(data: Omit<OrderItem, "id">): Promise<OrderItem> {
    const itemRef = db.collection(COLLECTIONS.ORDER_ITEMS).doc();
    await itemRef.set({
        orderId: data.orderId,
        productId: data.productId,
        designId: data.designId,
        quantity: data.quantity,
        size: data.size,
        color: data.color,
    });
    return { id: itemRef.id, ...data };
}
