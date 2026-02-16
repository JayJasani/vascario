"use client"

import { useCart } from "@/context/CartContext"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { useEffect, useState } from "react"

// Seed demo items on first load if cart is empty
const DEMO_ITEMS = [
    {
        id: "prod_1",
        name: "Signature Tee — Onyx",
        price: 85,
        image: "/placeholder-tee-black.png",
        size: "L",
        quantity: 1,
    },
    {
        id: "prod_2",
        name: "Heavyweight — Charcoal",
        price: 95,
        image: "/placeholder-tee-charcoal.png",
        size: "M",
        quantity: 2,
    },
    {
        id: "prod_3",
        name: "Gold Edition",
        price: 120,
        image: "/placeholder-tee-gold.png",
        size: "XL",
        quantity: 1,
    },
]

export default function CartPage() {
    const { items, updateQuantity, removeItem, cartTotal, cartCount, addItem } = useCart()
    const [mounted, setMounted] = useState(false)

    // Seed demo items on mount if cart is empty
    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted && items.length === 0) {
            DEMO_ITEMS.forEach((item) => addItem(item))
        }
        // Only run once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted])

    const shipping = cartTotal > 0 ? 0 : 0
    const total = cartTotal + shipping

    if (!mounted) return null

    return (
        <main className="min-h-screen bg-[var(--vsc-black)]">
            <Navbar />

            <div className="pt-28 md:pt-36 pb-20 px-6 md:px-12 lg:px-20">
                {/* ===== KINETIC TITLE ===== */}
                <div className="relative mb-8 md:mb-8">
                    <h1
                        className="text-[var(--vsc-white)] select-none relative z-10"
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

                {items.length === 0 ? (
                    /* ===== EMPTY STATE ===== */
                    <div className="flex flex-col items-center justify-center py-32 gap-8">
                        <p
                            className="text-2xl md:text-4xl font-bold text-[var(--vsc-gray-600)] uppercase tracking-[0.1em]"
                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                            NOTHING HERE YET
                        </p>
                        <Link
                            href="/"
                            className="w-full sm:w-auto text-center px-6 py-4 md:px-10 md:py-6 bg-[var(--vsc-accent)] !text-[var(--vsc-black)] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[var(--vsc-black)] hover:!text-[var(--vsc-white)] border-2 border-[var(--vsc-accent)] transition-all duration-200 hover:shadow-[0_0_20px_var(--vsc-accent-dim)]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            CONTINUE SHOPPING →
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 md:mt-0">
                        {/* ===== BENTO GRID — CART ITEMS ===== */}
                        <div className="lg:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {items.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`relative border-2 md:border-4 border-[var(--vsc-white)] bg-[var(--vsc-gray-900)] overflow-hidden group ${index === 0 ? "md:col-span-2" : ""
                                            }`}
                                    >
                                        {/* Remove button */}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center bg-[var(--vsc-black)] border-2 border-[var(--vsc-gray-600)] text-[var(--vsc-gray-400)] hover:border-[#FF3333] hover:text-[#FF3333] hover:bg-[var(--vsc-black)] transition-all duration-200 active:scale-90"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            ✕
                                        </button>

                                        {/* Product image area */}
                                        <div
                                            className={`relative bg-[var(--vsc-gray-800)] flex items-center justify-center ${index === 0 ? "h-48 md:h-64" : "h-40 md:h-52"
                                                }`}
                                        >
                                            <div
                                                className="absolute inset-0 opacity-10"
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
                                                className="text-[var(--vsc-gray-600)] text-xs uppercase tracking-[0.3em] z-10"
                                                style={{ fontFamily: "var(--font-space-mono)" }}
                                            >
                                                {item.name}
                                            </span>
                                        </div>

                                        {/* Item details */}
                                        <div className="p-5 md:p-6 space-y-4">
                                            {/* Name + Size */}
                                            <div>
                                                <h3
                                                    className="text-sm md:text-base font-bold uppercase tracking-[0.05em] text-[var(--vsc-white)]"
                                                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                                                >
                                                    {item.name}
                                                </h3>
                                                <span
                                                    className="text-xs text-[var(--vsc-gray-400)] uppercase tracking-[0.2em] mt-1 block"
                                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                                >
                                                    SIZE: {item.size}
                                                </span>
                                            </div>

                                            {/* Price + Quantity Row */}
                                            <div className="flex items-center justify-between">
                                                {/* Price */}
                                                <span
                                                    className="text-lg md:text-xl font-bold text-[var(--vsc-white)]"
                                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                                >
                                                    ${item.price.toFixed(0)}
                                                </span>

                                                {/* Quantity Controls — Squishy */}
                                                <div className="flex items-center gap-0 border-2 border-[var(--vsc-white)]">
                                                    <button
                                                        onClick={() =>
                                                            item.quantity > 1
                                                                ? updateQuantity(item.id, item.quantity - 1)
                                                                : removeItem(item.id)
                                                        }
                                                        className="w-12 h-12 flex items-center justify-center bg-[var(--vsc-black)] text-[var(--vsc-white)] text-lg font-bold hover:bg-[var(--vsc-accent)] hover:text-[var(--vsc-black)] transition-all duration-150 active:scale-[0.85] select-none"
                                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                                    >
                                                        −
                                                    </button>
                                                    <span
                                                        className="w-12 h-12 flex items-center justify-center bg-[var(--vsc-gray-900)] text-[var(--vsc-white)] text-sm font-bold border-x-2 border-[var(--vsc-white)]"
                                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                                    >
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-12 h-12 flex items-center justify-center bg-[var(--vsc-black)] text-[var(--vsc-white)] text-lg font-bold hover:bg-[var(--vsc-accent)] hover:text-[var(--vsc-black)] transition-all duration-150 active:scale-[0.85] select-none"
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
                                                    ${(item.price * item.quantity).toFixed(0)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ===== CART SUMMARY — DIGITAL INVOICE ===== */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 border-2 md:border-4 border-[var(--vsc-accent)] bg-[var(--vsc-gray-900)]">
                                {/* Summary header */}
                                <div className="px-6 py-5 bg-[var(--vsc-accent)]">
                                    <h2
                                        className="text-lg font-bold text-[var(--vsc-black)] uppercase tracking-[0.1em]"
                                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                                    >
                                        ORDER SUMMARY
                                    </h2>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Line items */}
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between items-start pb-4 border-b border-dashed border-[var(--vsc-gray-700)]"
                                        >
                                            <div className="flex-1 min-w-0 pr-4">
                                                <span
                                                    className="text-xs text-[var(--vsc-white)] uppercase tracking-[0.1em] block truncate"
                                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                                >
                                                    {item.name}
                                                </span>
                                                <span
                                                    className="text-[10px] text-[var(--vsc-gray-400)] uppercase tracking-[0.2em]"
                                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                                >
                                                    QTY: {item.quantity} × ${item.price}
                                                </span>
                                            </div>
                                            <span
                                                className="text-xs font-bold text-[var(--vsc-white)] shrink-0"
                                                style={{ fontFamily: "var(--font-space-mono)" }}
                                            >
                                                ${(item.price * item.quantity).toFixed(0)}
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
                                            className="text-sm font-bold text-[var(--vsc-white)]"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            ${cartTotal.toFixed(0)}
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
                                            {shipping === 0 ? "FREE" : `$${shipping}`}
                                        </span>
                                    </div>

                                    {/* Total */}
                                    <div className="flex justify-between items-center pt-4 border-t-2 border-[var(--vsc-white)]">
                                        <span
                                            className="text-sm font-bold text-[var(--vsc-white)] uppercase tracking-[0.1em]"
                                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                                        >
                                            TOTAL
                                        </span>
                                        <span
                                            className="text-xl md:text-2xl font-bold text-[var(--vsc-accent)]"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            ${total.toFixed(0)}
                                        </span>
                                    </div>

                                    {/* CTA */}
                                    <Link
                                        href="/checkout"
                                        className="block w-full text-center px-6 py-4 md:px-10 md:py-6 bg-[var(--vsc-accent)] !text-[var(--vsc-black)] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[var(--vsc-black)] hover:!text-[var(--vsc-white)] border-2 border-[var(--vsc-accent)] transition-all duration-200 hover:shadow-[0_0_20px_var(--vsc-accent-dim)] active:scale-[0.97]"
                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                        PROCEED TO CHECKOUT →
                                    </Link>

                                    {/* Continue shopping */}
                                    <Link
                                        href="/"
                                        className="block w-full text-center text-xs text-[var(--vsc-gray-400)] uppercase tracking-[0.2em] hover:text-[var(--vsc-accent)] transition-colors duration-200 py-2"
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
