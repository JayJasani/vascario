export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    /** Original price before discount, shown crossed out when present */
    cutPrice?: number | null;
    images: string[];
    colors: string[];
    sizes: string[];
    sku?: string | null;
    isActive: boolean;
    /** When true, product is shown in search when empty (good for promotions) */
    isFeatured?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type ProductCreateInput = Omit<Product, "id" | "createdAt" | "updatedAt" | "slug"> & { slug?: string };
export type ProductUpdateInput = Partial<Product>;
