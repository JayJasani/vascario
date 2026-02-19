import { db, COLLECTIONS } from "./firebase";
import type { Timestamp, Query, DocumentSnapshot } from "firebase-admin/firestore";
import { Timestamp as FirestoreTimestamp } from "firebase-admin/firestore";
import { generateProductSlug } from "./seo-utils";

// Type definitions matching Prisma schema
export type OrderStatus = "PENDING" | "PAID" | "IN_PRODUCTION" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    colors: string[];
    sizes: string[];
    sku?: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface StockLevel {
    id: string;
    productId: string;
    size: string;
    quantity: number;
    lowThreshold: number;
}

export interface Design {
    id: string;
    imageUrl: string;
    placement: { x: number; y: number; scale: number };
    createdAt: Date;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    designId: string;
    quantity: number;
    size: string;
    color: string;
}

export interface Order {
    id: string;
    customerEmail: string;
    customerName: string;
    status: OrderStatus;
    totalAmount: number;
    shippingAddress: Record<string, unknown>;
    paymentId?: string | null;
    trackingNumber?: string | null;
    trackingCarrier?: string | null;
    notes?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuditLog {
    id: string;
    action: string;
    entity: string;
    entityId: string;
    details?: Record<string, unknown> | null;
    createdAt: Date;
}

// Helper function to convert Firestore timestamp to Date
function toDate(timestamp: Timestamp | Date | undefined): Date {
    if (!timestamp) return new Date();
    if (timestamp instanceof Date) return timestamp;
    return (timestamp as Timestamp).toDate();
}

// Helper function to convert Date to Firestore timestamp
function toTimestamp(date: Date): Timestamp {
    return FirestoreTimestamp.fromDate(date);
}

// ─── PRODUCT HELPERS ────────────────────────────────────────────────────────────

export async function getProductById(id: string): Promise<Product | null> {
    const doc: DocumentSnapshot = await db.collection(COLLECTIONS.PRODUCTS).doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data()!;
    return {
        id: doc.id,
        name: data.name,
        slug: data.slug || (data.name ? data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : ''),
        description: data.description,
        price: Number(data.price),
        images: data.images || [],
        colors: data.colors || [],
        sizes: data.sizes || [],
        sku: data.sku || null,
        isActive: data.isActive ?? true,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
    } as Product;
}

/**
 * Fetch a product by slug. Returns null if not found.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
    const snapshot = await db
        .collection(COLLECTIONS.PRODUCTS)
        .where("slug", "==", slug)
        .limit(1)
        .get();
    
    if (snapshot.empty) {
        // Backward-compatibility fallback:
        // older products may not yet have `slug` stored in Firestore.
        // Scan active products and match by generated slug.
        const activeSnapshot = await db
            .collection(COLLECTIONS.PRODUCTS)
            .where("isActive", "==", true)
            .get();

        for (const doc of activeSnapshot.docs) {
            const data = doc.data();
            const name = data.name as string | undefined;
            if (!name) continue;

            const candidate = (data.slug as string | undefined) || generateProductSlug(name);
            if (candidate !== slug) continue;

            // Self-heal: persist slug so future lookups are fast.
            if (!data.slug) {
                await doc.ref.update({
                    slug: candidate,
                    updatedAt: toTimestamp(new Date()),
                });
            }

            return {
                id: doc.id,
                name: name,
                slug: candidate,
                description: data.description,
                price: Number(data.price),
                images: data.images || [],
                colors: data.colors || [],
                sizes: data.sizes || [],
                sku: data.sku || null,
                isActive: data.isActive ?? true,
                createdAt: toDate(data.createdAt),
                updatedAt: toDate(data.updatedAt),
            } as Product;
        }

        return null;
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name,
        slug: data.slug || slug,
        description: data.description,
        price: Number(data.price),
        images: data.images || [],
        colors: data.colors || [],
        sizes: data.sizes || [],
        sku: data.sku || null,
        isActive: data.isActive ?? true,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
    } as Product;
}

export async function getAllProducts(): Promise<Product[]> {
    const snapshot = await db.collection(COLLECTIONS.PRODUCTS).orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (!data) {
            throw new Error(`Product document ${doc.id} has no data`);
        }
        return {
            id: doc.id,
            name: data.name as string,
            slug: (data.slug as string) || (data.name ? (data.name as string).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : ''),
            description: data.description as string,
            price: Number(data.price),
            images: (data.images as string[]) || [],
            colors: (data.colors as string[]) || [],
            sizes: (data.sizes as string[]) || [],
            sku: (data.sku as string | null) || null,
            isActive: (data.isActive as boolean) ?? true,
            createdAt: toDate(data.createdAt),
            updatedAt: toDate(data.updatedAt),
        } as Product;
    });
}

export async function getActiveProducts(): Promise<Product[]> {
    const snapshot = await db
        .collection(COLLECTIONS.PRODUCTS)
        .where("isActive", "==", true)
        .orderBy("createdAt", "desc")
        .get();

    return snapshot.docs.map((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (!data) {
            throw new Error(`Product document ${doc.id} has no data`);
        }
        return {
            id: doc.id,
            name: data.name as string,
            slug: (data.slug as string) || (data.name ? (data.name as string).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : ''),
            description: data.description as string,
            price: Number(data.price),
            images: (data.images as string[]) || [],
            colors: (data.colors as string[]) || [],
            sizes: (data.sizes as string[]) || [],
            sku: (data.sku as string | null) || null,
            isActive: (data.isActive as boolean) ?? true,
            createdAt: toDate(data.createdAt),
            updatedAt: toDate(data.updatedAt),
        } as Product;
    });
}

export async function createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt" | "slug"> & { slug?: string }): Promise<Product> {
    const now = new Date();
    const productRef = db.collection(COLLECTIONS.PRODUCTS).doc();
    
    // Generate slug if not provided
    const slug = data.slug || generateProductSlug(data.name);

    const productData = {
        name: data.name,
        slug: slug,
        description: data.description,
        price: data.price,
        images: data.images,
        colors: data.colors,
        sizes: data.sizes,
        sku: data.sku || null,
        isActive: data.isActive ?? true,
        createdAt: toTimestamp(now),
        updatedAt: toTimestamp(now),
    };

    await productRef.set(productData);

    return {
        id: productRef.id,
        ...data,
        slug: slug,
        createdAt: now,
        updatedAt: now,
    };
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
    const updateData: Record<string, unknown> = {
        ...data,
        updatedAt: toTimestamp(new Date()),
    };

    // Generate slug if name is being updated and slug is not provided
    if (data.name && !data.slug) {
        updateData.slug = generateProductSlug(data.name);
    }

    // Remove id, createdAt from update data
    delete updateData.id;
    delete updateData.createdAt;

    await db.collection(COLLECTIONS.PRODUCTS).doc(id).update(updateData);
}

export async function deleteProduct(id: string): Promise<void> {
    await db.collection(COLLECTIONS.PRODUCTS).doc(id).delete();
}

/** Delete all stock level documents for a product. Call before or after deleteProduct. */
export async function deleteStockLevelsByProductId(productId: string): Promise<void> {
    const snapshot = await db
        .collection(COLLECTIONS.STOCK_LEVELS)
        .where("productId", "==", productId)
        .get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    if (!snapshot.empty) await batch.commit();
}

// ─── STOCK LEVEL HELPERS ────────────────────────────────────────────────────────

export async function getStockLevelsByProductId(productId: string): Promise<StockLevel[]> {
    const snapshot = await db
        .collection(COLLECTIONS.STOCK_LEVELS)
        .where("productId", "==", productId)
        .get();

    return snapshot.docs.map((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (!data) {
            throw new Error(`StockLevel document ${doc.id} has no data`);
        }
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
        if (!data) {
            throw new Error(`StockLevel document ${doc.id} has no data`);
        }
        return {
            id: doc.id,
            productId: data.productId as string,
            size: data.size as string,
            quantity: data.quantity as number,
            lowThreshold: data.lowThreshold as number,
        } as StockLevel;
    });
}

/** Returns total stock per product (sum of all sizes). Used by storefront for cards. */
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
    return {
        id: stockRef.id,
        ...data,
    };
}

