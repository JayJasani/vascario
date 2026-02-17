"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  subscribeToNewsletter,
  type NewsletterFormState,
} from "@/app/newsletter-actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="px-6 py-4 bg-[var(--vsc-gray-900)] text-[var(--vsc-cream)] text-sm font-bold uppercase tracking-[0.15em] hover:bg-[var(--vsc-gray-800)] transition-colors duration-200 disabled:opacity-60"
      style={{ fontFamily: "var(--font-space-mono)" }}
      disabled={pending}
    >
      {pending ? "…" : "→"}
    </button>
  );
}

export function NewsletterForm() {
  const [state, formAction] = useActionState<
    NewsletterFormState,
    FormData
  >(async (_prev, formData) => subscribeToNewsletter(formData), null);

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <div className="space-y-2">
      <form className="flex" action={formAction}>
        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          className="flex-1 px-5 py-4 bg-[var(--vsc-cream)] border border-[var(--vsc-gray-300)] text-[var(--vsc-gray-900)] text-xs tracking-[0.15em] placeholder:text-[var(--vsc-gray-400)] focus:outline-none focus:border-[var(--vsc-gray-900)]"
          style={{ fontFamily: "var(--font-space-mono)" }}
          required
        />
        <SubmitButton />
      </form>

      {/* Status line */}
      <div className="min-h-[1.25rem]">
        {showSuccess && (
          <span
            className="inline-flex items-center gap-2 text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            <span className="inline-flex h-3 w-3 items-center justify-center rounded-full border border-[var(--vsc-accent)] bg-[var(--vsc-cream)]">
              <span className="text-[8px] leading-none">✓</span>
            </span>
            Subscribed
          </span>
        )}
        {state?.error && (
          <span
            className="text-[10px] text-red-500 uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {state.error}
          </span>
        )}
      </div>
    </div>
  );
}

