"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { EyeIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const { user, loading, login, register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTo);
    }
  }, [loading, user, router, redirectTo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, { firstName, lastName });
      }
      router.replace(redirectTo);
    } catch (err: any) {
      console.error("Auth error", err);
      setError(err?.message ?? "Authentication failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--vsc-cream)] text-[var(--vsc-gray-900)]">
      <Navbar />

      <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-16 items-start">
          {/* Left — copy */}
          <div className="space-y-3 sm:space-y-4">
            <p
              className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Account
            </p>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl text-[var(--vsc-gray-900)] leading-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {mode === "login" ? "Sign in to continue" : "Create your account"}
            </h1>
            <p
              className="text-xs sm:text-sm text-[var(--vsc-gray-500)] uppercase tracking-[0.2em] max-w-sm"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Log in to sync your bag, favourites, and checkout across devices.
            </p>
          </div>

          {/* Right — form card */}
          <div className="border-2 border-[var(--vsc-gray-200)] bg-[var(--vsc-white)] px-4 sm:px-6 py-5 sm:py-7 md:px-8 md:py-8 shadow-sm">
            <form
              onSubmit={handleSubmit}
              className="space-y-5 sm:space-y-6"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {mode === "register" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.25em] text-[var(--vsc-gray-600)]">
                        First name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-5 py-3.5 bg-[var(--vsc-cream)] border border-[var(--vsc-gray-300)] text-[var(--vsc-gray-900)] text-sm tracking-[0.1em] placeholder:text-[var(--vsc-gray-400)] focus:outline-none focus:border-[var(--vsc-gray-900)]"
                        placeholder="First name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.25em] text-[var(--vsc-gray-600)]">
                        Last name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-5 py-3.5 bg-[var(--vsc-cream)] border border-[var(--vsc-gray-300)] text-[var(--vsc-gray-900)] text-sm tracking-[0.1em] placeholder:text-[var(--vsc-gray-400)] focus:outline-none focus:border-[var(--vsc-gray-900)]"
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.25em] text-[var(--vsc-gray-600)]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 bg-[var(--vsc-cream)] border border-[var(--vsc-gray-300)] text-[var(--vsc-gray-900)] text-sm tracking-[0.1em] placeholder:text-[var(--vsc-gray-400)] focus:outline-none focus:border-[var(--vsc-gray-900)]"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.25em] text-[var(--vsc-gray-600)]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-14 px-5 py-3.5 bg-[var(--vsc-cream)] border border-[var(--vsc-gray-300)] text-[var(--vsc-gray-900)] text-sm tracking-[0.1em] placeholder:text-[var(--vsc-gray-400)] focus:outline-none focus:border-[var(--vsc-gray-900)]"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] focus:outline-none focus:text-[var(--vsc-gray-900)]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <HugeiconsIcon
                      icon={showPassword ? ViewOffIcon : EyeIcon}
                      size={24}
                    />
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-[10px] text-red-500 uppercase tracking-[0.2em]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="w-full px-6 py-3 sm:py-3.5 bg-[var(--vsc-gray-900)] text-[var(--vsc-cream)] text-xs font-bold uppercase tracking-[0.2em] hover:bg-[var(--vsc-gray-800)] border-2 border-[var(--vsc-gray-900)] transition-all duration-200 disabled:opacity-60"
              >
                {pending
                  ? mode === "login"
                    ? "Signing in..."
                    : "Creating account..."
                  : mode === "login"
                    ? "Sign in"
                    : "Create account"}
              </button>

              <button
                type="button"
                className="w-full text-[10px] text-[var(--vsc-gray-500)] uppercase tracking-[0.2em] hover:text-[var(--vsc-accent)]"
                onClick={() =>
                  setMode((m) => (m === "login" ? "register" : "login"))
                }
              >
                {mode === "login"
                  ? "New here? Create an account"
                  : "Already have an account? Sign in"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function LoginPageClient() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[var(--vsc-cream)] text-[var(--vsc-gray-900)]">
        <Navbar />
        <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="max-w-4xl mx-auto flex items-center justify-center">
            <p className="text-sm text-[var(--vsc-gray-500)]">Loading...</p>
          </div>
        </section>
        <Footer />
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}

