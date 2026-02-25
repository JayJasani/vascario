export interface StorefrontProduct {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    cutPrice?: number | null;
    images: string[];
    colors: string[];
    sizes: string[];
    sku: string | null;
    totalStock: number;
}

export interface StockBySize {
    size: string;
    quantity: number;
}

export interface StorefrontReview {
    id: string;
    authorName: string;
    text: string;
    rating?: number | null;
    sortOrder: number;
}
