"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  addresses?: Array<{
    id: string;
    label?: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  }>;
}

interface UserProfileContextValue {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  getDisplayName: () => string;
}

const UserProfileContext = createContext<UserProfileContextValue | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchProfile = useCallback(async (signal?: AbortSignal) => {
    if (!user || fetchingRef.current) return;
    
    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });

      if (signal?.aborted) return;

      if (!res.ok) {
        if (res.status === 401) {
          // User not authenticated, clear profile
          setProfile(null);
          setLoading(false);
          fetchingRef.current = false;
          return;
        }
        throw new Error("Failed to load profile");
      }

      const data = await res.json();
      setProfile({
        uid: data.uid || user.uid,
        email: data.email || user.email || "",
        displayName: data.displayName || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        addresses: Array.isArray(data.addresses) ? data.addresses : [],
      });
      setError(null);
    } catch (err) {
      if (signal?.aborted) return;
      console.error("Failed to fetch user profile:", err);
      setError(err instanceof Error ? err.message : "Failed to load profile");
      // Don't clear profile on error, keep existing data
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [user]);

  const refreshProfile = useCallback(async () => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    await fetchProfile(abortController.signal);
  }, [fetchProfile]);

  // Fetch profile when user changes
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      fetchingRef.current = false;
      return;
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    fetchProfile(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [user, fetchProfile]);

  // Listen for profile update events
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleProfileUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{
        displayName?: string;
        firstName?: string;
        lastName?: string;
      }>).detail;

      // Update local state optimistically
      if (profile) {
        const effectiveDisplayName =
          detail.displayName?.trim() ||
          [detail.firstName, detail.lastName].filter(Boolean).join(" ").trim();

        setProfile({
          ...profile,
          displayName: effectiveDisplayName || profile.displayName,
          firstName: detail.firstName !== undefined ? detail.firstName : profile.firstName,
          lastName: detail.lastName !== undefined ? detail.lastName : profile.lastName,
        });
      }

      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Refresh from server after a short delay to ensure consistency
      timeoutId = setTimeout(() => {
        refreshProfile();
      }, 500);
    };

    window.addEventListener(
      "vascario:profile-updated",
      handleProfileUpdated as EventListener
    );

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener(
        "vascario:profile-updated",
        handleProfileUpdated as EventListener
      );
    };
  }, [profile, refreshProfile]);

  const getDisplayName = useCallback(() => {
    if (!profile && !user) return "";
    
    if (profile?.displayName) return profile.displayName;
    if (profile?.firstName || profile?.lastName) {
      return [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim();
    }
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split("@")[0] || "";
    return "";
  }, [profile, user]);

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        refreshProfile,
        getDisplayName,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return ctx;
}
