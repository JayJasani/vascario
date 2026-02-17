"use client";

import { useCart } from "@/context/CartContext";
import {
  MagnifyingGlassIcon,
  HeartIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SearchModal } from "@/components/SearchModal";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount } = useCart();

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeSearch]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-[var(--vsc-white)]/95 backdrop-blur-sm border-b border-[var(--vsc-gray-200)]"
          : "bg-[var(--vsc-white)]/90 border-b border-transparent"
        }`}
    >
      <div className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20">
        {/* Logo — brutalist, cropped feeling */}
        <Link href="/" className="text-display">
          <span
            className="text-2xl md:text-3xl font-bold tracking-[-0.06em] uppercase text-[var(--vsc-gray-900)]"
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
            href="/collection"
            className="text-mono text-xs uppercase tracking-[0.2em] text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] transition-colors duration-200"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Collection
          </Link>
          <Link
            href="/favourites"
            className="text-mono text-xs uppercase tracking-[0.2em] text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] transition-colors duration-200"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Favourites
          </Link>
          <Link
            href="/#editorial"
            className="text-mono text-xs uppercase tracking-[0.2em] text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] transition-colors duration-200"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Lookbook
          </Link>
          <Link
            href="/#about"
            className="text-mono text-xs uppercase tracking-[0.2em] text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] transition-colors duration-200"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            About
          </Link>
        </div>

        {/* Right side — Search, Favourites, Cart + CTA */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            type="button"
            onClick={openSearch}
            className="p-3 text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] transition-colors duration-200 border border-transparent"
            aria-label="Search (⌘K)"
          >
            <MagnifyingGlassIcon className="w-5 h-5" strokeWidth={1.5} />
          </button>

          <Link
            href="/favourites"
            className="p-3 text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] transition-colors duration-200 border border-transparent"
            aria-label="View favourites"
          >
            <HeartIcon className="w-5 h-5" strokeWidth={1.5} />
          </Link>

          <Link
            href="/cart"
            className="relative p-3 text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] transition-colors duration-200 border border-transparent"
            aria-label="View bag"
          >
            <ShoppingBagIcon className="w-5 h-5" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-[var(--vsc-gray-900)] text-[var(--vsc-white)] text-[10px] font-bold rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <SearchModal open={searchOpen} onClose={closeSearch} />
    </nav>
  );
}
