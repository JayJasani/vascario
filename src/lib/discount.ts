/**
 * Discount calculation utilities.
 * Provides consistent discount logic across product cards, product details, search, etc.
 */

/** Returns true when cutPrice (original price) exists and is greater than price (selling price). */
export function hasDiscount(
  cutPrice: number | null | undefined,
  price: number
): boolean {
  return cutPrice != null && cutPrice > price;
}

/** Returns discount percentage (0–100). Use only when hasDiscount() is true. */
export function getDiscountPercentage(
  cutPrice: number,
  price: number
): number {
  if (cutPrice <= 0) return 0;
  return Math.round(((cutPrice - price) / cutPrice) * 100);
}

/** Returns discount amount (cutPrice - price). Use only when hasDiscount() is true. */
export function getDiscountAmount(cutPrice: number, price: number): number {
  return cutPrice - price;
}
