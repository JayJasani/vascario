"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"

export function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const { cartCount } = useCart()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-[var(--vsc-black)]/95 backdrop-blur-sm border-b border-[var(--vsc-gray-700)]"
                : "bg-transparent"
                }`}
        >
            <div className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20">
                {/* Logo — brutalist, cropped feeling */}
                <Link href="/" className="text-display">
                    <span
                        className="text-2xl md:text-3xl font-bold tracking-[-0.06em] uppercase text-[var(--vsc-white)]"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                        VASC
                        <span className="text-[var(--vsc-accent)]">A</span>
                        RIO
                    </span>
                </Link>

                {/* Nav Links — monospace, minimal */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        href="/#collection"
                        className="text-mono text-xs uppercase tracking-[0.2em] text-[var(--vsc-gray-400)] hover:text-[var(--vsc-white)] transition-colors duration-200"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        Collection
                    </Link>
                    <Link
                        href="/#editorial"
                        className="text-mono text-xs uppercase tracking-[0.2em] text-[var(--vsc-gray-400)] hover:text-[var(--vsc-white)] transition-colors duration-200"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        Lookbook
                    </Link>
                    <Link
                        href="/#about"
                        className="text-mono text-xs uppercase tracking-[0.2em] text-[var(--vsc-gray-400)] hover:text-[var(--vsc-white)] transition-colors duration-200"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        About
                    </Link>
                </div>

                {/* Right side — Cart + CTA */}
                <div className="flex items-center gap-4">
                    {/* Cart icon */}
                    <Link
                        href="/cart"
                        className="relative px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--vsc-white)] hover:text-[var(--vsc-accent)] transition-colors duration-200 border border-[var(--vsc-gray-700)] hover:border-[var(--vsc-accent)]"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        BAG
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-[var(--vsc-accent)] text-[var(--vsc-black)] text-[10px] font-bold">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Shop CTA */}
                    <Link
                        href="/#collection"
                        className="hidden md:block px-8 py-4 bg-[var(--vsc-accent)] text-[var(--vsc-black)] text-xs font-bold uppercase tracking-[0.2em] hover:bg-[var(--vsc-black)] hover:text-[var(--vsc-accent)] border-2 border-[var(--vsc-accent)] transition-all duration-200 hover:shadow-[0_0_20px_var(--vsc-accent-dim)]"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        Shop →
                    </Link>
                </div>
            </div>
        </nav>
    )
}
