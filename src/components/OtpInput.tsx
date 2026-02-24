"use client";

import { useRef } from "react";

type OtpInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

export function OtpInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  className = "",
}: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const safeChars = value.slice(0, length).split("");

  return (
    <div className={`flex gap-2 sm:gap-3 ${className}`}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={safeChars[index] ?? ""}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(-1);
            const chars = safeChars.slice();
            chars[index] = val;
            const next = chars.join("").slice(0, length);
            onChange(next);

            if (val && index < length - 1) {
              inputsRef.current[index + 1]?.focus();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !safeChars[index] && index > 0) {
              inputsRef.current[index - 1]?.focus();
            }
          }}
          className="w-10 sm:w-11 md:w-12 px-0 py-3.5 bg-[var(--vsc-cream)] border border-[var(--vsc-gray-300)] text-[var(--vsc-gray-900)] text-sm tracking-[0.3em] text-center focus:outline-none focus:border-[var(--vsc-gray-900)]"
          disabled={disabled}
          required={index === 0}
        />
      ))}
    </div>
  );
}

