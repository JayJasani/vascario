import { getAllBackInStockNotifications } from "@/lib/repositories";

export interface AdminBackInStockView {
    id: string;
    email: string;
    productId: string;
    productSlug: string;
    size: string | null;
    createdAt: string;
}

export async function getAdminBackInStockNotifications(): Promise<AdminBackInStockView[]> {
    const list = await getAllBackInStockNotifications();
    return list.map((n) => ({
        id: n.id,
        email: n.email,
        productId: n.productId,
        productSlug: n.productSlug,
        size: n.size,
        createdAt: n.createdAt.toISOString(),
    }));
}
