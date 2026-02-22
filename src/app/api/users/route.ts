import { NextRequest } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { db, COLLECTIONS } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";
import type { UserAddress } from "@/models/user";

export type { UserAddress } from "@/models/user";

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

// parseAddress function moved to addresses route

export async function GET(request: NextRequest) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return Response.json({ error: "Missing or invalid authorization" }, { status: 401 });
    }
    const doc = await db.collection(COLLECTIONS.USERS).doc(user.uid).get();
    const data = doc.data();
    
    // Fetch addresses from subcollection
    const addressesSnapshot = await db
      .collection(COLLECTIONS.USERS)
      .doc(user.uid)
      .collection("addresses")
      .get();
    const addresses: UserAddress[] = addressesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<UserAddress, "id">),
    }));
    
    if (!data) {
      return Response.json({
        uid: user.uid,
        email: user.email,
        displayName: user.email.split("@")[0] ?? "",
        firstName: "",
        lastName: "",
        addresses,
      });
    }
    return Response.json({
      uid: data.uid,
      email: data.email ?? user.email,
      displayName: data.displayName ?? "",
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      addresses,
    });
  } catch (error) {
    console.error("Users API GET error:", error);
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "auth/id-token-expired") {
      return Response.json({ error: "Token expired" }, { status: 401 });
    }
    return Response.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return Response.json({ error: "Missing or invalid authorization" }, { status: 401 });
    }
    const body = await request.json();
    const firstName = typeof body?.firstName === "string" ? body.firstName.trim() : "";
    const lastName = typeof body?.lastName === "string" ? body.lastName.trim() : "";
    const emailStr = user.email;
    const displayName = emailStr.split("@")[0] ?? "";

    await db.collection(COLLECTIONS.USERS).doc(user.uid).set(
      {
        uid: user.uid,
        email: emailStr,
        displayName,
        firstName,
        lastName,
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Users API error:", error);
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "auth/id-token-expired") {
      return Response.json({ error: "Token expired" }, { status: 401 });
    }
    return Response.json({ error: "Failed to save user" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return Response.json({ error: "Missing or invalid authorization" }, { status: 401 });
    }
    const body = await request.json();
    const ref = db.collection(COLLECTIONS.USERS).doc(user.uid);
    const updates: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };

    if (typeof body?.firstName === "string") updates.firstName = body.firstName.trim();
    if (typeof body?.lastName === "string") updates.lastName = body.lastName.trim();
    if (typeof body?.displayName === "string") updates.displayName = body.displayName.trim();

    // Addresses are now handled via /api/users/addresses endpoints
    // Remove any addresses field if accidentally sent
    if (body?.addresses !== undefined) {
      delete updates.addresses;
    }

    await ref.update(updates);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Users API PATCH error:", error);
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "auth/id-token-expired") {
      return Response.json({ error: "Token expired" }, { status: 401 });
    }
    return Response.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
