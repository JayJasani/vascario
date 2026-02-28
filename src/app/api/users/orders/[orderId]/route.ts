import { NextRequest } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { db, COLLECTIONS } from "@/lib/firebase";

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

async function verifyUser(request: NextRequest) {
  const token = getToken(request);
  if (!token) return null;
  const adminAuth = getAuth();
  const decoded = await adminAuth.verifyIdToken(token);
  return { uid: decoded.uid, email: decoded.email ?? "" };
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> },
) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return Response.json(
        { error: "Missing or invalid authorization" },
        { status: 401 },
      );
    }

    const { orderId } = await context.params;

    let orderDoc = await db
      .collection(COLLECTIONS.ORDERS)
      .doc(orderId)
      .get();

    if (!orderDoc.exists) {
      // Fallback: allow lookup by paymentId or razorpayOrderId so that
      // legacy URLs that used those values still resolve correctly.
      const byPaymentId = await db
        .collection(COLLECTIONS.ORDERS)
        .where("paymentId", "==", orderId)
        .limit(1)
        .get();

      if (!byPaymentId.empty) {
        orderDoc = byPaymentId.docs[0];
      } else {
        const byRazorpayOrderId = await db
          .collection(COLLECTIONS.ORDERS)
          .where("razorpayOrderId", "==", orderId)
          .limit(1)
          .get();

        if (!byRazorpayOrderId.empty) {
          orderDoc = byRazorpayOrderId.docs[0];
        }
      }
    }

    if (!orderDoc.exists) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const orderData = orderDoc.data() as any;

    if (orderData.userId !== user.uid) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const itemsSnapshot = await db
      .collection(COLLECTIONS.ORDER_ITEMS)
      .where("orderId", "==", orderDoc.id)
      .get();

    const items = itemsSnapshot.docs.map((doc) => {
      const data = doc.data() as {
        productId?: unknown;
        productName?: unknown;
        productImage?: unknown;
        productSlug?: unknown;
        size?: unknown;
        color?: unknown;
        quantity?: unknown;
        unitPrice?: unknown;
      };
      return {
        id: doc.id,
        productId: (data.productId as string) ?? "",
        productName: (data.productName as string | null) ?? null,
        productImage: (data.productImage as string | null) ?? null,
        productSlug: (data.productSlug as string | null) ?? null,
        size: (data.size as string | null) ?? null,
        color: (data.color as string | null) ?? null,
        quantity: (data.quantity as number | null) ?? 0,
        unitPrice: Number(data.unitPrice ?? 0),
      };
    });

    const totalAmount = Number(orderData.totalAmount ?? 0);
    const subtotalAmount = Number(
      orderData.subtotalAmount != null ? orderData.subtotalAmount : totalAmount,
    );
    const discountAmountRaw = Number(orderData.discountAmount ?? subtotalAmount - totalAmount);
    const discountAmount =
      !Number.isFinite(discountAmountRaw) || discountAmountRaw <= 0
        ? 0
        : Math.min(subtotalAmount, discountAmountRaw);

    const order = {
      id: orderDoc.id,
      status: orderData.status ?? "PENDING",
      totalAmount,
      subtotalAmount,
      discountAmount,
      couponCode:
        typeof orderData.couponCode === "string" && orderData.couponCode.trim()
          ? (orderData.couponCode as string).trim().toUpperCase()
          : null,
      paymentId: orderData.paymentId ?? null,
      razorpayOrderId: orderData.razorpayOrderId ?? null,
      paymentMethod: orderData.paymentMethod ?? null,
      createdAt: orderData.createdAt?.toDate?.().toISOString?.() ?? null,
      shippingAddress: orderData.shippingAddress ?? {},
    };

    return Response.json(
      { order, items },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, max-age=15",
        },
      },
    );
  } catch (error) {
    console.error("Order detail API GET error:", error);
    return Response.json(
      { error: "Failed to fetch order details" },
      { status: 500 },
    );
  }
}

