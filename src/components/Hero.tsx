"use client"

import { useEffect, useRef } from "react"

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const section = sectionRef.current
        if (!section) return

        const handleScroll = () => {
            const scrollY = window.scrollY
            const opacity = Math.max(0, 1 - scrollY / 600)
            const translateY = scrollY * 0.3
            section.style.opacity = String(opacity)
            section.style.transform = `translateY(${translateY}px)`
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <section
            ref={sectionRef}
            className="relative h-screen flex items-end overflow-hidden"
            style={{ willChange: "opacity, transform" }}
        >
            {/* Background — light with soft grey gradient */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
              radial-gradient(ellipse 80% 60% at 70% 40%, rgba(17, 24, 39, 0.04) 0%, transparent 70%),
              radial-gradient(ellipse 60% 80% at 20% 80%, rgba(17, 24, 39, 0.03) 0%, transparent 60%),
              linear-gradient(180deg, #f9fafb 0%, #e5e7eb 100%)
            `,
                    }}
                />
                {/* Grid lines for digital rawness */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(15,23,42,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(15,23,42,0.08) 1px, transparent 1px)
            `,
                        backgroundSize: "80px 80px",
                    }}
                />
            </div>

            {/* Title — massive, cropped at edges */}
            <div className="relative z-10 w-full pb-16 md:pb-28 px-6 md:px-12 lg:px-20">
                {/* Oversized title that crops off-screen */}
                <h1
                    className="text-hero leading-[0.85] tracking-[-0.05em] text-[var(--vsc-gray-900)] select-none"
                    style={{
                        fontFamily: "var(--font-space-grotesk)",
                        fontSize: "clamp(5rem, 14vw, 16rem)",
                        marginLeft: "-0.04em",
                    }}
                >
                    VASC
                    <span className="text-[var(--vsc-accent)]">A</span>
                    RIO
                </h1>

                {/* Tagline — monospace, offset */}
                <div className="mt-6 md:mt-8 md:ml-2 flex flex-col md:flex-row md:items-end gap-4 md:gap-12">
                    <p
                        className="text-xs md:text-sm text-[var(--vsc-gray-400)] uppercase tracking-[0.3em] max-w-md"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        Premium embroidered streetwear
                        <br />
                        <span className="text-[var(--vsc-accent)]">Season 01</span> — Limited Drop
                    </p>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-px bg-[var(--vsc-accent)]" />
                        <span
                            className="text-[10px] text-[var(--vsc-gray-600)] uppercase tracking-[0.2em]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            Scroll to explore
                        </span>
                    </div>
                </div>

                {/* Floating accent line */}
                <div
                    className="absolute top-1/3 right-10 w-px hidden md:block"
                    style={{
                        height: "120px",
                        background: "linear-gradient(180deg, var(--vsc-accent) 0%, transparent 100%)",
                    }}
                />

                {/* Corner markers — brutalist UI elements */}
                <div className="absolute top-6 right-6 md:right-10 flex flex-col items-end gap-1">
                    <span
                        className="text-[10px] text-[var(--vsc-gray-600)] uppercase tracking-[0.15em]"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        EST. 2024
                    </span>
                    <div className="w-4 h-4 border border-[var(--vsc-accent)] rotate-45 opacity-60" />
                </div>
            </div>
        </section>
    )
}
