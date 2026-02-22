"use server";

import {
    getContactSubmissions,
    getRecentOrdersWithItems,
    getOrdersWithItems,
    updateOrder,
    createAuditLog,
    countOrders,
    aggregateOrderTotal,
    getAllProducts,
    getActiveProducts,
    createProduct as createProductHelper,
    updateProduct,
    deleteProduct,
    deleteStockLevelsByProductId,
    getProductById,
    getStockLevelsByProductId,
    updateStockLevel,
    getLowStockAlerts,
    createStockLevel,
    getNewsletterSubscriptions,
    getAllStaticContent,
    getStaticContentByKey,
    upsertStaticContent,
    deleteStaticContent,
    getAllReviews,
    getActiveReviews,
    createReview as createReviewHelper,
    updateReview as updateReviewHelper,
    deleteReview as deleteReviewHelper,
    getAllInvestments,
    createInvestment as createInvestmentHelper,
    updateInvestment,
    deleteInvestment,
    getTotalInvestment,
    type OrderStatus,
    type StaticContent,
    type Review,
} from "@/lib/firebase-helpers";
import { revalidatePath, revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/storefront-cache";

// ─── DASHBOARD STATS ───────────────────────────────────────────────────────────

export async function getDashboardStats() {
    const [
        totalOrders,
        pendingOrders,
        paidOrders,
        totalRevenue,
        totalInvestment,
        activeProducts,
        lowStockAlerts,
        recentOrders,
    ] = await Promise.all([
        countOrders(),
        countOrders("PENDING"),
        countOrders("PAID"),
        aggregateOrderTotal(),
        getTotalInvestment(),
        getActiveProducts().then((products) => products.length),
        getLowStockAlerts().then((alerts) => alerts.length),
        getRecentOrdersWithItems(10),
    ]);

    return {
        totalOrders,
        pendingOrders,
        paidOrders,
        totalRevenue: totalRevenue.toString(),
        totalInvestment: totalInvestment.toString(),
        activeProducts,
        lowStockAlerts,
        recentOrders: recentOrders.map((order) => ({
            id: order.id,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            status: order.status,
            totalAmount: order.totalAmount.toString(),
            createdAt: order.createdAt.toISOString(),
            items: order.items.map((item) => ({
                productName: item.product.name,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
            })),
        })),
    };
}

// ─── ORDERS ─────────────────────────────────────────────────────────────────────

export async function getOrders(statusFilter?: OrderStatus) {
    const orders = await getOrdersWithItems(statusFilter);

    return orders.map((order) => ({
        id: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        status: order.status,
        totalAmount: order.totalAmount.toString(),
        paymentId: order.paymentId,
        trackingNumber: order.trackingNumber,
        trackingCarrier: order.trackingCarrier,
        notes: order.notes,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
            productName: item.product.name,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
        })),
    }));
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
    await updateOrder(orderId, { status });

    await createAuditLog({
        action: `ORDER_${status}`,
        entity: "Order",
        entityId: orderId,
        details: { newStatus: status },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
}

export async function addTrackingInfo(
    orderId: string,
    trackingNumber: string,
    carrier: string
) {
    await updateOrder(orderId, {
        trackingNumber,
        trackingCarrier: carrier,
        status: "SHIPPED",
    });

    await createAuditLog({
        action: "ORDER_SHIPPED",
        entity: "Order",
        entityId: orderId,
        details: { trackingNumber, carrier },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
}

// ─── CONTACT SUBMISSIONS ────────────────────────────────────────────────────────

export async function getAdminContactSubmissions() {
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

// ─── NEWSLETTER SUBSCRIPTIONS ────────────────────────────────────────────────────

export async function getAdminNewsletterSubscriptions() {
    const list = await getNewsletterSubscriptions();
    return list.map((s) => ({
        id: s.id,
        email: s.email,
        createdAt: s.createdAt.toISOString(),
    }));
}

// ─── PRODUCTS / DROPS ───────────────────────────────────────────────────────────

export async function getProducts() {
    const products = await getAllProducts();
    const productsWithStock = await Promise.all(
        products.map(async (product) => {
            const stock = await getStockLevelsByProductId(product.id);
            return {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                images: product.images,
                colors: product.colors,
                sizes: product.sizes,
                sku: product.sku,
                isActive: product.isActive,
                createdAt: product.createdAt.toISOString(),
                stock: stock.map((s) => ({
                    id: s.id,
                    size: s.size,
                    quantity: s.quantity,
                    lowThreshold: s.lowThreshold,
                })),
            };
        })
    );

    return productsWithStock;
}

export async function createProduct(formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const sku = (formData.get("sku") as string) || null;
    const imagesString = formData.get("images") as string;
    const images = imagesString
        ? imagesString.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
    const colors = (formData.get("colors") as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    const sizesRaw = formData.getAll("sizes");
    const sizes = Array.isArray(sizesRaw)
        ? (sizesRaw as string[]).map((s) => s.trim()).filter(Boolean)
        : (formData.get("sizes") as string)?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

    const product = await createProductHelper({
        name,
        description,
        price,
        sku,
        images,
        colors,
        sizes,
        isActive: true,
    });

    // Create stock levels for each size
    await Promise.all(
        sizes.map((size) =>
            createStockLevel({
                productId: product.id,
                size,
                quantity: 0,
                lowThreshold: 5,
            })
        )
    );

    await createAuditLog({
        action: "PRODUCT_CREATED",
        entity: "Product",
        entityId: product.id,
        details: { name },
    });

    // Notify newsletter subscribers about the new drop (log placeholder).
    // To hook up a real email service, use these emails with your provider (Resend, SendGrid, etc.).
    try {
        const subscribers = await getNewsletterSubscriptions();
        const emails = subscribers.map((s) => s.email);
        console.log(
            "[Newsletter] New drop created:",
            name,
            "would be announced to",
            emails.length,
            "subscribers."
        );
    } catch (err) {
        console.error("Failed to load newsletter subscribers for new drop notification:", err);
    }

    revalidatePath("/admin/drops");
    revalidatePath("/admin/inventory");
    revalidatePath("/admin");
    revalidateTag(CACHE_TAGS.activeProducts, "max");
}

export async function toggleProductActive(productId: string) {
    const product = await getProductById(productId);
    if (!product) return;

    await updateProduct(productId, { isActive: !product.isActive });

    revalidatePath("/admin/drops");
    revalidatePath("/admin");
    revalidateTag(CACHE_TAGS.activeProducts, "max");
    revalidateTag(CACHE_TAGS.product(productId), "max");
}

export async function deleteDropAction(productId: string) {
    const product = await getProductById(productId);
    if (!product) return;

    await deleteStockLevelsByProductId(productId);
    await deleteProduct(productId);

    await createAuditLog({
        action: "PRODUCT_DELETED",
        entity: "Product",
        entityId: productId,
        details: { name: product.name },
    });

    revalidatePath("/admin/drops");
    revalidatePath("/admin/inventory");
    revalidatePath("/admin");
    revalidateTag(CACHE_TAGS.activeProducts, "max");
    revalidateTag(CACHE_TAGS.product(productId), "max");
}

export async function updateProductAction(productId: string, formData: FormData) {
    const existing = await getProductById(productId);
    if (!existing) return;

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const sku = (formData.get("sku") as string) || null;
    const imagesString = formData.get("images") as string;
    const images = imagesString
        ? imagesString.split(",").map((s) => s.trim()).filter(Boolean)
        : existing.images;
    const colors = (formData.get("colors") as string)
        ? (formData.get("colors") as string).split(",").map((s) => s.trim()).filter(Boolean)
        : existing.colors;
    const sizesRaw = formData.getAll("sizes");
    const sizes = Array.isArray(sizesRaw)
        ? (sizesRaw as string[]).map((s) => s.trim()).filter(Boolean)
        : (formData.get("sizes") as string)?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

    await updateProduct(productId, {
        name,
        description,
        price,
        sku,
        images,
        colors,
        sizes,
    });

    // Create stock levels for any new sizes that don't exist yet
    const existingStock = await getStockLevelsByProductId(productId);
    const existingSizes = new Set(existingStock.map((s) => s.size));
    for (const size of sizes) {
        if (!existingSizes.has(size)) {
            await createStockLevel({
                productId,
                size,
                quantity: 0,
                lowThreshold: 5,
            });
        }
    }

    await createAuditLog({
        action: "PRODUCT_UPDATED",
        entity: "Product",
        entityId: productId,
        details: { name },
    });

    revalidatePath("/admin/drops");
    revalidatePath("/admin/inventory");
    revalidatePath("/admin");
    revalidateTag(CACHE_TAGS.activeProducts, "max");
    revalidateTag(CACHE_TAGS.product(productId), "max");
}

// ─── INVENTORY ──────────────────────────────────────────────────────────────────

export async function getStockLevels() {
    const products = await getAllProducts();
    const activeProducts = products.filter((p) => p.isActive);
    activeProducts.sort((a, b) => a.name.localeCompare(b.name));

    const productsWithStock = await Promise.all(
        activeProducts.map(async (product) => {
            const stock = await getStockLevelsByProductId(product.id);
            return {
                id: product.id,
                name: product.name,
                sku: product.sku,
                sizes: product.sizes,
                stock: stock.map((s) => ({
                    id: s.id,
                    size: s.size,
                    quantity: s.quantity,
                    lowThreshold: s.lowThreshold,
                })),
            };
        })
    );

    return productsWithStock;
}

export async function updateStock(
    stockLevelId: string,
    quantity: number
) {
    const stockLevel = await updateStockLevel(stockLevelId, quantity);

    await createAuditLog({
        action: "STOCK_UPDATED",
        entity: "StockLevel",
        entityId: stockLevelId,
        details: {
            newQuantity: quantity,
            productId: stockLevel.productId,
            size: stockLevel.size,
        },
    });

    revalidatePath("/admin/inventory");
    revalidatePath("/admin");
}

// ─── STATIC CONTENT ───────────────────────────────────────────────────────────────

export async function getStaticContent() {
    return await getAllStaticContent();
}

export async function updateStaticContent(
    key: string,
    url: string,
    type: "video" | "image",
    redirectUrl?: string | null
) {
    const content = await upsertStaticContent(key, url, type, redirectUrl);

    await createAuditLog({
        action: "STATIC_CONTENT_UPDATED",
        entity: "StaticContent",
        entityId: content.id,
        details: {
            key,
            url,
            type,
            redirectUrl: redirectUrl || null,
        },
    });

    revalidatePath("/admin/static-content");
    revalidatePath("/");
    revalidatePath("/product/[slug]", "page");
    revalidateTag(CACHE_TAGS.STATIC_CONTENT, "max");

    return content;
}

export async function deleteStaticContentAction(key: string) {
    const content = await getStaticContentByKey(key);

    if (content) {
        await deleteStaticContent(key);

        await createAuditLog({
            action: "STATIC_CONTENT_DELETED",
            entity: "StaticContent",
            entityId: content.id,
            details: {
                key,
            },
        });
    }

    revalidatePath("/admin/static-content");
    revalidatePath("/");
    revalidatePath("/product/[slug]", "page");
    revalidateTag(CACHE_TAGS.STATIC_CONTENT, "max");
}

// ─── USER REVIEWS ─────────────────────────────────────────────────────────────────

export async function getReviewsAction() {
    return await getAllReviews();
}

export async function createReviewAction(
    authorName: string,
    text: string,
    rating?: number | null,
    sortOrder?: number
) {
    const review = await createReviewHelper(authorName, text, rating, sortOrder);
    await createAuditLog({
        action: "REVIEW_CREATED",
        entity: "Review",
        entityId: review.id,
        details: { authorName, text: text.slice(0, 80) },
    });
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    revalidateTag(CACHE_TAGS.reviews, "max");
    return review;
}

export async function updateReviewAction(
    id: string,
    updates: { authorName?: string; text?: string; rating?: number | null; sortOrder?: number; isActive?: boolean }
) {
    const review = await updateReviewHelper(id, updates);
    await createAuditLog({
        action: "REVIEW_UPDATED",
        entity: "Review",
        entityId: id,
        details: updates,
    });
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    revalidateTag(CACHE_TAGS.reviews, "max");
    return review;
}

export async function deleteReviewAction(id: string) {
    await deleteReviewHelper(id);
    await createAuditLog({
        action: "REVIEW_DELETED",
        entity: "Review",
        entityId: id,
        details: {},
    });
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    revalidateTag(CACHE_TAGS.reviews, "max");
}

// ─── INVESTMENTS ─────────────────────────────────────────────────────────────────

export async function getInvestmentsAction() {
    const list = await getAllInvestments();
    return list.map((i) => ({
        id: i.id,
        name: i.name,
        description: i.description,
        amount: i.amount.toString(),
        createdAt: i.createdAt.toISOString(),
        updatedAt: i.updatedAt.toISOString(),
    }));
}

export async function createInvestmentAction(formData: FormData) {
    const name = (formData.get("name") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || "";
    const amount = parseFloat((formData.get("amount") as string) || "0");
    if (!name || isNaN(amount)) throw new Error("Name and amount are required.");
    const inv = await createInvestmentHelper({ name, description, amount });
    await createAuditLog({
        action: "INVESTMENT_CREATED",
        entity: "Investment",
        entityId: inv.id,
        details: { name, amount },
    });
    revalidatePath("/admin/investment");
    revalidatePath("/admin");
}

export async function updateInvestmentAction(
    id: string,
    formData: FormData
) {
    const name = (formData.get("name") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || "";
    const amount = parseFloat((formData.get("amount") as string) || "0");
    if (!name || isNaN(amount)) throw new Error("Name and amount are required.");
    await updateInvestment(id, { name, description, amount });
    await createAuditLog({
        action: "INVESTMENT_UPDATED",
        entity: "Investment",
        entityId: id,
        details: { name, amount },
    });
    revalidatePath("/admin/investment");
    revalidatePath("/admin");
}

export async function deleteInvestmentAction(id: string) {
    await deleteInvestment(id);
    await createAuditLog({
        action: "INVESTMENT_DELETED",
        entity: "Investment",
        entityId: id,
        details: {},
    });
    revalidatePath("/admin/investment");
    revalidatePath("/admin");
}
