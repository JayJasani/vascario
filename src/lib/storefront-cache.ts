/** Cache tag constants for storefront data. Used by storefront-actions and admin revalidation. */
export const CACHE_TAGS = {
    activeProducts: "storefront-active-products",
    product: (id: string) => `storefront-product-${id}`,
    STATIC_CONTENT: "static-content",
} as const;
