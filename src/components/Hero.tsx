"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface HeroProps {
  onboard1VideoUrl?: string;
  redirectUrl?: string;
}

export function Hero({ onboard1VideoUrl = "/video/onboard1.webm", redirectUrl }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [backgroundVideoActive] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const opacity = Math.max(0, 1 - scrollY / 600);
      const translateY = scrollY * 0.25;
      section.style.opacity = String(opacity);
      section.style.transform = `translateY(${translateY}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[600px] flex items-end overflow-hidden"
      style={{ willChange: "opacity, transform" }}
    >
      {/* Background video (activated on user interaction to avoid heavy initial payload) */}
      <div
        className={`absolute inset-0 z-0 ${redirectUrl ? 'cursor-pointer' : ''}`}
        onClick={(e) => {
          if (redirectUrl) {
            e.preventDefault();
            e.stopPropagation();
            window.open(redirectUrl, '_blank', 'noopener,noreferrer');
          }
        }}
        role={redirectUrl ? "button" : undefined}
        tabIndex={redirectUrl ? 0 : undefined}
        onKeyDown={(e) => {
          if (redirectUrl && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            window.open(redirectUrl, '_blank', 'noopener,noreferrer');
          }
        }}
      >
        {backgroundVideoActive && (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={onboard1VideoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
        )}
        {/* Black gradient overlay from bottom to top */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.7) 40%, transparent 80%)",
          }}
        />
        {/* Grid lines for digital rawness */}
        {/* <div
          className="absolute inset-0 opacity-[0.10] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(15,23,42,0.18) 1px, transparent 1px),
              linear-gradient(90deg, rgba(15,23,42,0.18) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        /> */}
      </div>

      {/* Title — VASCARIO logo in blue-mark area, directly above tagline */}
      <div className="absolute bottom-12 sm:bottom-16 md:bottom-28 left-4 sm:left-6 md:left-12 lg:left-20 z-10 flex flex-col items-start gap-0">
        <h1 className="leading-none w-[min(24rem,82vw)] sm:w-[min(24rem,75vw)] md:w-[min(26rem,60vw)]">
          <Image
            src="/logo/main.svg"
            alt="VASCARIO"
            width={1200}
            height={300}
            className="w-full h-auto max-h-[5rem] sm:max-h-[5rem] md:max-h-[5.25rem] object-contain object-left select-none"
            priority
            sizes="(max-width: 640px) 70vw, (max-width: 768px) 65vw, 18rem"
          />
        </h1>

        {/* Tagline — immediately below logo, same left edge as blue mark */}
        <div className="mt-2 sm:mt-2.5 md:mt-3 flex flex-col md:flex-row md:items-end gap-3 sm:gap-4 md:gap-12">
          <p
            className="text-[10px] sm:text-xs md:text-sm text-[var(--vsc-gray-400)] uppercase tracking-[0.25em] sm:tracking-[0.3em] max-w-md leading-relaxed"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Premium embroidered streetwear
            <br />
            <span className="text-white">Season 01</span> — Limited Drop
          </p>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 sm:w-8 h-px bg-white" />
            <span
              className="text-[9px] sm:text-[10px] text-[var(--vsc-gray-600)] uppercase tracking-[0.2em]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Scroll to explore
            </span>
          </div>
        </div>

      </div>
      {/* Floating accent line & corner markers */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:right-10 z-10 flex flex-col items-center gap-1">
        <span
          className="text-[9px] sm:text-[10px] text-[var(--vsc-gray-600)] uppercase tracking-[0.15em]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          EST. 2024
        </span>
        <div className="w-3 h-3 sm:w-4 sm:h-4 border border-white rotate-45 opacity-60" />
        <div
          className="hidden sm:block w-px"
          style={{
            height: "clamp(60px, 8vh, 120px)",
            background: "linear-gradient(180deg, white 0%, transparent 100%)",
          }}
        />
      </div>
    </section>
  );
}
