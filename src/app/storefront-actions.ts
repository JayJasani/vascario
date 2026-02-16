"use server";

import {
    getActiveProducts as getActiveProductsHelper,
    getProductById as getProductByIdHelper,
} from "@/lib/firebase-helpers";
import type { SearchItem } from "@/lib/search-data";

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

/**
 * Search products dynamically from Firebase.
 * Returns search items matching the query.
 */
export async function searchItems(query: string): Promise<SearchItem[]> {
    if (!query.trim()) return [];

    try {
        // Fetch active products from Firebase
        const products = await getActiveProductsHelper();

        // Convert products to search items
        const productItems: SearchItem[] = products.map((product) => ({
            id: product.id,
            name: product.name,
            type: "product" as const,
            url: `/product/${product.id}`,
            image: product.images[0],
            price: product.price,
        }));

        // Filter by query
        const q = query.toLowerCase().trim();
        return productItems.filter(
            (item) =>
                item.name.toLowerCase().includes(q) ||
                item.type.toLowerCase().includes(q) ||
                (item.tag && item.tag.toLowerCase().includes(q))
        );
    } catch (error) {
        console.error("Error searching items:", error);
        return [];
    }
}
