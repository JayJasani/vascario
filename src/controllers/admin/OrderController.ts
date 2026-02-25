import { revalidatePath } from "next/cache";
import { isValidId } from "@/lib/parse-form";
import {
    getOrdersWithItems,
    updateOrder,
    createAuditLog,
} from "@/lib/firebase-helpers";
import type { OrderStatus } from "@/models/order";

export interface AdminOrderView {
    id: string;
    customerName: string;
    customerEmail: string;
    status: OrderStatus;
    totalAmount: string;
    paymentId?: string | null;
    trackingNumber?: string | null;
    trackingCarrier?: string | null;
    notes?: string | null;
    createdAt: string;
    items: Array<{
        productName: string;
        size: string;
        color: string;
        quantity: number;
    }>;
}

export async function getOrders(statusFilter?: OrderStatus): Promise<AdminOrderView[]> {
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

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    if (!isValidId(orderId) || !status) return;
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
): Promise<void> {
    if (!isValidId(orderId) || !trackingNumber?.trim() || !carrier?.trim()) return;
    await updateOrder(orderId, {
        trackingNumber: trackingNumber.trim(),
        trackingCarrier: carrier.trim(),
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
