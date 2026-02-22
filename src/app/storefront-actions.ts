"use server";

import { unstable_cache } from "next/cache";
import {
    getActiveProducts as getActiveProductsHelper,
    getProductById as getProductByIdHelper,
    getProductBySlug as getProductBySlugHelper,
    getStockLevelsByProductId,
    getStockTotalsByProduct,
    getStaticContentByKey,
    getActiveReviews as getActiveReviewsHelper,
} from "@/lib/firebase-helpers";
import { CACHE_TAGS } from "@/lib/storefront-cache";
import type { SearchItem } from "@/lib/search-data";

// Cache TTL in seconds (live env: avoid hitting Firebase on every search/navigation)
const CACHE_REVALIDATE = 60;

// ─── PUBLIC STOREFRONT QUERIES ──────────────────────────────────────────────────

export interface StorefrontProduct {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    colors: string[];
    sizes: string[];
    sku: string | null;
    /** Total stock across all sizes. 0 = out of stock. */
    totalStock: number;
}

export interface StockBySize {
    size: string;
    quantity: number;
}

/** Cached active products (shared by getActiveProducts + searchItems) for fast live env. */
async function getCachedActiveProducts() {
    return unstable_cache(
        async () => getActiveProductsHelper(),
        ["storefront", "active-products"],
        { revalidate: CACHE_REVALIDATE, tags: [CACHE_TAGS.activeProducts] }
    )();
}

/** Cached stock totals per product ID. */
async function getCachedStockTotals(): Promise<Record<string, number>> {
    return unstable_cache(
        async () => getStockTotalsByProduct(),
        ["storefront", "stock-totals"],
        { revalidate: CACHE_REVALIDATE, tags: [CACHE_TAGS.activeProducts] }
    )();
}

/**
 * Fetch all active products for the storefront.
 * Returns products ordered by newest first, with totalStock.
 */
export async function getActiveProducts(): Promise<StorefrontProduct[]> {
    const [products, stockTotals] = await Promise.all([
        getCachedActiveProducts(),
        getCachedStockTotals(),
    ]);

    return products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        images: p.images,
        colors: p.colors,
        sizes: p.sizes,
        sku: p.sku ?? null,
        totalStock: stockTotals[p.id] ?? 0,
    }));
}

/**
 * Fetch a single product by ID (must be active).
 * Returns null if not found or inactive. Includes stockBySize for per-size availability.
 */
export async function getProductById(id: string): Promise<(StorefrontProduct & { stockBySize: StockBySize[] }) | null> {
    const [product, stockLevels] = await Promise.all([
        unstable_cache(
            async () => getProductByIdHelper(id),
            ["storefront", "product", id],
            { revalidate: CACHE_REVALIDATE, tags: [CACHE_TAGS.activeProducts, CACHE_TAGS.product(id)] }
        )(),
        getStockLevelsByProductId(id),
    ]);

    if (!product || !product.isActive) return null;

    const totalStock = stockLevels.reduce((sum, s) => sum + s.quantity, 0);
    const stockBySize: StockBySize[] = stockLevels.map((s) => ({ size: s.size, quantity: s.quantity }));

    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        images: product.images,
        colors: product.colors,
        sizes: product.sizes,
        sku: product.sku ?? null,
        totalStock,
        stockBySize,
    };
}

/**
 * Fetch a single product by slug (must be active).
 * Returns null if not found or inactive. Includes stockBySize for per-size availability.
 */
export async function getProductBySlug(slug: string): Promise<(StorefrontProduct & { stockBySize: StockBySize[] }) | null> {
    // Note: if a product previously had no `slug` stored, older deployments may have
    // cached `null` for this slug. If the cached result is null, do a direct (uncached)
    // fetch which also allows the helper to "self-heal" by persisting the slug.
    const cached = await unstable_cache(
        async () => getProductBySlugHelper(slug),
        ["storefront", "product", "slug", slug],
        { revalidate: CACHE_REVALIDATE, tags: [CACHE_TAGS.activeProducts] }
    )();
    const product = cached ?? (await getProductBySlugHelper(slug));

    if (!product || !product.isActive) return null;

    const stockLevels = await getStockLevelsByProductId(product.id);
    const totalStock = stockLevels.reduce((sum, s) => sum + s.quantity, 0);
    const stockBySize: StockBySize[] = stockLevels.map((s) => ({ size: s.size, quantity: s.quantity }));

    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        images: product.images,
        colors: product.colors,
        sizes: product.sizes,
        sku: product.sku ?? null,
        totalStock,
        stockBySize,
    };
}

