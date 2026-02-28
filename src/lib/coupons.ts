export type CouponType = "PERCENT" | "FLAT";

/**
 * Shared coupon shape used across admin UI, API responses, and Firestore.
 * All authoring happens via the admin panel; this module only defines types
 * and math helpers (no hardcoded coupons).
 */
export interface CouponDefinition {
  code: string;
  label: string;
  type: CouponType;
  value: number;
  /** Minimum cart total required to use this coupon (in base currency units). */
  minCartTotal?: number | null;
  /** Maximum absolute discount this coupon can give. */
  maxDiscount?: number | null;
  /** When false, coupon is ignored even if the code matches. */
  isActive?: boolean;
}

/**
 * Pure discount calculation helper.
 * Given a coupon definition and cart subtotal, returns the discount amount.
 */
export function getDiscountForSubtotal(
  coupon: Pick<CouponDefinition, "type" | "value" | "maxDiscount">,
  cartTotal: number,
): number {
  if (!Number.isFinite(cartTotal) || cartTotal <= 0) return 0;

  const safeValue = Number(coupon.value) || 0;
  if (safeValue <= 0) return 0;

  let rawDiscount =
    coupon.type === "PERCENT" ? (cartTotal * safeValue) / 100 : safeValue;

  const maxDiscount =
    coupon.maxDiscount != null && Number.isFinite(Number(coupon.maxDiscount))
      ? Number(coupon.maxDiscount)
      : null;

  if (maxDiscount != null && maxDiscount > 0) {
    rawDiscount = Math.min(rawDiscount, maxDiscount);
  }

  // Guard against accidental over-discounting
  rawDiscount = Math.min(rawDiscount, cartTotal);

  return Math.max(0, Math.round(rawDiscount));
}

