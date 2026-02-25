import { NextRequest } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
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
  try {
    const decoded = await getAuth().verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email ?? "" };
  } catch {
    return null;
  }
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(request: NextRequest) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return Response.json({ error: "Missing or invalid authorization" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file || !(file instanceof File)) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json(
        { error: "Invalid file type. Use JPEG, PNG, WebP or GIF." },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return Response.json(
        { error: "File too large. Max 2MB." },
        { status: 400 }
      );
    }

    const bucket = getStorage().bucket();
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `users/${user.uid}/profile.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileRef = bucket.file(fileName);

    await fileRef.save(buffer, { metadata: { contentType: file.type } });
    await fileRef.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    const ref = db.collection(COLLECTIONS.USERS).doc(user.uid);
    const doc = await ref.get();
    const updateData = { photoURL: publicUrl, updatedAt: FieldValue.serverTimestamp() };

    if (doc.exists) {
      await ref.update(updateData);
    } else {
      await ref.set(
        { uid: user.uid, email: user.email, ...updateData },
        { merge: true }
      );
    }

    return Response.json({ photoURL: publicUrl });
  } catch (error) {
    console.error("Profile photo upload error:", error);
    return Response.json(
      { error: "Failed to upload profile photo" },
      { status: 500 }
    );
  }
}
