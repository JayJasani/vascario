import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--vsc-gray-200)] bg-[var(--vsc-white)]">
      {/* Giant brand name */}
      {/* <div className="px-6 md:px-12 lg:px-20 pt-20 md:pt-32 pb-12">
        <h2
          className="text-[var(--vsc-gray-100)] leading-[0.85] select-none"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: "clamp(4rem, 12vw, 14rem)",
            letterSpacing: "-0.04em",
            fontWeight: 700,
          }}
        >
          VASC
          <span className="relative inline-flex items-baseline mx-[0.02em]">
            <Image
              src="/logo/Alogo.png"
              alt="VASCARIO A logo"
              width={200}
              height={200}
              className="block h-[0.75em] w-auto translate-y-[0.03em]"
              priority
            />
          </span>
          RIO
        </h2>
      </div> */}

      {/* Accent divider */}
      <div className="h-px bg-[var(--vsc-gray-200)] mx-6 md:mx-12 lg:mx-20" />

      {/* Footer content grid */}
      <div className="px-6 md:px-12 lg:px-20 py-16 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
        {/* Column 1 — Info */}
        <div>
          <span
            className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] block mb-4"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Info
          </span>
          <ul className="space-y-2">
            {["About", "Sizing Guide", "Shipping", "Returns"].map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className="text-xs text-[var(--vsc-gray-500)] uppercase tracking-[0.15em] hover:text-[var(--vsc-gray-900)] transition-colors duration-200"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2 — Social */}
        <div>
          <span
            className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] block mb-4"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Social
          </span>
          <ul className="space-y-2">
            {["Instagram", "TikTok", "Twitter/X", "Discord"].map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className="text-xs text-[var(--vsc-gray-500)] uppercase tracking-[0.15em] hover:text-[var(--vsc-gray-900)] transition-colors duration-200"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {item} ↗
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Legal */}
        <div>
          <span
            className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] block mb-4"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Legal
          </span>
          <ul className="space-y-2">
            <li>
              <Link
                href="/privacy-policy"
                className="text-xs text-[var(--vsc-gray-500)] uppercase tracking-[0.15em] hover:text-[var(--vsc-gray-900)] transition-colors duration-200"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms-of-service"
                className="text-xs text-[var(--vsc-gray-400)] uppercase tracking-[0.15em] hover:text-[var(--vsc-accent)] transition-colors duration-200"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4 — Newsletter */}
        <div>
          <span
            className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] block mb-4"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Stay in the loop
          </span>
          <p
            className="text-xs text-[var(--vsc-gray-600)] mb-4 leading-relaxed"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Get early access to drops and exclusive content.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="YOUR@EMAIL.COM"
              className="flex-1 px-5 py-4 bg-[var(--vsc-cream)] border border-[var(--vsc-gray-300)] text-[var(--vsc-gray-900)] text-xs uppercase tracking-[0.15em] placeholder:text-[var(--vsc-gray-400)] focus:outline-none focus:border-[var(--vsc-gray-900)]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            />
            <button
              className="px-6 py-4 bg-[var(--vsc-gray-900)] text-[var(--vsc-cream)] text-sm font-bold uppercase tracking-[0.15em] hover:bg-[var(--vsc-gray-800)] transition-colors duration-200"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="px-6 md:px-12 lg:px-20 py-8 border-t border-[var(--vsc-gray-200)] flex flex-col md:flex-row items-center justify-between gap-2">
        <span
          className="text-[10px] text-[var(--vsc-gray-600)] uppercase tracking-[0.2em]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          © 2024 Vascario. All rights reserved.
        </span>
        <span
          className="text-[10px] text-[var(--vsc-gray-700)] uppercase tracking-[0.15em]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          Designed for the culture.
        </span>
      </div>
    </footer>
  );
}
