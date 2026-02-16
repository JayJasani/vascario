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
    getProductById,
    getStockLevelsByProductId,
    updateStockLevel,
    getLowStockAlerts,
    createStockLevel,
    type OrderStatus,
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
        activeProducts,
        lowStockAlerts,
        recentOrders,
    ] = await Promise.all([
        countOrders(),
        countOrders("PENDING"),
        countOrders("PAID"),
        aggregateOrderTotal(),
        getActiveProducts().then((products) => products.length),
        getLowStockAlerts().then((alerts) => alerts.length),
        getRecentOrdersWithItems(10),
    ]);

    return {
        totalOrders,
        pendingOrders,
        paidOrders,
        totalRevenue: totalRevenue.toString(),
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
