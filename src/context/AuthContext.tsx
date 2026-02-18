"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase-client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    options?: { firstName?: string; lastName?: string }
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      
      // Sync token to cookie for server-side access
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          await fetch("/api/auth/set-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
        } catch (error) {
          console.error("Failed to sync token:", error);
        }
      } else {
        // Clear token cookie when user logs out
        await fetch("/api/auth/clear-token", { method: "POST" });
      }
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Store token in cookie for server-side access
    const token = await userCredential.user.getIdToken();
    await fetch("/api/auth/set-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  };

  const register = async (
    email: string,
    password: string,
    options?: { firstName?: string; lastName?: string }
  ) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    
    // Store token in cookie
    await fetch("/api/auth/set-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    
    // Create user profile via server action
    const { createUserProfile } = await import("@/app/user-actions");
    const result = await createUserProfile({
      firstName: options?.firstName ?? "",
      lastName: options?.lastName ?? "",
    });
    
    if (!result.success) {
      throw new Error(result.error ?? "Failed to save profile");
    }
  };

  const logout = async () => {
    await signOut(auth);
    // Clear token cookie
    await fetch("/api/auth/clear-token", { method: "POST" });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

