"use server";

import {
    getActiveProducts as getActiveProductsHelper,
    getProductById as getProductByIdHelper,
} from "@/lib/firebase-helpers";

// ─── PUBLIC STOREFRONT QUERIES ──────────────────────────────────────────────────

export interface StorefrontProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    colors: string[];
    sizes: string[];
    sku: string | null;
}

/**
 * Fetch all active products for the storefront.
 * Returns products ordered by newest first.
 */
export async function getActiveProducts(): Promise<StorefrontProduct[]> {
    const products = await getActiveProductsHelper();

    return products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        images: p.images,
        colors: p.colors,
        sizes: p.sizes,
        sku: p.sku ?? null,
    }));
}

/**
 * Fetch a single product by ID (must be active).
 * Returns null if not found or inactive.
 */
export async function getProductById(id: string): Promise<StorefrontProduct | null> {
    const product = await getProductByIdHelper(id);

    if (!product || !product.isActive) return null;

    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images,
        colors: product.colors,
        sizes: product.sizes,
        sku: product.sku ?? null,
    };
}
