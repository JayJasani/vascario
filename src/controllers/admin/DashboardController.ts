import {
    countOrders,
    aggregateOrderTotal,
    getTotalInvestment,
    getActiveProducts,
    getLowStockAlerts,
    getRecentOrdersWithItems,
} from "@/lib/firebase-helpers";
import type { OrderStatus } from "@/models/order";

export interface DashboardStats {
    totalOrders: number;
    pendingOrders: number;
    paidOrders: number;
    totalRevenue: string;
    totalInvestment: string;
    activeProducts: number;
    lowStockAlerts: number;
    recentOrders: Array<{
        id: string;
        customerName: string;
        customerEmail: string;
        status: OrderStatus;
        totalAmount: string;
        createdAt: string;
        items: Array<{
            productName: string;
            size: string;
            color: string;
            quantity: number;
        }>;
    }>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
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
        countOrders("PENDING" as OrderStatus),
        countOrders("PAID" as OrderStatus),
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
