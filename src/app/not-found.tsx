"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <main className="min-h-screen bg-[var(--vsc-cream)] text-[var(--vsc-gray-900)]">
      <Navbar />

      <section className="pt-32 pb-24 px-6 md:px-12 lg:px-20 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-2xl mx-auto text-center">
          <p
            className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] mb-4"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            [ 404 ]
          </p>
          
          <h1
            className="text-[var(--vsc-gray-900)] leading-[0.9] mb-6"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "clamp(3rem, 12vw, 9rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            PAGE
            <br />
            <span className="text-[var(--vsc-accent)]">NOT</span>
            <br />
            FOUND<span className="text-[var(--vsc-accent)]">.</span>
          </h1>

          <p
            className="text-xs md:text-sm text-[var(--vsc-gray-600)] uppercase tracking-[0.2em] mb-8 max-w-md mx-auto"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-[var(--vsc-black)] uppercase tracking-[0.2em] text-xs hover:bg-[var(--vsc-gray-800)] transition-colors duration-200"
              style={{ fontFamily: "var(--font-space-mono)", color: "white" }}
            >
              Back to Home
            </Link>
            <Link
              href="/collection"
              className="inline-block px-8 py-3 border-2 border-[var(--vsc-black)] uppercase tracking-[0.2em] text-xs transition-colors duration-200"
              style={{
                fontFamily: "var(--font-space-mono)",
                backgroundColor: isHovered ? "var(--vsc-black)" : "transparent",
                color: isHovered ? "white" : "var(--vsc-black)",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Browse Collection
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
