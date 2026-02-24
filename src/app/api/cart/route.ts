import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";
import { db, COLLECTIONS } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";

interface VerifiedUser {
  uid: string;
  email: string;
  phoneNumber?: string;
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
      phoneNumber: decoded.phone_number ?? undefined,
    };
  } catch (error) {
    console.error("Cart API token verification error:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyUserFromCookies();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    const {
      productId,
      name,
      price,
      image,
      size,
      quantity,
    } = body as {
      productId?: string;
      name?: string;
      price?: number;
      image?: string;
      size?: string;
      quantity?: number;
    };

    if (
      !productId ||
      typeof productId !== "string" ||
      !size ||
      typeof size !== "string" ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      typeof quantity !== "number" ||
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      return Response.json(
        { error: "Missing or invalid cart item fields" },
        { status: 400 },
      );
    }

    const safeName =
      typeof name === "string" && name.trim().length > 0
        ? name.trim()
        : "Unknown item";
    const safeImage = typeof image === "string" ? image : "";

    const docId = `${productId}_${size}`;
    const cartItemRef = db
      .collection(COLLECTIONS.USERS)
      .doc(user.uid)
      .collection("cartItems")
      .doc(docId);

    const existingSnap = await cartItemRef.get();
    const existingData = existingSnap.data() as
      | { quantity?: number }
      | undefined;

    const newQuantity = (existingData?.quantity ?? 0) + quantity;

    await cartItemRef.set(
      {
        userId: user.uid,
        productId,
        name: safeName,
        price,
        image: safeImage,
        size,
        quantity: newQuantity,
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: existingSnap.exists
          ? existingData && (existingData as any).createdAt
          : FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return Response.json(
      {
        ok: true,
        item: {
          userId: user.uid,
          productId,
          name: safeName,
          price,
          image: safeImage,
          size,
          quantity: newQuantity,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Cart API POST error:", error);
    return Response.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

