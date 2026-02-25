export interface BackInStockNotification {
    id: string;
    email: string;
    productId: string;
    productSlug: string;
    /** Size when product has sizes; otherwise null/empty. */
    size: string | null;
    createdAt: Date;
}

export type BackInStockNotificationCreateInput = Omit<
    BackInStockNotification,
    "id" | "createdAt"
>;
