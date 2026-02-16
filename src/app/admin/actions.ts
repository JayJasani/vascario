"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Local type matching the Prisma OrderStatus enum — avoids import issues before `prisma generate`
type OrderStatus = "PENDING" | "PAID" | "IN_PRODUCTION" | "SHIPPED" | "DELIVERED" | "CANCELLED";

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
        prisma.order.count(),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.order.count({ where: { status: "PAID" } }),
        prisma.order.aggregate({ _sum: { totalAmount: true } }),
        prisma.product.count({ where: { isActive: true } }),
        prisma.$queryRawUnsafe<[{ count: bigint }]>(
            `SELECT COUNT(*)::bigint as count FROM "StockLevel" WHERE quantity <= "lowThreshold"`
        ).then((res) => Number(res[0]?.count ?? 0)),
        prisma.order.findMany({
            take: 10,
            orderBy: { createdAt: "desc" },
            include: {
                items: {
                    include: { product: true },
                },
            },
        }),
    ]);

    return {
        totalOrders,
        pendingOrders,
        paidOrders,
        totalRevenue: totalRevenue._sum.totalAmount?.toString() ?? "0",
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
    const orders = await prisma.order.findMany({
        where: statusFilter ? { status: statusFilter } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
            items: {
                include: { product: true },
            },
        },
    });

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
    await prisma.order.update({
        where: { id: orderId },
        data: { status },
    });

    await prisma.auditLog.create({
        data: {
            action: `ORDER_${status}`,
            entity: "Order",
            entityId: orderId,
            details: { newStatus: status },
        },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
}

export async function addTrackingInfo(
    orderId: string,
    trackingNumber: string,
    carrier: string
) {
    await prisma.order.update({
        where: { id: orderId },
        data: {
            trackingNumber,
            trackingCarrier: carrier,
            status: "SHIPPED",
        },
    });

    await prisma.auditLog.create({
        data: {
            action: "ORDER_SHIPPED",
            entity: "Order",
            entityId: orderId,
            details: { trackingNumber, carrier },
        },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
}

// ─── PRODUCTS / DROPS ───────────────────────────────────────────────────────────

export async function getProducts() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            stock: true,
        },
    });

    return products.map((product) => ({
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
        stock: product.stock.map((s) => ({
            id: s.id,
            size: s.size,
            quantity: s.quantity,
            lowThreshold: s.lowThreshold,
        })),
    }));
}

export async function createProduct(formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const sku = (formData.get("sku") as string) || null;
    const images = (formData.get("images") as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    const colors = (formData.get("colors") as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    const sizes = (formData.get("sizes") as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    const product = await prisma.product.create({
        data: {
            name,
            description,
            price,
            sku,
            images,
            colors,
            sizes,
            stock: {
                create: sizes.map((size) => ({
                    size,
                    quantity: 0,
                    lowThreshold: 5,
                })),
            },
        },
    });

    await prisma.auditLog.create({
        data: {
            action: "PRODUCT_CREATED",
            entity: "Product",
            entityId: product.id,
            details: { name },
        },
    });

    revalidatePath("/admin/drops");
    revalidatePath("/admin/inventory");
    revalidatePath("/admin");
}

export async function toggleProductActive(productId: string) {
    const product = await prisma.product.findUnique({
        where: { id: productId },
    });
    if (!product) return;

    await prisma.product.update({
        where: { id: productId },
        data: { isActive: !product.isActive },
    });

    revalidatePath("/admin/drops");
    revalidatePath("/admin");
}

// ─── INVENTORY ──────────────────────────────────────────────────────────────────

export async function getStockLevels() {
    const products = await prisma.product.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        include: { stock: true },
    });

    return products.map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        sizes: product.sizes,
        stock: product.stock.map((s) => ({
            id: s.id,
            size: s.size,
            quantity: s.quantity,
            lowThreshold: s.lowThreshold,
        })),
    }));
}

export async function updateStock(
    stockLevelId: string,
    quantity: number
) {
    const stockLevel = await prisma.stockLevel.update({
        where: { id: stockLevelId },
        data: { quantity },
    });

    await prisma.auditLog.create({
        data: {
            action: "STOCK_UPDATED",
            entity: "StockLevel",
            entityId: stockLevelId,
            details: { newQuantity: quantity, productId: stockLevel.productId, size: stockLevel.size },
        },
    });

    revalidatePath("/admin/inventory");
    revalidatePath("/admin");
}