export async function updateStockLevel(id: string, quantity: number): Promise<StockLevel> {
    await db.collection(COLLECTIONS.STOCK_LEVELS).doc(id).update({ quantity });
    const doc = await db.collection(COLLECTIONS.STOCK_LEVELS).doc(id).get();
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
            if (!data) {
                throw new Error(`StockLevel document ${doc.id} has no data`);
            }
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

// ─── ORDER HELPERS ──────────────────────────────────────────────────────────────

export async function getOrderById(id: string): Promise<Order | null> {
    const doc: DocumentSnapshot = await db.collection(COLLECTIONS.ORDERS).doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data();
    if (!data) {
        throw new Error(`Order document ${doc.id} has no data`);
    }
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

    if (statusFilter) {
        query = query.where("status", "==", statusFilter);
    }

    const snapshot = await query.orderBy("createdAt", "desc").get();

    return snapshot.docs.map((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (!data) {
            throw new Error(`Order document ${doc.id} has no data`);
        }
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
        if (!data) {
            throw new Error(`Order document ${doc.id} has no data`);
        }
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

export interface OrderWithItems extends Order {
    items: Array<OrderItem & { product: Product }>;
}

export async function getOrdersWithItems(statusFilter?: OrderStatus): Promise<OrderWithItems[]> {
    let query: Query = db.collection(COLLECTIONS.ORDERS);

    if (statusFilter) {
        query = query.where("status", "==", statusFilter);
    }

    const snapshot = await query.orderBy("createdAt", "desc").get();

    const orders = await Promise.all(
        snapshot.docs.map(async (doc: DocumentSnapshot) => {
            const data = doc.data();
            if (!data) {
                throw new Error(`Order document ${doc.id} has no data`);
            }
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

            // Fetch order items
            const itemsSnapshot = await db
                .collection(COLLECTIONS.ORDER_ITEMS)
                .where("orderId", "==", doc.id)
                .get();

            const items = await Promise.all(
                itemsSnapshot.docs.map(async (itemDoc: DocumentSnapshot) => {
                    const itemData = itemDoc.data();
                    if (!itemData) {
                        throw new Error(`OrderItem document ${itemDoc.id} has no data`);
                    }
                    const product = await getProductById(itemData.productId as string);
                    if (!product) {
                        throw new Error(`Product ${itemData.productId} not found`);
                    }
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

            return {
                ...order,
                items,
            } as OrderWithItems;
        })
    );

    return orders;
}

export async function getRecentOrdersWithItems(limit: number = 10): Promise<OrderWithItems[]> {
    const snapshot = await db
        .collection(COLLECTIONS.ORDERS)
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get();

    const orders = await Promise.all(
        snapshot.docs.map(async (doc: DocumentSnapshot) => {
            const data = doc.data();
            if (!data) {
                throw new Error(`Order document ${doc.id} has no data`);
            }
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

            // Fetch order items
            const itemsSnapshot = await db
                .collection(COLLECTIONS.ORDER_ITEMS)
                .where("orderId", "==", doc.id)
                .get();

            const items = await Promise.all(
                itemsSnapshot.docs.map(async (itemDoc: DocumentSnapshot) => {
                    const itemData = itemDoc.data();
                    if (!itemData) {
                        throw new Error(`OrderItem document ${itemDoc.id} has no data`);
                    }
                    const product = await getProductById(itemData.productId as string);
                    if (!product) {
                        throw new Error(`Product ${itemData.productId} not found`);
                    }
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

            return {
                ...order,
                items,
            } as OrderWithItems;
        })
    );

    return orders;
}

export async function createOrder(data: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
    const now = new Date();
    const orderRef = db.collection(COLLECTIONS.ORDERS).doc();

    const orderData = {
        ...data,
        createdAt: toTimestamp(now),
        updatedAt: toTimestamp(now),
    };

    await orderRef.set(orderData);

    return {
        id: orderRef.id,
        ...data,
        createdAt: now,
        updatedAt: now,
    };
}

export async function updateOrder(id: string, data: Partial<Order>): Promise<void> {
    const updateData: Record<string, unknown> = {
        ...data,
        updatedAt: toTimestamp(new Date()),
    };

    // Remove id, createdAt from update data
    delete updateData.id;
    delete updateData.createdAt;

    await db.collection(COLLECTIONS.ORDERS).doc(id).update(updateData);
}

export async function countOrders(statusFilter?: OrderStatus): Promise<number> {
    let query: Query = db.collection(COLLECTIONS.ORDERS);

    if (statusFilter) {
        query = query.where("status", "==", statusFilter);
    }

    const snapshot = await query.count().get();
    return snapshot.data().count;
}

export async function aggregateOrderTotal(): Promise<number> {
    const snapshot = await db.collection(COLLECTIONS.ORDERS).get();
    let total = 0;

    snapshot.docs.forEach((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (data && data.totalAmount) {
            total += Number(data.totalAmount);
        }
    });

    return total;
}

// ─── ORDER ITEM HELPERS ────────────────────────────────────────────────────────

export async function getOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    const snapshot = await db
        .collection(COLLECTIONS.ORDER_ITEMS)
        .where("orderId", "==", orderId)
        .get();

    return snapshot.docs.map((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (!data) {
            throw new Error(`OrderItem document ${doc.id} has no data`);
        }
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
    return {
        id: itemRef.id,
        ...data,
    };
}

// ─── DESIGN HELPERS ────────────────────────────────────────────────────────────

export async function getDesignById(id: string): Promise<Design | null> {
    const doc: DocumentSnapshot = await db.collection(COLLECTIONS.DESIGNS).doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data()!;
    return {
        id: doc.id,
        imageUrl: data.imageUrl,
        placement: data.placement,
        createdAt: toDate(data.createdAt),
    } as Design;
}

export async function createDesign(data: Omit<Design, "id" | "createdAt">): Promise<Design> {
    const now = new Date();
    const designRef = db.collection(COLLECTIONS.DESIGNS).doc();

    await designRef.set({
        imageUrl: data.imageUrl,
        placement: data.placement,
        createdAt: toTimestamp(now),
    });

    return {
        id: designRef.id,
        ...data,
        createdAt: now,
    };
}

// ─── AUDIT LOG HELPERS ─────────────────────────────────────────────────────────

export async function createAuditLog(data: Omit<AuditLog, "id" | "createdAt">): Promise<AuditLog> {
    const now = new Date();
    const logRef = db.collection(COLLECTIONS.AUDIT_LOGS).doc();

    await logRef.set({
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        details: data.details || null,
        createdAt: toTimestamp(now),
    });

    return {
        id: logRef.id,
        ...data,
        createdAt: now,
    };
}

// ─── CONTACT SUBMISSION HELPERS ────────────────────────────────────────────────

export interface ContactSubmission {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    query: string;
    createdAt: Date;
}

export async function createContactSubmission(data: Omit<ContactSubmission, "id" | "createdAt">): Promise<ContactSubmission> {
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
    if (typeof limit === "number" && limit > 0) {
        q = q.limit(limit);
    }
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

// ─── NEWSLETTER SUBSCRIPTIONS ────────────────────────────────────────────────────

export interface NewsletterSubscription {
    id: string;
    email: string;
    createdAt: Date;
}

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
