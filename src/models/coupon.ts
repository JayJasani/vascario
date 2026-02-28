import type { CouponType } from "@/lib/coupons";

export interface Coupon {
  id: string;
  code: string;
  label: string;
  type: CouponType;
  value: number;
  minCartTotal?: number | null;
  maxDiscount?: number | null;
  isActive: boolean;
  /**
   * When true, this coupon is shown in the public
   * "view all coupons" list for all customers.
   * When false, it can still be applied manually
   * via code but won't appear in the suggestions.
   */
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CouponCreateInput = Omit<
  Coupon,
  "id" | "createdAt" | "updatedAt" | "isActive" | "isPublic"
> & {
  isActive?: boolean;
  isPublic?: boolean;
};

export type CouponUpdateInput = Partial<
  Omit<Coupon, "id" | "createdAt" | "updatedAt">
>;

