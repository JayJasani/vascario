import type { Product } from "./product";

export type OrderStatus =
    | "PENDING"
    | "PAID"
    | "IN_PRODUCTION"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

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

export interface OrderWithItems extends Order {
    items: Array<OrderItem & { product: Product }>;
}

export type OrderCreateInput = Omit<Order, "id" | "createdAt" | "updatedAt">;
export type OrderUpdateInput = Partial<Order>;
export type OrderItemCreateInput = Omit<OrderItem, "id">;
