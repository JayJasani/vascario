import type { DocumentSnapshot } from "firebase-admin/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { toDate, toTimestamp } from "./utils";
import type {
  Coupon,
  CouponCreateInput,
  CouponUpdateInput,
} from "@/models/coupon";

function normalizeCode(code: string): string {
  return code.trim().toUpperCase();
}

export async function getAllCoupons(): Promise<Coupon[]> {
  const snapshot = await db
    .collection(COLLECTIONS.COUPONS)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc: DocumentSnapshot) => {
    const data = doc.data();
    if (!data) {
      throw new Error(`Coupon document ${doc.id} has no data`);
    }
    return {
      id: doc.id,
      code: String(data.code),
      label: String(data.label ?? data.code),
      type: (data.type as Coupon["type"]) ?? "PERCENT",
      value: Number(data.value ?? 0),
      minCartTotal:
        data.minCartTotal != null ? Number(data.minCartTotal) : null,
      maxDiscount: data.maxDiscount != null ? Number(data.maxDiscount) : null,
      isActive: Boolean(
        data.isActive === undefined || data.isActive === null
          ? true
          : data.isActive,
      ),
      isPublic: Boolean(data.isPublic ?? false),
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
    } as Coupon;
  });
}

export async function getCouponByCode(
  rawCode: string,
): Promise<Coupon | null> {
  const trimmed = rawCode.trim();
  if (!trimmed) return null;
  const code = normalizeCode(trimmed);

  const snapshot = await db
    .collection(COLLECTIONS.COUPONS)
    .where("code", "==", code)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  const data = doc.data();

  return {
    id: doc.id,
    code,
    label: String(data.label ?? code),
    type: (data.type as Coupon["type"]) ?? "PERCENT",
    value: Number(data.value ?? 0),
    minCartTotal:
      data.minCartTotal != null ? Number(data.minCartTotal) : null,
    maxDiscount: data.maxDiscount != null ? Number(data.maxDiscount) : null,
    isActive: Boolean(
      data.isActive === undefined || data.isActive === null
        ? true
        : data.isActive,
    ),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  } as Coupon;
}

export async function createCoupon(
  input: CouponCreateInput,
): Promise<Coupon> {
  const now = new Date();
  const ref = db.collection(COLLECTIONS.COUPONS).doc();

  const code = normalizeCode(input.code);

  await ref.set({
    code,
    label: input.label?.trim() || code,
    type: input.type,
    value: input.value,
    minCartTotal:
      input.minCartTotal != null ? Number(input.minCartTotal) : null,
    maxDiscount:
      input.maxDiscount != null ? Number(input.maxDiscount) : null,
    isActive: input.isActive ?? true,
    isPublic: input.isPublic ?? false,
    createdAt: toTimestamp(now),
    updatedAt: toTimestamp(now),
  });

  return {
    id: ref.id,
    code,
    label: input.label?.trim() || code,
    type: input.type,
    value: input.value,
    minCartTotal:
      input.minCartTotal != null ? Number(input.minCartTotal) : null,
    maxDiscount:
      input.maxDiscount != null ? Number(input.maxDiscount) : null,
    isActive: input.isActive ?? true,
    isPublic: input.isPublic ?? false,
    createdAt: now,
    updatedAt: now,
  };
}

export async function updateCoupon(
  id: string,
  updates: CouponUpdateInput,
): Promise<Coupon | null> {
  if (!id) return null;
  const doc = await db.collection(COLLECTIONS.COUPONS).doc(id).get();
  if (!doc.exists) return null;

  const data = doc.data();
  if (!data) return null;

  const now = new Date();
  const updateData: Record<string, unknown> = {
    updatedAt: toTimestamp(now),
  };

  if (updates.code !== undefined) {
    updateData.code = normalizeCode(updates.code);
  }
  if (updates.label !== undefined) {
    updateData.label = updates.label?.trim() || updates.code || data.code;
  }
  if (updates.type !== undefined) {
    updateData.type = updates.type;
  }
  if (updates.value !== undefined) {
    updateData.value = updates.value;
  }
  if (updates.minCartTotal !== undefined) {
    updateData.minCartTotal =
      updates.minCartTotal != null ? Number(updates.minCartTotal) : null;
  }
  if (updates.maxDiscount !== undefined) {
    updateData.maxDiscount =
      updates.maxDiscount != null ? Number(updates.maxDiscount) : null;
  }
  if (updates.isActive !== undefined) {
    updateData.isActive = updates.isActive;
  }
  if (updates.isPublic !== undefined) {
    updateData.isPublic = updates.isPublic;
  }

  await db.collection(COLLECTIONS.COUPONS).doc(id).update(updateData);

  const merged = { ...data, ...updateData };

  return {
    id,
    code: normalizeCode(String(merged.code)),
    label: String(merged.label ?? merged.code),
    type: (merged.type as Coupon["type"]) ?? "PERCENT",
    value: Number(merged.value ?? 0),
    minCartTotal:
      merged.minCartTotal != null ? Number(merged.minCartTotal) : null,
    maxDiscount:
      merged.maxDiscount != null ? Number(merged.maxDiscount) : null,
    isActive: Boolean(
      merged.isActive === undefined || merged.isActive === null
        ? true
        : merged.isActive,
    ),
    isPublic: Boolean(merged.isPublic ?? false),
    createdAt: toDate(merged.createdAt),
    updatedAt: now,
  } as Coupon;
}

export async function deleteCoupon(id: string): Promise<void> {
  if (!id) return;
  await db.collection(COLLECTIONS.COUPONS).doc(id).delete();
}

