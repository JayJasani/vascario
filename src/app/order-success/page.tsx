"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"

function OrderSuccessContent() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("order") || "0000"
    const [flickered, setFlickered] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Trigger CRT flicker once
        const timer = setTimeout(() => setFlickered(true), 1500)
        return () => clearTimeout(timer)
    }, [])

    if (!mounted) return null

    const marqueeText = `ORDER #${orderId} CONFIRMED  ★  YOUR DROP IS LOCKED  ★  ORDER #${orderId} CONFIRMED  ★  YOUR DROP IS LOCKED  ★  `

    return (
        <main className="min-h-screen bg-[var(--vsc-cream)] overflow-hidden">
            <Navbar />

            {/* ===== MASSIVE MARQUEE HERO ===== */}
            <div className="pt-24 md:pt-32">
                <div className="relative overflow-hidden py-8 md:py-12 bg-[var(--vsc-accent)]">
                    <div
                        className="flex whitespace-nowrap"
                        style={{
                            width: "max-content",
                            animation: "marquee-confirmed 60s linear infinite",
                        }}
                    >
                        {[...Array(6)].map((_, i) => (
                            <span
                                key={i}
                                className="text-white font-bold uppercase select-none px-6"
                                style={{
                                    fontFamily: "var(--font-space-grotesk)",
                                    fontSize: "clamp(2.5rem, 8vw, 6rem)",
                                    letterSpacing: "-0.03em",
                                    lineHeight: 1,
                                }}
                            >
                                {marqueeText}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Second marquee — reverse direction, smaller */}
                <div className="relative overflow-hidden py-3 bg-[var(--vsc-gray-900)] border-y-2 md:border-y-4 border-[var(--vsc-accent)]">
                    <div
                        className="flex whitespace-nowrap"
                        style={{
                            width: "max-content",
                            animation: "marquee-confirmed 60s linear infinite reverse",
                        }}
                    >
                        {[...Array(10)].map((_, i) => (
                            <span
                            key={i}
                            className="text-white font-bold uppercase select-none px-4"
                                style={{
                                    fontFamily: "var(--font-space-mono)",
                                    fontSize: "clamp(0.7rem, 1.2vw, 0.875rem)",
                                    letterSpacing: "0.3em",
                                }}
                            >
                                THANK YOU FOR YOUR ORDER  //  VASCARIO SEASON 1  //  FREE SHIPPING WORLDWIDE  //
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== CONTENT ===== */}
            <div className="px-6 md:px-12 lg:px-20 py-16 md:py-24">
                <div className="max-w-2xl mx-auto">

                    {/* ===== DIGITAL RECEIPT — THERMAL PAPER ===== */}
                    <div
                        className="relative bg-[var(--vsc-cream)]"
                        style={{
                            animation: !flickered ? "crt-flicker 0.15s ease 4" : "none",
                        }}
                    >
                        {/* Receipt header */}
                        <div className="px-8 md:px-12 pt-10 pb-6 text-center border-b-2 border-dashed border-[var(--vsc-gray-200)]">
                            <h2
                                className="text-[var(--vsc-black)] mb-2"
                                style={{
                                    fontFamily: "var(--font-space-grotesk)",
                                    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                                    fontWeight: 700,
                                    letterSpacing: "-0.03em",
                                }}
                            >
                                VASCARIO
                            </h2>
                            <p
                                className="text-xs text-[var(--vsc-gray-600)] uppercase tracking-[0.3em]"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                DIGITAL RECEIPT
                            </p>
                        </div>

                        {/* Order info */}
                        <div className="px-8 md:px-12 py-6 space-y-3 border-b-2 border-dashed border-[var(--vsc-gray-200)]">
                            <div className="flex justify-between">
                                <span
                                    className="text-xs text-[var(--vsc-gray-600)] uppercase tracking-[0.15em]"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    ORDER
                                </span>
                                <span
                                    className="text-xs font-bold text-[var(--vsc-black)] uppercase tracking-[0.1em]"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    #{orderId}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span
                                    className="text-xs text-[var(--vsc-gray-600)] uppercase tracking-[0.15em]"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    DATE
                                </span>
                                <span
                                    className="text-xs font-bold text-[var(--vsc-black)] uppercase tracking-[0.1em]"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    {new Date().toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    }).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span
                                    className="text-xs text-[var(--vsc-gray-600)] uppercase tracking-[0.15em]"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    STATUS
                                </span>
                                <span
                                    className="text-xs font-bold uppercase tracking-[0.1em] px-3 py-1 bg-[var(--vsc-accent)] !text-white"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    CONFIRMED
                                </span>
                            </div>
                        </div>

                        {/* Items purchased */}
                        <div className="px-8 md:px-12 py-6 space-y-4 border-b-2 border-dashed border-[var(--vsc-gray-200)]">
                            <h4
                                className="text-[10px] text-[var(--vsc-gray-600)] uppercase tracking-[0.3em] mb-4"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                ITEMS
                            </h4>
                            {/* Demo items since cart was cleared */}
                            {[
                                { name: "SIGNATURE TEE — ONYX", size: "L", qty: 1, price: 85 },
                                { name: "HEAVYWEIGHT — CHARCOAL", size: "M", qty: 2, price: 95 },
                                { name: "GOLD EDITION", size: "XL", qty: 1, price: 120 },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-start pb-3 border-b border-dotted border-[var(--vsc-gray-200)]">
                                    <div>
                                        <span
                                            className="text-xs text-[var(--vsc-black)] uppercase tracking-[0.05em] block font-bold"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            {item.name}
                                        </span>
                                        <span
                                            className="text-[10px] text-[var(--vsc-gray-600)] uppercase"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            SIZE: {item.size} — QTY: {item.qty}
                                        </span>
                                    </div>
                                    <span
                                        className="text-xs font-bold text-[var(--vsc-black)]"
                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                        ${(item.price * item.qty).toFixed(0)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="px-8 md:px-12 py-6 space-y-3">
                            <div className="flex justify-between">
                                <span
                                    className="text-xs text-[var(--vsc-gray-600)] uppercase tracking-[0.15em]"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    SUBTOTAL
                                </span>
                                <span
                                    className="text-xs font-bold text-[var(--vsc-black)]"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    $395
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span
                                    className="text-xs text-[var(--vsc-gray-600)] uppercase tracking-[0.15em]"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    SHIPPING
                                </span>
                                <span
                                    className="text-xs font-bold text-[var(--vsc-black)]"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    FREE
                                </span>
                            </div>
                            <div className="flex justify-between pt-4 border-t-2 border-[var(--vsc-black)]">
                                <span
                                    className="text-sm font-bold text-[var(--vsc-black)] uppercase tracking-[0.1em]"
                                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                                >
                                    TOTAL
                                </span>
                                <span
                                    className="text-xl font-bold text-[var(--vsc-black)]"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    $395
                                </span>
                            </div>
                        </div>

                        {/* Receipt footer */}
                        <div className="px-8 md:px-12 py-6 text-center border-t-2 border-dashed border-[var(--vsc-gray-200)]">
                            <p
                                className="text-[10px] text-[var(--vsc-gray-600)] uppercase tracking-[0.3em] mb-1"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                THANK YOU FOR SHOPPING WITH
                            </p>
                            <p
                                className="text-sm font-bold text-[var(--vsc-black)] uppercase tracking-[0.1em]"
                                style={{ fontFamily: "var(--font-space-grotesk)" }}
                            >
                                VASCARIO
                            </p>
                            <p
                                className="text-[10px] text-[var(--vsc-gray-600)] uppercase tracking-[0.15em] mt-2"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                WEAR THE CULTURE — EST. 2024
                            </p>
                        </div>

                        {/* ===== JAGGED/TORN BOTTOM EDGE — thermal paper style ===== */}
                        <div
                            className="h-6 bg-[var(--vsc-cream)]"
                            style={{
                                clipPath: `polygon(
                  0% 0%, 2% 100%, 4% 20%, 6% 80%, 8% 30%, 10% 90%, 
                  12% 10%, 14% 70%, 16% 25%, 18% 85%, 20% 15%, 
                  22% 75%, 24% 35%, 26% 95%, 28% 5%, 30% 65%, 
                  32% 40%, 34% 100%, 36% 0%, 38% 80%, 40% 20%, 
                  42% 90%, 44% 10%, 46% 70%, 48% 30%, 50% 85%, 
                  52% 15%, 54% 75%, 56% 25%, 58% 95%, 60% 5%, 
                  62% 65%, 64% 40%, 66% 100%, 68% 0%, 70% 80%,
                  72% 20%, 74% 90%, 76% 10%, 78% 70%, 80% 30%,
                  82% 85%, 84% 15%, 86% 75%, 88% 25%, 90% 95%,
                  92% 5%, 94% 65%, 96% 40%, 98% 100%, 100% 0%
                )`,
                            }}
                        />
                    </div>

                    {/* ===== CTA BUTTONS ===== */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16">
                        <Link
                            href="/"
                            className="w-full sm:w-auto text-center px-6 py-4 md:px-10 md:py-6 bg-[var(--vsc-gray-900)] !text-[var(--vsc-cream)] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[var(--vsc-gray-800)] hover:!text-[var(--vsc-white)] border-2 border-[var(--vsc-gray-900)] transition-all duration-200 hover:shadow-[0_0_20px_var(--vsc-accent-dim)] active:scale-[0.97]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            CONTINUE SHOPPING →
                        </Link>
                        <button
                            className="w-full sm:w-auto text-center px-6 py-4 md:px-10 md:py-6 bg-transparent text-[var(--vsc-white)] text-sm font-bold uppercase tracking-[0.2em] hover:text-[var(--vsc-accent)] transition-colors duration-200 border-2 md:border-4 border-[var(--vsc-gray-600)] hover:border-[var(--vsc-accent)]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            TRACK ORDER
                        </button>
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    )
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-[var(--vsc-cream)] flex items-center justify-center">
                <span
                    className="text-xs text-[var(--vsc-gray-400)] uppercase tracking-[0.3em] animate-pulse"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                >
                    LOADING...
                </span>
            </main>
        }>
            <OrderSuccessContent />
        </Suspense>
    )
}