/**
 * Search products dynamically from Firebase.
 * Returns search items matching the query.
 */
export async function searchItems(query: string): Promise<SearchItem[]> {
    if (!query.trim()) return [];

    try {
        // Use cached active products (same as getActiveProducts) for fast search on live
        const products = await getCachedActiveProducts();

        // Convert products to search items
        const productItems: SearchItem[] = products.map((product) => ({
            id: product.id,
            name: product.name,
            type: "product" as const,
            url: `/product/${product.slug}`,
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

// ─── STATIC CONTENT ───────────────────────────────────────────────────────────────

// Cache static content for 1 hour (3600 seconds) - fetched once per hour maximum
const STATIC_CONTENT_CACHE_TIME = 3600;

type StaticContentUrls = {
    onboard1: string;
    onboard2: string;
    tshirtCloseup: string;
    making_process: string;
    onboard1Redirect?: string | null;
    onboard2Redirect?: string | null;
    tshirtCloseupRedirect?: string | null;
};

/**
 * Get all static content URLs at once (fetched once and cached for 1 hour).
 * This ensures we only call Firebase once per hour instead of on every page load.
 */
async function getCachedStaticContent(): Promise<StaticContentUrls> {
    const cachedFn = unstable_cache(
        async (): Promise<StaticContentUrls> => {
            try {
                const [onboard1, onboard2, tshirtCloseup, making_process] = await Promise.all([
                    getStaticContentByKey("onboard1"),
                    getStaticContentByKey("onboard2"),
                    getStaticContentByKey("tshirtCloseup"),
                    getStaticContentByKey("making_process"),
                ]);

                return {
                    onboard1: onboard1?.url || "/video/onboard1.webm",
                    onboard2: onboard2?.url || "/video/onboard2.webm",
                    tshirtCloseup: tshirtCloseup?.url || "/tshirt/closeup.png",
                    making_process: making_process?.url || "",
                    onboard1Redirect: onboard1?.redirectUrl || null,
                    onboard2Redirect: onboard2?.redirectUrl || null,
                    tshirtCloseupRedirect: tshirtCloseup?.redirectUrl || null,
                };
            } catch (error) {
                console.error("Error fetching static content:", error);
                // Return fallbacks on error
                return {
                    onboard1: "/video/onboard1.webm",
                    onboard2: "/video/onboard2.webm",
                    tshirtCloseup: "/tshirt/closeup.png",
                    making_process: "",
                    onboard1Redirect: null,
                    onboard2Redirect: null,
                    tshirtCloseupRedirect: null,
                };
            }
        },
        ["storefront", "static-content", "all"],
        { 
            revalidate: STATIC_CONTENT_CACHE_TIME, 
            tags: [CACHE_TAGS.STATIC_CONTENT] 
        }
    );
    
    return await cachedFn();
}

/**
 * Get all static content URLs. Fetched once per hour maximum.
 * Returns an object with onboard1, onboard2, and tshirtCloseup URLs.
 */
export async function getStaticContentUrls(): Promise<StaticContentUrls> {
    return await getCachedStaticContent();
}

// ─── USER REVIEWS (ADMIN-MANAGED) ─────────────────────────────────────────────────

export interface StorefrontReview {
    id: string;
    authorName: string;
    text: string;
    rating: number | null;
}

/**
 * Get active reviews for the storefront (cached).
 */
export async function getReviews(): Promise<StorefrontReview[]> {
    const cachedFn = unstable_cache(
        async () => getActiveReviewsHelper(),
        ["storefront", "reviews"],
        { revalidate: CACHE_REVALIDATE, tags: [CACHE_TAGS.reviews] }
    );
    const reviews = await cachedFn();
    return reviews.map((r) => ({
        id: r.id,
        authorName: r.authorName,
        text: r.text,
        rating: r.rating ?? null,
    }));
}
