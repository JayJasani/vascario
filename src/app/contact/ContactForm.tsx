"use client";

import { useActionState } from "react";
import { submitContactAction } from "./contact-actions";

const inputClass =
  "w-full px-5 py-4 bg-[var(--vsc-cream)] border border-[var(--vsc-gray-300)] text-[var(--vsc-gray-900)] text-sm placeholder:text-[var(--vsc-gray-400)] focus:outline-none focus:border-[var(--vsc-gray-900)] transition-colors";
const labelClass =
  "block text-[10px] text-[var(--vsc-gray-500)] uppercase tracking-[0.2em] mb-2";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactAction,
    null
  );

  if (state?.success) {
    return (
      <div
        className="p-8 border border-[var(--vsc-gray-200)] bg-[var(--vsc-white)] text-center"
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
        <p className="text-[var(--vsc-gray-900)] font-medium mb-1">
          Thanks for reaching out.
        </p>
        <p className="text-sm text-[var(--vsc-gray-500)]">
          We&apos;ll get back to you within 24–48 hours.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            placeholder="First name"
            className={inputClass}
            style={{ fontFamily: "var(--font-space-mono)" }}
          />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            placeholder="Last name"
            className={inputClass}
            style={{ fontFamily: "var(--font-space-mono)" }}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className={inputClass}
          style={{ fontFamily: "var(--font-space-mono)" }}
        />
      </div>

      <div>
        <label htmlFor="query" className={labelClass}>
          Query
        </label>
        <textarea
          id="query"
          name="query"
          required
          rows={5}
          placeholder="How can we help?"
          className={`${inputClass} resize-y min-h-[120px]`}
          style={{ fontFamily: "var(--font-space-mono)" }}
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600" style={{ fontFamily: "var(--font-space-mono)" }}>
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] hover:opacity-90 transition-opacity duration-200 disabled:opacity-60"
        style={{
          fontFamily: "var(--font-space-mono)",
          backgroundColor: "black",
          color: "white",
        }}
      >
        {isPending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
