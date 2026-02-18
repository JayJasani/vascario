"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/context/UserProfileContext";
import type { UserAddress } from "@/app/api/users/route";

const inputClass =
  "w-full px-5 py-3.5 bg-[var(--vsc-cream)] border border-[var(--vsc-gray-300)] text-[var(--vsc-gray-900)] text-sm tracking-[0.1em] placeholder:text-[var(--vsc-gray-400)] focus:outline-none focus:border-[var(--vsc-gray-900)]";
const labelClass = "text-[10px] uppercase tracking-[0.25em] text-[var(--vsc-gray-600)]";

function newAddress(): UserAddress {
  return {
    id: crypto.randomUUID(),
    label: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  };
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, refreshProfile } = useUserProfile();
  const router = useRouter();
  const [savePending, setSavePending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [newAddressForm, setNewAddressForm] = useState<UserAddress | null>(null);

  // Initialize form fields from profile context
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName ?? "");
      setLastName(profile.lastName ?? "");
      setDisplayName(profile.displayName ?? "");
      setAddresses(Array.isArray(profile.addresses) ? profile.addresses : []);
    }
  }, [profile]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/profile");
      return;
    }
  }, [authLoading, user, router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSuccess(false);
    setSavePending(true);
    try {
      // Sync token to cookie
      const token = await user.getIdToken();
      await fetch("/api/auth/set-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      // Use server action instead of API route
      const { updateUserProfile } = await import("@/app/user-actions");
      const result = await updateUserProfile({
        firstName,
        lastName,
        displayName,
      });

      if (!result.success) {
        throw new Error(result.error ?? "Failed to save");
      }

      const effectiveDisplayName =
        displayName.trim() ||
        [firstName, lastName].filter(Boolean).join(" ").trim();
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("vascario:profile-updated", {
            detail: {
              displayName: effectiveDisplayName,
              firstName,
              lastName,
            },
          })
        );
      }
      // Refresh profile from context
      await refreshProfile();
      setSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save profile.");
    } finally {
      setSavePending(false);
    }
  };

  const addAddress = () => {
    setNewAddressForm(newAddress());
  };

  const saveNewAddress = async () => {
    if (!user || !newAddressForm || !newAddressForm.line1.trim() || !newAddressForm.city.trim() || !newAddressForm.postalCode.trim() || !newAddressForm.country.trim()) return;
    setError(null);
    setSuccess(false);
    setSavePending(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/users/addresses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAddressForm),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Failed to save address");
      }
      const savedAddress = await res.json();
      setAddresses((prev) => [...prev, savedAddress]);
      setNewAddressForm(null);
      // Refresh profile to sync addresses
      await refreshProfile();
      setSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save address.");
    } finally {
      setSavePending(false);
    }
  };

  const removeAddress = async (id: string) => {
    if (!user) return;
    setError(null);
    setSuccess(false);
    setSavePending(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/users/addresses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Failed to delete address");
      }
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      if (editingAddressId === id) setEditingAddressId(null);
      // Refresh profile to sync addresses
      await refreshProfile();
      setSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete address.");
    } finally {
      setSavePending(false);
    }
  };

  const updateAddress = (id: string, updates: Partial<UserAddress>) => {
    setAddresses((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const saveAddressUpdate = async (id: string) => {
    if (!user) return;
    const address = addresses.find((a) => a.id === id);
    if (!address || !address.line1.trim() || !address.city.trim() || !address.postalCode.trim() || !address.country.trim()) {
      setError("Please fill in all required fields");
      return;
    }
    setError(null);
    setSuccess(false);
    setSavePending(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/users/addresses/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Failed to update address");
      }
      setEditingAddressId(null);
      // Refresh profile to sync addresses
      await refreshProfile();
      setSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update address.");
    } finally {
      setSavePending(false);
    }
  };

  if (authLoading || (user && profileLoading)) {
    return (
      <main className="min-h-screen bg-[var(--vsc-cream)] text-[var(--vsc-gray-900)]">
        <Navbar />
        <section className="pt-32 pb-24 px-6 md:px-12 lg:px-20">
          <div className="max-w-2xl mx-auto flex items-center justify-center py-20">
            <p className="text-sm text-[var(--vsc-gray-500)]" style={{ fontFamily: "var(--font-space-mono)" }}>Loading profile...</p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--vsc-cream)] text-[var(--vsc-gray-900)]">
      <Navbar />

      <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl mx-auto space-y-8 sm:space-y-12">
          <header>
            <p
              className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] mb-2"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Account
            </p>
            <h1
              className="text-3xl md:text-4xl text-[var(--vsc-gray-900)] leading-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Profile
            </h1>
            <p
              className="text-xs text-[var(--vsc-gray-500)] uppercase tracking-[0.2em] mt-2"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Edit your details and delivery addresses.
            </p>
          </header>

          {error && (
            <p className="text-[10px] text-red-500 uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-space-mono)" }}>
              {error}
            </p>
          )}
          {success && (
            <p className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-space-mono)" }}>
              Saved.
            </p>
          )}

          {/* Profile form */}
          <div className="border-2 border-[var(--vsc-gray-200)] bg-[var(--vsc-white)] px-4 sm:px-6 py-5 sm:py-7 md:px-8 md:py-8 shadow-sm">
            <h2
              className="text-xs uppercase tracking-[0.2em] text-[var(--vsc-gray-700)] mb-4 sm:mb-6"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Personal details
            </h2>
            <form onSubmit={handleSaveProfile} className="space-y-4 sm:space-y-5" style={{ fontFamily: "var(--font-space-mono)" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-2">
                  <label className={labelClass}>First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputClass}
                    placeholder="First name"
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputClass}
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Display name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={inputClass}
                  placeholder="How you want to be shown"
                />
              </div>
              <button
                type="submit"
                disabled={savePending}
                className="w-full sm:w-auto px-6 py-3 sm:py-3.5 bg-[var(--vsc-gray-900)] text-[var(--vsc-cream)] text-xs font-bold uppercase tracking-[0.2em] hover:bg-[var(--vsc-gray-800)] border-2 border-[var(--vsc-gray-900)] transition-all duration-200 disabled:opacity-60"
              >
                {savePending ? "Saving..." : "Save profile"}
              </button>
            </form>
          </div>

          {/* Addresses */}
          <div className="border-2 border-[var(--vsc-gray-200)] bg-[var(--vsc-white)] px-4 sm:px-6 py-5 sm:py-7 md:px-8 md:py-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2
                className="text-xs uppercase tracking-[0.2em] text-[var(--vsc-gray-700)]"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Addresses
              </h2>
              {!newAddressForm && (
                <button
                  type="button"
                  onClick={addAddress}
                  className="text-[10px] uppercase tracking-[0.2em] text-[var(--vsc-accent)] hover:text-[var(--vsc-gray-900)]"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  + Add address
                </button>
              )}
            </div>

            {newAddressForm && (
              <div className="mb-6 sm:mb-8 p-4 sm:p-5 border border-[var(--vsc-gray-200)] bg-[var(--vsc-cream)]/50 space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <label className={labelClass}>Label (optional)</label>
                  <input
                    type="text"
                    value={newAddressForm.label ?? ""}
                    onChange={(e) => setNewAddressForm((a) => (a ? { ...a, label: e.target.value } : null))}
                    className={inputClass}
                    placeholder="Home, Office..."
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Address line 1 *</label>
                  <input
                    type="text"
                    value={newAddressForm.line1}
                    onChange={(e) => setNewAddressForm((a) => (a ? { ...a, line1: e.target.value } : null))}
                    className={inputClass}
                    placeholder="Street address"
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Address line 2 (optional)</label>
                  <input
                    type="text"
                    value={newAddressForm.line2 ?? ""}
                    onChange={(e) => setNewAddressForm((a) => (a ? { ...a, line2: e.target.value } : null))}
                    className={inputClass}
                    placeholder="Apt, suite..."
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>City *</label>
                    <input
                      type="text"
                      value={newAddressForm.city}
                      onChange={(e) => setNewAddressForm((a) => (a ? { ...a, city: e.target.value } : null))}
                      className={inputClass}
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>State / Region</label>
                    <input
                      type="text"
                      value={newAddressForm.state ?? ""}
                      onChange={(e) => setNewAddressForm((a) => (a ? { ...a, state: e.target.value } : null))}
                      className={inputClass}
                      placeholder="State"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>Postal code *</label>
                    <input
                      type="text"
                      value={newAddressForm.postalCode}
                      onChange={(e) => setNewAddressForm((a) => (a ? { ...a, postalCode: e.target.value } : null))}
                      className={inputClass}
                      placeholder="Postal code"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Country *</label>
                    <input
                      type="text"
                      value={newAddressForm.country}
                      onChange={(e) => setNewAddressForm((a) => (a ? { ...a, country: e.target.value } : null))}
                      className={inputClass}
                      placeholder="Country"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={saveNewAddress}
                    disabled={savePending}
                    className="w-full sm:w-auto px-4 py-2 bg-[var(--vsc-gray-900)] text-[var(--vsc-cream)] text-xs font-bold uppercase tracking-[0.2em] disabled:opacity-60"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  >
                    {savePending ? "Saving..." : "Save address"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAddressForm(null)}
                    className="w-full sm:w-auto px-4 py-2 border border-[var(--vsc-gray-300)] text-[var(--vsc-gray-600)] text-xs uppercase tracking-[0.2em]"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <ul className="space-y-3 sm:space-y-4">
              {addresses.map((addr) => (
                <li
                  key={addr.id}
                  className="border border-[var(--vsc-gray-200)] p-3 sm:p-4 flex flex-col gap-2 sm:gap-3"
                >
                  {editingAddressId === addr.id ? (
                    <>
                      <input
                        type="text"
                        value={addr.label ?? ""}
                        onChange={(e) => updateAddress(addr.id, { label: e.target.value })}
                        className={inputClass}
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        value={addr.line1}
                        onChange={(e) => updateAddress(addr.id, { line1: e.target.value })}
                        className={inputClass}
                        placeholder="Address line 1"
                      />
                      <input
                        type="text"
                        value={addr.line2 ?? ""}
                        onChange={(e) => updateAddress(addr.id, { line2: e.target.value })}
                        className={inputClass}
                        placeholder="Address line 2"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={addr.city}
                          onChange={(e) => updateAddress(addr.id, { city: e.target.value })}
                          className={inputClass}
                          placeholder="City"
                        />
                        <input
                          type="text"
                          value={addr.state ?? ""}
                          onChange={(e) => updateAddress(addr.id, { state: e.target.value })}
                          className={inputClass}
                          placeholder="State"
                        />
                        <input
                          type="text"
                          value={addr.postalCode}
                          onChange={(e) => updateAddress(addr.id, { postalCode: e.target.value })}
                          className={inputClass}
                          placeholder="Postal code"
                        />
                        <input
                          type="text"
                          value={addr.country}
                          onChange={(e) => updateAddress(addr.id, { country: e.target.value })}
                          className={inputClass}
                          placeholder="Country"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => saveAddressUpdate(addr.id)}
                          disabled={savePending}
                          className="text-[10px] uppercase tracking-[0.2em] text-[var(--vsc-gray-500)] disabled:opacity-60"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          {savePending ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingAddressId(null)}
                          disabled={savePending}
                          className="text-[10px] uppercase tracking-[0.2em] text-[var(--vsc-gray-500)] disabled:opacity-60"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => removeAddress(addr.id)}
                          disabled={savePending}
                          className="text-[10px] uppercase tracking-[0.2em] text-red-500 disabled:opacity-60"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-medium text-[var(--vsc-gray-900)]" style={{ fontFamily: "var(--font-space-mono)" }}>
                          {addr.label || "Address"}
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingAddressId(addr.id)}
                            className="text-[10px] uppercase tracking-[0.2em] text-[var(--vsc-accent)]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removeAddress(addr.id)}
                            className="text-[10px] uppercase tracking-[0.2em] text-[var(--vsc-gray-400)] hover:text-red-500"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <p className="text-[10px] text-[var(--vsc-gray-500)] uppercase tracking-[0.1em] leading-relaxed" style={{ fontFamily: "var(--font-space-mono)" }}>
                        {addr.line1}
                        {addr.line2 ? `, ${addr.line2}` : ""}
                        <br />
                        {addr.city}
                        {addr.state ? `, ${addr.state}` : ""} {addr.postalCode}
                        <br />
                        {addr.country}
                      </p>
                    </>
                  )}
                </li>
              ))}
            </ul>


            {addresses.length === 0 && !newAddressForm && (
              <p className="text-[10px] text-[var(--vsc-gray-500)] uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-space-mono)" }}>
                No addresses yet. Add one above.
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
