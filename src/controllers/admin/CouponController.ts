import { revalidatePath } from "next/cache";
import { getString, getFloat } from "@/lib/parse-form";
import {
  getAllCoupons,
  createCoupon as createCouponRepo,
  updateCoupon as updateCouponRepo,
  deleteCoupon as deleteCouponRepo,
  createAuditLog,
} from "@/lib/firebase-helpers";
import type { CouponType } from "@/lib/coupons";

export interface AdminCouponView {
  id: string;
  code: string;
  label: string;
  type: CouponType;
  value: string;
  minCartTotal: string;
  maxDiscount: string;
  isActive: boolean;
  /** When true, shown in public 'view all coupons' list */
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getCoupons(): Promise<AdminCouponView[]> {
  const list = await getAllCoupons();
  return list.map((c) => ({
    id: c.id,
    code: c.code,
    label: c.label,
    type: c.type,
    value: c.value.toString(),
    minCartTotal:
      c.minCartTotal != null ? Number(c.minCartTotal).toString() : "",
    maxDiscount:
      c.maxDiscount != null ? Number(c.maxDiscount).toString() : "",
    isActive: c.isActive,
    isPublic: c.isPublic,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
}

export async function createCoupon(formData: FormData): Promise<void> {
  const rawCode = getString(formData, "code").trim();
  const label = getString(formData, "label").trim();
  const type = getString(formData, "type").trim() as CouponType;
  const value = getFloat(formData, "value");
  const minCartTotal = getFloat(formData, "minCartTotal");
  const maxDiscount = getFloat(formData, "maxDiscount");
  const isActive = getString(formData, "isActive").trim() === "on";
  const isPublic = getString(formData, "isPublic").trim() === "on";

  if (!rawCode) throw new Error("Code is required.");
  if (!type || (type !== "PERCENT" && type !== "FLAT")) {
    throw new Error("Invalid coupon type.");
  }
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Discount value must be greater than zero.");
  }

  const coupon = await createCouponRepo({
    code: rawCode,
    label: label || rawCode,
    type,
    value,
    minCartTotal: Number.isFinite(minCartTotal) && minCartTotal > 0 ? minCartTotal : null,
    maxDiscount: Number.isFinite(maxDiscount) && maxDiscount > 0 ? maxDiscount : null,
    isActive,
    isPublic,
  });

  await createAuditLog({
    action: "COUPON_CREATED",
    entity: "Coupon",
    entityId: coupon.id,
    details: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
    },
  });

  revalidatePath("/admin/coupons");
}

export async function updateCoupon(
  id: string,
  formData: FormData,
): Promise<void> {
  const rawCode = getString(formData, "code").trim();
  const label = getString(formData, "label").trim();
  const type = getString(formData, "type").trim() as CouponType;
  const value = getFloat(formData, "value");
  const minCartTotal = getFloat(formData, "minCartTotal");
  const maxDiscount = getFloat(formData, "maxDiscount");
  const isActive = getString(formData, "isActive").trim() === "on";
  const isPublic = getString(formData, "isPublic").trim() === "on";

  if (!rawCode) throw new Error("Code is required.");
  if (!type || (type !== "PERCENT" && type !== "FLAT")) {
    throw new Error("Invalid coupon type.");
  }
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Discount value must be greater than zero.");
  }

  const updated = await updateCouponRepo(id, {
    code: rawCode,
    label: label || rawCode,
    type,
    value,
    minCartTotal: Number.isFinite(minCartTotal) && minCartTotal > 0 ? minCartTotal : null,
    maxDiscount: Number.isFinite(maxDiscount) && maxDiscount > 0 ? maxDiscount : null,
    isActive,
    isPublic,
  });

  if (updated) {
    await createAuditLog({
      action: "COUPON_UPDATED",
      entity: "Coupon",
      entityId: id,
      details: {
        code: updated.code,
        type: updated.type,
        value: updated.value,
      },
    });
  }

  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(id: string): Promise<void> {
  await deleteCouponRepo(id);

  await createAuditLog({
    action: "COUPON_DELETED",
    entity: "Coupon",
    entityId: id,
    details: {},
  });

  revalidatePath("/admin/coupons");
}

