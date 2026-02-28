import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";
import { db, COLLECTIONS } from "@/lib/firebase";
import { getAllCoupons } from "@/lib/repositories";
import { getDiscountForSubtotal } from "@/lib/coupons";

interface VerifiedUser {
  uid: string;
  email: string;
}

async function verifyUserFromCookies(): Promise<VerifiedUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase-token")?.value;
  if (!token) return null;

  try {
    const adminAuth = getAuth();
    const decoded = await adminAuth.verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email ?? "",
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Available-coupons token verification error:", error);
    return null;
  }
}

export async function GET() {
  try {
    const user = await verifyUserFromCookies();
    if (!user) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    // Load current cart items for this user to compute applicability
    const cartSnap = await db
      .collection(COLLECTIONS.USERS)
      .doc(user.uid)
      .collection("cartItems")
      .get();

    let subtotal = 0;
    let hasValidCart = false;

    if (!cartSnap.empty) {
      const items = cartSnap.docs
        .map((doc) => {
          const data = doc.data() as {
            price?: number;
            quantity?: number;
          };
          if (
            typeof data.price !== "number" ||
            !Number.isFinite(data.price) ||
            typeof data.quantity !== "number" ||
            !Number.isFinite(data.quantity) ||
            data.quantity <= 0
          ) {
            return null;
          }
          return {
            price: data.price,
            quantity: data.quantity,
          };
        })
        .filter((x) => x !== null) as { price: number; quantity: number }[];

      subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      hasValidCart = Number.isFinite(subtotal) && subtotal > 0;
    }

    const allCoupons = await getAllCoupons();
    const visibleCoupons = allCoupons
      .filter((c) => c.isPublic)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const coupons = visibleCoupons.map((coupon) => {
      let isApplicable = false;
      let reason: string | null = null;
      let discountAmount = 0;

      if (!coupon.isActive) {
        reason = "Coupon is inactive";
      } else if (!hasValidCart) {
        reason = "Add items to your bag to apply";
      } else if (
        coupon.minCartTotal != null &&
        Number.isFinite(coupon.minCartTotal) &&
        subtotal < Number(coupon.minCartTotal)
      ) {
        reason = `Minimum order value is ₹${Number(
          coupon.minCartTotal,
        ).toFixed(0)}`;
      } else {
        discountAmount = getDiscountForSubtotal(
          {
            type: coupon.type,
            value: coupon.value,
            maxDiscount: coupon.maxDiscount ?? null,
          },
          subtotal,
        );

        if (discountAmount <= 0) {
          reason = "Does not apply to your current total";
        } else {
          isApplicable = true;
        }
      }

      return {
        code: coupon.code,
        label: coupon.label,
        type: coupon.type,
        value: coupon.value,
        minCartTotal: coupon.minCartTotal ?? null,
        maxDiscount: coupon.maxDiscount ?? null,
        isActive: coupon.isActive,
        isPublic: coupon.isPublic,
        isApplicable,
        discountAmount: isApplicable ? discountAmount : 0,
        reason,
      };
    });

    return Response.json(
      {
        ok: true,
        subtotal: hasValidCart ? subtotal : null,
        coupons,
      },
      { status: 200 },
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Available-coupons API error:", error);
    return Response.json(
      { ok: false, error: "Failed to load coupons" },
      { status: 500 },
    );
  }
}

