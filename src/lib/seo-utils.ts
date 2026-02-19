/**
 * SEO Utility Functions
 * 
 * Helper functions for generating SEO-related content
 */

import { SEO_IMAGE_ALT, SEO_PAGES } from "./seo-config"

/**
 * Generate SEO-friendly image alt text
 */
export function getImageAlt(
  type: "product" | "productThumbnail" | "lookbook" | "editorial" | "logo",
  productName?: string,
  imageIndex?: number,
  totalImages?: number
): string {
  switch (type) {
    case "product":
      return SEO_IMAGE_ALT.product(productName || "", imageIndex, totalImages)
    case "productThumbnail":
      return SEO_IMAGE_ALT.productThumbnail(productName || "", imageIndex || 0)
    case "lookbook":
      return SEO_IMAGE_ALT.lookbook(productName || "")
    case "editorial":
      return SEO_IMAGE_ALT.editorial()
    case "logo":
      return SEO_IMAGE_ALT.logo()
    default:
      return productName || "Vascario premium embroidered streetwear"
  }
}

/**
 * Get SEO intro text for collection page
 */
export function getCollectionIntroText(): string {
  return SEO_PAGES.collection.introText
}

/**
 * Truncate text for meta descriptions (max 155-160 chars)
 */
export function truncateMetaDescription(text: string, maxLength: number = 155): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

/**
 * Generate SEO-friendly URL slug from product name
 */
export function generateProductSlug(productName: string): string {
  return productName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Generate SEO-friendly slug from product name (alias for generateProductSlug)
 */
export function generateSlug(name: string): string {
  return generateProductSlug(name)
}
