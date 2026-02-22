import { NextRequest } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { db, COLLECTIONS } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";
import type { UserAddress } from "@/models/user";

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

function parseAddress(raw: unknown): Omit<UserAddress, "id"> | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const line1 = typeof o.line1 === "string" ? o.line1.trim() : "";
  const city = typeof o.city === "string" ? o.city.trim() : "";
  const postalCode = typeof o.postalCode === "string" ? o.postalCode.trim() : "";
  const country = typeof o.country === "string" ? o.country.trim() : "";
  if (!line1 || !city || !postalCode || !country) return null;
  return {
    label: typeof o.label === "string" ? o.label.trim() || undefined : undefined,
    line1,
    line2: typeof o.line2 === "string" ? o.line2.trim() || undefined : undefined,
    city,
    state: typeof o.state === "string" ? o.state.trim() || undefined : undefined,
    postalCode,
    country,
  };
}

// PATCH - Update an existing address
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ addressId: string }> }
) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return Response.json({ error: "Missing or invalid authorization" }, { status: 401 });
    }
    const { addressId } = await params;
    const body = await request.json();
    const addressData = parseAddress(body);
    if (!addressData) {
      return Response.json({ error: "Invalid address data" }, { status: 400 });
    }
    const addressRef = db
      .collection(COLLECTIONS.USERS)
      .doc(user.uid)
      .collection("addresses")
      .doc(addressId);
    // Verify the address belongs to the user
    const doc = await addressRef.get();
    if (!doc.exists) {
      return Response.json({ error: "Address not found" }, { status: 404 });
    }
    await addressRef.update({
      ...addressData,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return Response.json({
      id: addressId,
      ...addressData,
    });
  } catch (error) {
    console.error("Addresses API PATCH error:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "auth/id-token-expired"
    ) {
      return Response.json({ error: "Token expired" }, { status: 401 });
    }
    return Response.json({ error: "Failed to update address" }, { status: 500 });
  }
}

// DELETE - Delete an address
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ addressId: string }> }
) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return Response.json({ error: "Missing or invalid authorization" }, { status: 401 });
    }
    const { addressId } = await params;
    const addressRef = db
      .collection(COLLECTIONS.USERS)
      .doc(user.uid)
      .collection("addresses")
      .doc(addressId);
    // Verify the address belongs to the user
    const doc = await addressRef.get();
    if (!doc.exists) {
      return Response.json({ error: "Address not found" }, { status: 404 });
    }
    await addressRef.delete();
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Addresses API DELETE error:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "auth/id-token-expired"
    ) {
      return Response.json({ error: "Token expired" }, { status: 401 });
    }
    return Response.json({ error: "Failed to delete address" }, { status: 500 });
  }
}
