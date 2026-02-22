"use server";

import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";
import { db, COLLECTIONS } from "@/lib/firebase";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import type { UserAddress } from "@/models/user";

// Helper to convert Firestore Timestamp to ISO string
function convertTimestamp(timestamp: Timestamp | Date | undefined | null): string | undefined {
  if (!timestamp) return undefined;
  if (timestamp instanceof Date) return timestamp.toISOString();
  if (timestamp instanceof Timestamp) return timestamp.toDate().toISOString();
  return undefined;
}

// Helper to convert Firestore document data to plain object
function convertAddressData(data: any): Omit<UserAddress, "id"> {
  const converted: any = { ...data };
  // Remove Firestore Timestamp fields or convert them
  if (converted.createdAt) {
    delete converted.createdAt;
  }
  if (converted.updatedAt) {
    delete converted.updatedAt;
  }
  return converted as Omit<UserAddress, "id">;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  photoURL?: string;
  addresses: UserAddress[];
}

async function getUserIdToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase-token")?.value;
  return token || null;
}

async function verifyUserToken(): Promise<{ uid: string; email: string } | null> {
  const token = await getUserIdToken();
  if (!token) return null;
  
  try {
    const adminAuth = getAuth();
    const decoded = await adminAuth.verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email ?? "" };
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const user = await verifyUserToken();
    if (!user) return null;

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
      ...convertAddressData(doc.data()),
    }));
    
    if (!data) {
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.email.split("@")[0] ?? "",
        firstName: "",
        lastName: "",
        photoURL: undefined,
        addresses,
      };
    }
    
    // Convert user data to plain object, removing any Firestore Timestamps
    const userData: any = { ...data };
    if (userData.createdAt) delete userData.createdAt;
    if (userData.updatedAt) delete userData.updatedAt;
    
    return {
      uid: userData.uid || user.uid,
      email: userData.email ?? user.email,
      displayName: userData.displayName ?? "",
      firstName: userData.firstName ?? "",
      lastName: userData.lastName ?? "",
      photoURL: userData.photoURL ?? undefined,
      addresses,
    };
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
}

export async function createUserProfile(updates: {
  firstName?: string;
  lastName?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await verifyUserToken();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const emailStr = user.email;
    const displayName = emailStr.split("@")[0] ?? "";

    await db.collection(COLLECTIONS.USERS).doc(user.uid).set(
      {
        uid: user.uid,
        email: emailStr,
        displayName,
        firstName: updates.firstName?.trim() ?? "",
        lastName: updates.lastName?.trim() ?? "",
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return { success: true };
  } catch (error) {
    console.error("Failed to create user profile:", error);
    return { success: false, error: "Failed to create profile" };
  }
}

export async function updateUserProfile(updates: {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await verifyUserToken();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const ref = db.collection(COLLECTIONS.USERS).doc(user.uid);
    const updateData: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };

    if (updates.firstName !== undefined) updateData.firstName = updates.firstName.trim();
    if (updates.lastName !== undefined) updateData.lastName = updates.lastName.trim();
    if (updates.displayName !== undefined) updateData.displayName = updates.displayName.trim();
    if (updates.photoURL !== undefined) updateData.photoURL = updates.photoURL;

    const doc = await ref.get();
    if (doc.exists) {
      await ref.update(updateData);
    } else {
      await ref.set(
        { uid: user.uid, email: user.email, ...updateData },
        { merge: true }
      );
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
