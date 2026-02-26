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

export async function GET(request: NextRequest) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return Response.json(
        { error: "Missing or invalid authorization" },
        { status: 401 },
      );
    }

    const ordersRef = db
      .collection(COLLECTIONS.ORDERS)
      .where("userId", "==", user.uid)
      .orderBy("createdAt", "desc")
      .limit(50)
      .select(
        "status",
        "totalAmount",
        "paymentId",
        "razorpayOrderId",
        "paymentMethod",
        "createdAt",
      );

    const snapshot = await ordersRef.get();

    const orders = snapshot.docs.map((doc) => {
      const data = doc.data() as {
        status?: unknown;
        totalAmount?: unknown;
        paymentId?: unknown;
        razorpayOrderId?: unknown;
        paymentMethod?: unknown;
        createdAt?: { toDate?: () => Date } | null;
      };
      return {
        id: doc.id,
        status: (data.status as string) ?? "PENDING",
        totalAmount: Number(data.totalAmount ?? 0),
        paymentId: (data.paymentId as string | null) ?? null,
        razorpayOrderId: (data.razorpayOrderId as string | null) ?? null,
        paymentMethod: (data.paymentMethod as "ONLINE" | "COD" | null) ?? null,
        createdAt: data.createdAt?.toDate?.().toISOString?.() ?? null,
      };
    });

    return Response.json(
      { orders },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, max-age=30",
        },
      },
    );
  } catch (error) {
    console.error("Orders API GET error:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

