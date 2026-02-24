"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { EyeIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { signInWithCustomToken } from "firebase/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { trackLogin, trackSignUp } from "@/lib/analytics";
import { auth } from "@/lib/firebase-client";

/** Ensure redirect is a same-origin path so client nav works. Strips origin if full URL. */
function normalizeRedirect(redirect: string | null): string {
  if (!redirect || typeof redirect !== "string") return "/";
  const s = redirect.trim();
  if (!s) return "/";
  if (s.startsWith("/")) {
    try {
      const u = new URL(s, "http://localhost");
      return u.pathname + u.search + u.hash;
    } catch {
      return s;
    }
  }
  try {
    const u = new URL(s);
    if (typeof window !== "undefined" && u.origin !== window.location.origin) return "/";
    return u.pathname + u.search + u.hash;
  } catch {
    return "/";
  }
}

function LoginForm() {
  const { user, loading, login, register } = useAuth();
  const searchParams = useSearchParams();
  const redirectTo = normalizeRedirect(searchParams.get("redirect"));
  const googleCustomToken = searchParams.get("googleCustomToken");

  const [mode, setMode] = useState<"login" | "register">("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // Redirect if already logged in (e.g. landed on /login while authenticated)
  useEffect(() => {
    if (!loading && user) {
      window.location.replace(redirectTo);
    }
  }, [loading, user, redirectTo]);

  // Handle Firebase custom token coming from Google OAuth callback
  useEffect(() => {
    if (!googleCustomToken || loading || user) return;

    const token = googleCustomToken;
    let cancelled = false;

    async function runGoogleLogin(customToken: string) {
      setError(null);
      setPending(true);
      try {
        await signInWithCustomToken(auth, customToken);
        trackLogin({ method: "google" });
        window.location.replace(redirectTo);
      } catch (err: any) {
        if (cancelled) return;
        console.error("Google auth error", err);
        setError(
          err?.message ?? "Google sign-in failed. Please try again.",
        );
      } finally {
        if (!cancelled) {
          setPending(false);
        }
      }
    }

    void runGoogleLogin(token);

    return () => {
      cancelled = true;
    };
  }, [googleCustomToken, loading, user, redirectTo]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      if (mode === "login") {
        await login(email, password);
        trackLogin({ method: "email" });
      } else {
        await register(email, password, { firstName, lastName });
        trackSignUp({ method: "email" });
      }
      // Full-page navigation so redirect always runs and avoids dev "rendering into next view"
      window.location.replace(redirectTo);
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
                disabled={pending}
                onClick={() => {
                  const url = `/api/auth/google?redirect=${encodeURIComponent(
                    redirectTo,
                  )}`;
                  window.location.href = url;
                }}
                className="w-full px-6 py-3 sm:py-3.5 bg-[var(--vsc-white)] text-[var(--vsc-gray-900)] text-xs font-bold uppercase tracking-[0.2em] border-2 border-[var(--vsc-gray-900)] hover:bg-[var(--vsc-gray-900)] hover:text-[var(--vsc-cream)] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-3"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="h-4 w-4"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.13 13.02 17.56 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.14-3.08-.39-4.55H24v9.11h12.94c-.56 2.93-2.2 5.41-4.69 7.08l7.62 5.9C44.74 38.82 46.98 32.21 46.98 24.55z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.54 28.59A14.5 14.5 0 0 1 9.9 24c0-1.58.27-3.11.64-4.59l-7.98-6.19C.93 16.09 0 19.41 0 23c0 3.56.93 6.88 2.56 9.78l7.98-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 47c6.48 0 11.93-2.13 15.9-5.8l-7.62-5.9C30.4 36.98 27.5 38 24 38c-6.44 0-11.87-3.52-14.46-8.91l-7.98 6.19C6.51 42.62 14.62 47 24 47z"
                    />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                </span>
                <span>Continue with Google</span>
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

