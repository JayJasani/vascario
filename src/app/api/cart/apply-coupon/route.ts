import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";
import { db, COLLECTIONS } from "@/lib/firebase";
import { getCouponByCode } from "@/lib/repositories";
import { getDiscountForSubtotal } from "@/lib/coupons";
import { FieldValue } from "firebase-admin/firestore";

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
    console.error("Cart apply-coupon token verification error:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyUserFromCookies();
    if (!user) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return Response.json(
        { ok: false, error: "Invalid request body" },
        { status: 400 },
      );
    }

    const rawCode = (body as { code?: string }).code ?? "";
    const code = rawCode.trim().toUpperCase();

    if (!code) {
      return Response.json(
        { ok: false, error: "Enter a code to apply" },
        { status: 400 },
      );
    }

    // Load current cart items for this user
    const cartSnap = await db
      .collection(COLLECTIONS.USERS)
      .doc(user.uid)
      .collection("cartItems")
      .get();

    if (cartSnap.empty) {
      return Response.json(
        {
          ok: false,
          error: "Add items to your bag before applying a code",
        },
        { status: 400 },
      );
    }

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

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    if (!Number.isFinite(subtotal) || subtotal <= 0) {
      return Response.json(
        {
          ok: false,
          error: "Add items to your bag before applying a code",
        },
        { status: 400 },
      );
    }

    const coupon = await getCouponByCode(code);
    if (!coupon || !coupon.isActive) {
      return Response.json(
        { ok: false, error: "Invalid or expired coupon code" },
        { status: 400 },
      );
    }

    if (
      coupon.minCartTotal != null &&
      Number.isFinite(coupon.minCartTotal) &&
      subtotal < Number(coupon.minCartTotal)
    ) {
      return Response.json(
        {
          ok: false,
          error: `Minimum order value is ₹${Number(
            coupon.minCartTotal,
          ).toFixed(0)}`,
        },
        { status: 400 },
      );
    }

    const discountAmount = getDiscountForSubtotal(
      {
        type: coupon.type,
        value: coupon.value,
        maxDiscount: coupon.maxDiscount ?? null,
      },
      subtotal,
    );

    if (discountAmount <= 0) {
      return Response.json(
        {
          ok: false,
          error: "This coupon does not apply to your current total",
        },
        { status: 400 },
      );
    }

    const total = Math.max(0, subtotal - discountAmount);

    // Persist a lightweight cart meta snapshot for this user
    const metaRef = db
      .collection(COLLECTIONS.USERS)
      .doc(user.uid)
      .collection("cartMeta")
      .doc("coupon");

    await metaRef.set(
      {
        code: coupon.code,
        label: coupon.label,
        type: coupon.type,
        value: coupon.value,
        minCartTotal: coupon.minCartTotal ?? null,
        maxDiscount: coupon.maxDiscount ?? null,
        subtotal,
        discountAmount,
        total,
        isActive: coupon.isActive,
        appliedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return Response.json(
      {
        ok: true,
        coupon: {
          code: coupon.code,
          label: coupon.label,
          type: coupon.type,
          value: coupon.value,
          minCartTotal: coupon.minCartTotal ?? null,
          maxDiscount: coupon.maxDiscount ?? null,
        },
        subtotal,
        discountAmount,
        total,
      },
      { status: 200 },
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Cart apply-coupon API error:", error);
    return Response.json(
      { ok: false, error: "Failed to apply coupon" },
      { status: 500 },
    );
  }
}

