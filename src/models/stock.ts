export interface StockLevel {
    id: string;
    productId: string;
    size: string;
    quantity: number;
    lowThreshold: number;
}

export type StockLevelCreateInput = Omit<StockLevel, "id">;
