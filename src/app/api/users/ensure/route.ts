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
  return {
    uid: decoded.uid,
    email: decoded.email ?? "",
    phoneNumber: decoded.phone_number ?? undefined,
  };
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return Response.json(
        { error: "Missing or invalid authorization" },
        { status: 401 },
      );
    }

    const ref = db.collection(COLLECTIONS.USERS).doc(user.uid);
    const doc = await ref.get();
    const existing = doc.data() ?? {};

    const updateData: Record<string, unknown> = {};

    if (!doc.exists) {
      updateData.uid = user.uid;
      updateData.email = user.email;
      updateData.displayName = user.email
        ? user.email.split("@")[0] ?? ""
        : "";
      updateData.createdAt = FieldValue.serverTimestamp();
    }

    if (!existing.email && user.email) {
      updateData.email = user.email;
    }
    if (!existing.phoneNumber && user.phoneNumber) {
      updateData.phoneNumber = user.phoneNumber;
    }

    if (Object.keys(updateData).length > 0) {
      await ref.set(updateData, { merge: true });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Users ensure API error:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "auth/id-token-expired"
    ) {
      return Response.json({ error: "Token expired" }, { status: 401 });
    }
    return Response.json(
      { error: "Failed to ensure user record" },
      { status: 500 },
    );
  }
}

