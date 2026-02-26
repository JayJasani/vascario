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

    const orderDoc = await db
      .collection(COLLECTIONS.ORDERS)
      .doc(orderId)
      .get();

    if (!orderDoc.exists) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const orderData = orderDoc.data() as any;

    if (orderData.userId !== user.uid) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const itemsSnapshot = await db
      .collection(COLLECTIONS.ORDER_ITEMS)
      .where("orderId", "==", orderId)
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

    const order = {
      id: orderDoc.id,
      status: orderData.status ?? "PENDING",
      totalAmount: Number(orderData.totalAmount ?? 0),
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

