"use client";

import {
  Suspense,
  useEffect,
  useState,
  useRef,
  type FormEvent,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  signInWithCustomToken,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type ConfirmationResult,
} from "firebase/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { trackLogin } from "@/lib/analytics";
import { auth } from "@/lib/firebase-client";
import { OtpInput } from "@/components/OtpInput";

type CountryOption = {
  iso2: string;
  name: string;
  dial: string;
  flag: string;
};

const OTP_LENGTH = 6;

const COUNTRY_OPTIONS: CountryOption[] = [
  { iso2: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
  { iso2: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
  { iso2: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
  { iso2: "AU", name: "Australia", dial: "+61", flag: "🇦🇺" },
  { iso2: "AE", name: "United Arab Emirates", dial: "+971", flag: "🇦🇪" },
];

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
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const redirectTo = normalizeRedirect(searchParams.get("redirect"));
  const googleCustomToken = searchParams.get("googleCustomToken");

  const [countryIso2, setCountryIso2] = useState<CountryOption["iso2"]>("IN");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"enterPhone" | "enterOtp">("enterPhone");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const selectedCountry =
    COUNTRY_OPTIONS.find((c) => c.iso2 === countryIso2) ?? COUNTRY_OPTIONS[0]!;

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

        try {
          const firebaseUser = auth.currentUser;
          if (firebaseUser) {
            const idToken = await firebaseUser.getIdToken();
            await fetch("/api/users/ensure", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            });
          }
        } catch (ensureErr) {
          console.error(
            "Failed to ensure user record after Google login:",
            ensureErr,
          );
        }

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

  async function ensureRecaptcha() {
    if (typeof window === "undefined") return;
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        },
      );
    }
  }

  async function handleSendOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      if (!phoneNumber.trim()) {
        throw new Error("Please enter your phone number.");
      }
      const fullPhone = `${selectedCountry.dial}${phoneNumber
        .trim()
        .replace(/\s+/g, "")}`;
      await ensureRecaptcha();
      if (!recaptchaVerifierRef.current) {
        throw new Error("Failed to initialize verification. Please try again.");
      }
      const confirmation = await signInWithPhoneNumber(
        auth,
        fullPhone,
        recaptchaVerifierRef.current,
      );
      setConfirmationResult(confirmation);
      setStep("enterOtp");
    } catch (err: any) {
      console.error("Send OTP error", err);
      setError(
        err?.message ??
          "Failed to send verification code. Please check the phone number.",
      );
    } finally {
      setPending(false);
    }
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    if (!confirmationResult) {
      setError("Please request a verification code first.");
      return;
    }
    if (otp.trim().length !== OTP_LENGTH) {
      setError(`Please enter the full ${OTP_LENGTH}-digit code.`);
      return;
    }
    setError(null);
    setPending(true);
    try {
      const result = await confirmationResult.confirm(otp.trim());
      trackLogin({ method: "phone" });

      // If this is a phone-only account without email/display name,
      // send the user to profile so they can complete their details.
      const firebaseUser = result.user ?? auth.currentUser;
      const shouldCompleteProfile =
        !!firebaseUser &&
        (!firebaseUser.email || !firebaseUser.displayName);

      const target = shouldCompleteProfile ? "/profile" : redirectTo;
      window.location.replace(target);
    } catch (err: any) {
      console.error("Verify OTP error", err);
      setError(
        err?.message ?? "Invalid verification code. Please try again.",
      );
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
              Sign in to continue
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
              onSubmit={step === "enterPhone" ? handleSendOtp : handleVerifyOtp}
              className="space-y-5 sm:space-y-6"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.25em] text-[var(--vsc-gray-600)]">
                  Phone number
                </label>
                <div className="flex gap-3">
                  <select
                    value={countryIso2}
                    onChange={(e) => setCountryIso2(e.target.value)}
                    className="px-3 py-3.5 bg-[var(--vsc-cream)] border border-[var(--vsc-gray-300)] text-[var(--vsc-gray-900)] text-xs tracking-[0.12em] focus:outline-none focus:border-[var(--vsc-gray-900)]"
                    disabled={pending || step === "enterOtp"}
                  >
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c.iso2} value={c.iso2}>
                        {c.flag} {c.dial}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 px-5 py-3.5 bg-[var(--vsc-cream)] border border-[var(--vsc-gray-300)] text-[var(--vsc-gray-900)] text-sm tracking-[0.1em] placeholder:text-[var(--vsc-gray-400)] focus:outline-none focus:border-[var(--vsc-gray-900)]"
                    placeholder="98765 43210"
                    disabled={pending || step === "enterOtp"}
                    required
                  />
                </div>
              </div>

              {step === "enterOtp" && (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.25em] text-[var(--vsc-gray-600)]">
                    Verification code
                  </label>
                  <OtpInput
                    length={OTP_LENGTH}
                    value={otp}
                    onChange={setOtp}
                    disabled={pending}
                  />
                </div>
              )}

              <div id="recaptcha-container" />

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
                  ? step === "enterPhone"
                    ? "Sending code..."
                    : "Verifying..."
                  : step === "enterPhone"
                    ? "Send code"
                    : "Verify & sign in"}
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

