import { NextRequest } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { db, COLLECTIONS } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";

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

// POST - Set a default address for the authenticated user
export async function POST(request: NextRequest) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return Response.json(
        { error: "Missing or invalid authorization" },
        { status: 401 },
      );
    }

    const body = await request.json().catch(() => null) as
      | { addressId?: string }
      | null;

    const addressId = body?.addressId?.trim();
    if (!addressId) {
      return Response.json(
        { error: "Address ID is required" },
        { status: 400 },
      );
    }

    const addressesRef = db
      .collection(COLLECTIONS.USERS)
      .doc(user.uid)
      .collection("addresses");

    // Ensure the address exists and belongs to the user
    const targetDoc = await addressesRef.doc(addressId).get();
    if (!targetDoc.exists) {
      return Response.json(
        { error: "Address not found" },
        { status: 404 },
      );
    }

    // Fetch all addresses and set a single default
    const snapshot = await addressesRef.get();
    const batch = db.batch();

    snapshot.docs.forEach((doc) => {
      const isDefault = doc.id === addressId;
      batch.update(doc.ref, {
        isDefault,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    return Response.json({ ok: true, addressId });
  } catch (error) {
    console.error("Addresses set-default API error:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "auth/id-token-expired"
    ) {
      return Response.json({ error: "Token expired" }, { status: 401 });
    }
    return Response.json(
      { error: "Failed to set default address" },
      { status: 500 },
    );
  }
}

