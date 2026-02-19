"use client"

import { useCart } from "@/context/CartContext"
import { useCurrency } from "@/context/CurrencyContext"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"

export default function CartPageClient() {
    const { user } = useAuth()
    const { formatPrice } = useCurrency()
    const { items, updateQuantity, removeItem, cartTotal, cartCount } = useCart()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const shipping = cartTotal > 0 ? 0 : 0
    const total = cartTotal + shipping

    if (!mounted) return null

    return (
        <main className="min-h-screen bg-[var(--vsc-cream)]">
            <Navbar />

            <div className="pt-24 sm:pt-28 md:pt-36 pb-12 sm:pb-20 px-4 sm:px-6 md:px-12 lg:px-20">
                {/* ===== KINETIC TITLE ===== */}
                <div className="relative mb-8 md:mb-8">
                    <h1
                        className="text-[var(--vsc-gray-900)] select-none relative z-10"
                        style={{
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "clamp(4rem, 12vw, 10rem)",
                            lineHeight: 0.85,
                            letterSpacing: "-0.05em",
                            fontWeight: 700,
                            textTransform: "uppercase",
                        }}
                    >
                        YOUR
                        <br />
                        <span className="text-[var(--vsc-accent)]">BAG</span>
                    </h1>
                    {/* Item counter */}
                    <span
                        className="block mt-4 text-xs text-[var(--vsc-gray-400)] uppercase tracking-[0.3em]"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        [ {cartCount} {cartCount === 1 ? "ITEM" : "ITEMS"} ]
                    </span>
                </div>

                {!user ? (
                    <div className="flex flex-col items-center justify-center py-20 sm:py-32 gap-6 sm:gap-8">
                        <p
                            className="text-xl sm:text-2xl md:text-4xl font-bold text-[var(--vsc-gray-600)] uppercase tracking-[0.1em] text-center px-4"
                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                            SIGN IN TO VIEW YOUR BAG
                        </p>
                        <Link
                            href="/login?redirect=/cart"
                            className="w-full sm:w-auto text-center px-6 py-3 sm:py-4 md:px-10 md:py-6 bg-[var(--vsc-gray-900)] !text-[var(--vsc-cream)] text-xs sm:text-sm font-bold uppercase tracking-[0.2em] hover:bg-[var(--vsc-gray-800)] hover:!text-[var(--vsc-white)] border-2 border-[var(--vsc-gray-900)] transition-all duration-200 hover:shadow-[0_0_20px_var(--vsc-accent-dim)]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            SIGN IN →
                        </Link>
                    </div>
                ) : items.length === 0 ? (
                    /* ===== EMPTY STATE ===== */
                    <div className="flex flex-col items-center justify-center py-20 sm:py-32 gap-6 sm:gap-8">
                        <p
                            className="text-xl sm:text-2xl md:text-4xl font-bold text-[var(--vsc-gray-600)] uppercase tracking-[0.1em] text-center px-4"
                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                            NOTHING HERE YET
                        </p>
                        <Link
                            href="/"
                            className="w-full sm:w-auto text-center px-6 py-3 sm:py-4 md:px-10 md:py-6 bg-[var(--vsc-gray-900)] !text-[var(--vsc-cream)] text-xs sm:text-sm font-bold uppercase tracking-[0.2em] hover:bg-[var(--vsc-gray-800)] hover:!text-[var(--vsc-white)] border-2 border-[var(--vsc-gray-900)] transition-all duration-200 hover:shadow-[0_0_20px_var(--vsc-accent-dim)]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            CONTINUE SHOPPING →
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mt-6 sm:mt-8 md:mt-0">
                        {/* ===== BENTO GRID — CART ITEMS ===== */}
                        <div className="lg:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                                {items.map((item, index) => (
                                    <div
                                        key={`${item.id}-${item.size}-${index}`}
                                        className={`relative border-2 sm:border-3 md:border-4 border-[var(--vsc-gray-200)] bg-[var(--vsc-white)] overflow-hidden group ${index === 0 ? "md:col-span-2" : ""
                                            }`}
                                    >
                                        {/* Remove button */}
                                        <button
                                            onClick={() => removeItem(item.id, item.size)}
                                            className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[var(--vsc-white)] border-2 border-[var(--vsc-gray-300)] text-[var(--vsc-gray-500)] hover:border-[#ef4444] hover:text-[#ef4444] hover:bg-[var(--vsc-cream)] transition-all duration-200 active:scale-90 text-sm sm:text-base"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            ✕
                                        </button>

                                        {/* Product image area */}
                                        <div
                                            className={`relative bg-[var(--vsc-gray-100)] flex items-center justify-center overflow-hidden ${index === 0 ? "h-40 sm:h-48 md:h-64" : "h-36 sm:h-40 md:h-52"
                                                }`}
                                        >
                                            {item.image && (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover object-center"
                                                />
                                            )}
                                            <div
                                                className="absolute inset-0 opacity-10 z-10"
                                                style={{
                                                    backgroundImage: `
                            linear-gradient(45deg, var(--vsc-gray-700) 25%, transparent 25%),
                            linear-gradient(-45deg, var(--vsc-gray-700) 25%, transparent 25%),
                            linear-gradient(45deg, transparent 75%, var(--vsc-gray-700) 75%),
                            linear-gradient(-45deg, transparent 75%, var(--vsc-gray-700) 75%)
                          `,
                                                    backgroundSize: "20px 20px",
                                                    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                                                }}
                                            />
                                            <span
                                                className="text-[var(--vsc-gray-600)] text-xs uppercase tracking-[0.3em] z-20 px-4 text-center"
                                                style={{ fontFamily: "var(--font-space-mono)" }}
                                            >
                                                {item.name}
                                            </span>
                                        </div>

                                        {/* Item details */}
                                        <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                                            {/* Name + Size */}
                                            <div>
                                                <h3
                                                    className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.05em] text-[var(--vsc-gray-900)]"
                                                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                                                >
                                                    {item.name}
                                                </h3>
                                                <span
                                                    className="text-[10px] sm:text-xs text-[var(--vsc-gray-400)] uppercase tracking-[0.2em] mt-1 block"
                                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                                >
                                                    SIZE: {item.size}
                                                </span>
                                            </div>

                                            {/* Price + Quantity Row */}
                                            <div className="flex items-center justify-between gap-3">
                                                {/* Price */}
                                                <span
                                                    className="text-base sm:text-lg md:text-xl font-bold text-[var(--vsc-gray-900)]"
                                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                                >
                                                    {formatPrice(item.price)}
                                                </span>

                                                {/* Quantity Controls — Squishy */}
                                                <div className="flex items-center gap-0 border-2 border-[var(--vsc-white)]">
                                                    <button
                                                        onClick={() =>
                                                            item.quantity > 1
                                                                ? updateQuantity(item.id, item.size, item.quantity - 1)
                                                                : removeItem(item.id, item.size)
                                                        }
                                                        className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[var(--vsc-gray-100)] text-[var(--vsc-gray-900)] text-base sm:text-lg font-bold hover:bg-[var(--vsc-gray-200)] hover:text-[var(--vsc-gray-900)] transition-all duration-150 active:scale-[0.85] select-none"
                                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                                    >
                                                        −
                                                    </button>
                                                    <span
                                                        className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[var(--vsc-white)] text-[var(--vsc-gray-900)] text-xs sm:text-sm font-bold border-x-2 border-[var(--vsc-gray-200)]"
                                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                                    >
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                        className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[var(--vsc-gray-100)] text-[var(--vsc-gray-900)] text-base sm:text-lg font-bold hover:bg-[var(--vsc-gray-200)] hover:text-[var(--vsc-gray-900)] transition-all duration-150 active:scale-[0.85] select-none"
                                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Line total */}
                                            <div className="flex justify-between items-center pt-3 border-t border-dashed border-[var(--vsc-gray-700)]">
                                                <span
                                                    className="text-[10px] text-[var(--vsc-gray-400)] uppercase tracking-[0.2em]"
                                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                                >
                                                    LINE TOTAL
                                                </span>
                                                <span
                                                    className="text-sm font-bold text-[var(--vsc-accent)]"
                                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                                >
                                                    {formatPrice(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ===== CART SUMMARY — DIGITAL INVOICE ===== */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-20 sm:top-24 md:top-28 border-2 sm:border-3 md:border-4 border-[var(--vsc-gray-200)] bg-[var(--vsc-white)]">
                                {/* Summary header */}
                                <div className="px-4 sm:px-6 py-4 sm:py-5 bg-[var(--vsc-gray-900)]">
                                    <h2
                                        className="text-base sm:text-lg font-bold text-[var(--vsc-cream)] uppercase tracking-[0.1em]"
                                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                                    >
                                        ORDER SUMMARY
                                    </h2>
                                </div>

                                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                                    {/* Line items */}
                                    {items.map((item) => (
                                        <div
                                            key={`${item.id}-${item.size}`}
                                            className="flex justify-between items-start pb-4 border-b border-dashed border-[var(--vsc-gray-700)]"
                                        >
                                            <div className="flex items-start gap-3 flex-1 min-w-0 pr-4">
                                                {item.image && (
                                                    <div className="relative w-10 h-10 rounded-sm overflow-hidden bg-[var(--vsc-gray-100)] border border-[var(--vsc-gray-200)] shrink-0">
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <span
                                                        className="text-xs text-[var(--vsc-gray-900)] uppercase tracking-[0.1em] block truncate"
                                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                                    >
                                                        {item.name}
                                                    </span>
                                                    <span
                                                        className="text-[10px] text-[var(--vsc-gray-400)] uppercase tracking-[0.2em]"
                                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                                    >
                                                        SIZE: {item.size} · QTY: {item.quantity} × {formatPrice(Number(item.price))}
                                                    </span>
                                                </div>
                                            </div>
                                            <span
                                                className="text-xs font-bold text-[var(--vsc-gray-900)] shrink-0"
                                                style={{ fontFamily: "var(--font-space-mono)" }}
                                            >
                                                {formatPrice(Number(item.price * item.quantity))}
                                            </span>
                                        </div>
                                    ))}

                                    {/* Subtotal */}
                                    <div className="flex justify-between items-center">
                                        <span
                                            className="text-xs text-[var(--vsc-gray-400)] uppercase tracking-[0.2em]"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            SUBTOTAL
                                        </span>
                                        <span
                                            className="text-sm font-bold text-[var(--vsc-gray-900)]"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            {formatPrice(cartTotal)}
                                        </span>
                                    </div>

                                    {/* Shipping */}
                                    <div className="flex justify-between items-center">
                                        <span
                                            className="text-xs text-[var(--vsc-gray-400)] uppercase tracking-[0.2em]"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            SHIPPING
                                        </span>
                                        <span
                                            className="text-xs font-bold text-[var(--vsc-accent)] uppercase tracking-[0.15em]"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            {shipping === 0
                                                ? "FREE"
                                                : formatPrice(Number(shipping))}
                                        </span>
                                    </div>

                                    {/* Total */}
                                    <div className="flex justify-between items-center pt-4 border-t-2 border-[var(--vsc-gray-300)]">
                                        <span
                                            className="text-sm font-bold text-[var(--vsc-gray-900)] uppercase tracking-[0.1em]"
                                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                                        >
                                            TOTAL
                                        </span>
                                        <span
                                            className="text-xl md:text-2xl font-bold text-[var(--vsc-accent)]"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            {formatPrice(total)}
                                        </span>
                                    </div>

                                    {/* CTA */}
                                    <Link
                                        href="/checkout"
                                        className="block w-full text-center px-4 sm:px-6 py-3 sm:py-4 md:px-10 md:py-6 bg-[var(--vsc-gray-900)] !text-[var(--vsc-cream)] text-xs sm:text-sm font-bold uppercase tracking-[0.2em] hover:bg-[var(--vsc-gray-800)] hover:!text-[var(--vsc-white)] border-2 border-[var(--vsc-gray-900)] transition-all duration-200 hover:shadow-[0_0_20px_var(--vsc-accent-dim)] active:scale-[0.97]"
                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                        PROCEED TO CHECKOUT →
                                    </Link>

                                    {/* Continue shopping */}
                                    <Link
                                        href="/"
                                        className="block w-full text-center text-[10px] sm:text-xs text-[var(--vsc-gray-400)] uppercase tracking-[0.2em] hover:text-[var(--vsc-accent)] transition-colors duration-200 py-2"
                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                        ← CONTINUE SHOPPING
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    )
}

