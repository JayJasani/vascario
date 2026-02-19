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

      {/* Title — massive, cropped at edges */}
      <div className="relative z-10 w-full pb-12 sm:pb-16 md:pb-28 px-4 sm:px-6 md:px-12 lg:px-20">
        {/* Oversized title that crops off-screen */}
        <h1
          className="text-hero leading-[0.85] tracking-[-0.05em] text-white select-none"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: "clamp(3rem, 12vw, 16rem)",
            marginLeft: "-0.04em",
          }}
        >
          VASC
          <span className="relative inline-flex items-baseline mx-[0.02em] -mr-[0.04em] -ml-[0.04em]">
            <Image
              src="/logo/arlogo.png"
              alt="VASCARIO A logo"
              width={200}
              height={200}
              className="block h-[.89em] w-auto translate-y-[0.11em]"
              priority
              sizes="(max-width: 640px) 72px, (max-width: 768px) 100px, 200px"
            />
          </span>
          RIO
        </h1>

        {/* Tagline — monospace, offset */}
        <div className="mt-4 sm:mt-6 md:mt-8 md:ml-2 flex flex-col md:flex-row md:items-end gap-3 sm:gap-4 md:gap-12">
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

        {/* Floating accent line & corner markers */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:right-10 flex flex-col items-center gap-1">
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

      </div>
    </section>
  );
}
