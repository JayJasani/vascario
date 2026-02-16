"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"

export function EditorialSection() {
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible")
                    }
                })
            },
            { threshold: 0.15 }
        )

        const elements = sectionRef.current?.querySelectorAll(".reveal")
        elements?.forEach((el) => observer.observe(el))
        return () => elements?.forEach((el) => observer.unobserve(el))
    }, [])

    return (
        <section id="editorial" ref={sectionRef} className="py-28 md:py-40 relative overflow-hidden">
            {/* Background accent line */}
            <div
                className="absolute left-0 top-1/2 w-full h-px opacity-10"
                style={{ background: "linear-gradient(90deg, transparent, var(--vsc-accent), transparent)" }}
            />

            {/* Header with giant overlapping text */}
            <div className="relative px-6 md:px-12 lg:px-20 mb-16 md:mb-24">
                <span
                    className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] block mb-4 reveal"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                >
                    [ 002 ] Editorial
                </span>
                <h2
                    className="text-section text-[var(--vsc-gray-900)] leading-[0.9] reveal"
                    style={{
                        fontFamily: "var(--font-space-grotesk)",
                        fontSize: "clamp(3rem, 8vw, 8rem)",
                    }}
                >
                    WEAR
                    <br />
                    <span className="text-[var(--vsc-accent)]">THE</span>
                    <br />
                    CULTURE<span className="text-[var(--vsc-accent)]">.</span>
                </h2>
            </div>

            {/* Asymmetric editorial grid */}
            <div className="px-6 md:px-12 lg:px-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
                    {/* Large editorial image */}
                    <div className="md:col-span-7 reveal">
                        <div className="relative aspect-[4/5] bg-[var(--vsc-gray-900)] overflow-hidden border border-[var(--vsc-gray-700)] group">
                            <video
                                className="absolute inset-0 w-full h-full object-cover"
                                src="/video/onboard2.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                                <div className="absolute inset-0 opacity-[0.06]"
                                    style={{
                                        backgroundImage: `repeating-linear-gradient(0deg, var(--vsc-gray-600) 0px, var(--vsc-gray-600) 1px, transparent 1px, transparent 4px)`,
                                    }}
                                />
                                <span
                                    className="text-[var(--vsc-gray-600)] text-xs uppercase tracking-[0.4em] z-10"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    Editorial
                                </span>
                                <span
                                    className="text-[var(--vsc-gray-700)] text-6xl md:text-8xl font-bold mt-4 z-10"
                                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                                >
                                    01
                                </span>
                            </div>
                            {/* Hover accent overlay */}
                            <div className="absolute inset-0 bg-[var(--vsc-accent)] opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                        </div>
                    </div>

                    {/* Right column — stacked */}
                    <div className="md:col-span-5 flex flex-col gap-6 md:gap-10">
                        {/* Smaller image */}
                        <div className="reveal" style={{ transitionDelay: "100ms" }}>
                            <div className="relative aspect-square bg-[var(--vsc-gray-900)] overflow-hidden border border-[var(--vsc-gray-700)] group">
                                <Image
                                    src="/tshirt/closeup.png"
                                    alt="Close-up"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                                    <div className="absolute inset-0 opacity-[0.06]"
                                        style={{
                                            backgroundImage: `repeating-linear-gradient(90deg, var(--vsc-gray-600) 0px, var(--vsc-gray-600) 1px, transparent 1px, transparent 4px)`,
                                        }}
                                    />
                                    <span
                                        className="text-[var(--vsc-gray-600)] text-xs uppercase tracking-[0.4em] z-10"
                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                        Close-up
                                    </span>
                                    <span
                                        className="text-[var(--vsc-gray-700)] text-5xl md:text-7xl font-bold mt-4 z-10"
                                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                                    >
                                        02
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-[var(--vsc-accent)] opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                            </div>
                        </div>

                        {/* Text block */}
                        <div
                            className="border border-[var(--vsc-gray-700)] p-6 md:p-8 flex-1 flex flex-col justify-between reveal"
                            style={{ transitionDelay: "200ms" }}
                        >
                            <div>
                                <span
                                    className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] block mb-4"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    The Craft
                                </span>
                                <p
                                    className="text-sm text-[var(--vsc-gray-400)] leading-relaxed"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    Each piece is embroidered with precision on premium 300 GSM cotton.
                                    Not printed. Not transferred. Stitched thread by thread.
                                    Because real culture deserves real craftsmanship.
                                </p>
                            </div>
                            <div className="mt-6 flex items-center gap-3">
                                <div className="w-6 h-px bg-[var(--vsc-accent)]" />
                                <span
                                    className="text-[10px] text-[var(--vsc-gray-600)] uppercase tracking-[0.2em]"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    300 GSM · Italian Cotton · Hand-finished
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom accent strip */}
            <div className="mt-16 md:mt-24 px-6 md:px-12 lg:px-20">
                <div className="flex items-center gap-4 reveal">
                    <div className="flex-1 h-px bg-[var(--vsc-gray-800)]" />
                    <span
                        className="text-[10px] text-[var(--vsc-gray-600)] uppercase tracking-[0.3em]"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        Vascario · S1
                    </span>
                    <div className="flex-1 h-px bg-[var(--vsc-gray-800)]" />
                </div>
            </div>
        </section>
    )
}
