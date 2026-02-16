"use client";

import { useCart } from "@/context/CartContext";
import {
  MagnifyingGlassIcon,
  HeartIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { searchItems, type SearchItem } from "@/lib/search-data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { cartCount } = useCart();

  const openSearch = useCallback(() => {
    setSearchOpen(true);
    setSearchQuery("");
    setResults([]);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery("");
    setResults([]);
  }, []);

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
        setSearchOpen((open) => {
          if (!open) setTimeout(() => inputRef.current?.focus(), 0);
          return !open;
        });
      }
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeSearch]);

  useEffect(() => {
    const items = searchItems(searchQuery);
    setResults(items);
  }, [searchQuery]);

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) closeSearch();
  };

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
          {/* Search icon */}
          <button
            type="button"
            onClick={openSearch}
            className="p-3 text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] transition-colors duration-200 border border-transparent"
            aria-label="Search (⌘K)"
          >
            <MagnifyingGlassIcon className="w-5 h-5" strokeWidth={1.5} />
          </button>

          {/* Favourites icon */}
          <Link
            href="/favourites"
            className="p-3 text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] transition-colors duration-200 border border-transparent"
            aria-label="View favourites"
          >
            <HeartIcon className="w-5 h-5" strokeWidth={1.5} />
          </Link>

          {/* Cart icon */}
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

          {/* Shop CTA */}
          <Link
            href="/collection"
            className="hidden md:block px-8 py-4 bg-[var(--vsc-gray-900)] !text-[var(--vsc-cream)] text-xs font-bold uppercase tracking-[0.2em] hover:bg-[var(--vsc-gray-800)] hover:!text-[var(--vsc-white)] border-2 border-[var(--vsc-gray-900)] transition-all duration-200 hover:shadow-[0_0_20px_var(--vsc-accent-dim)]"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Shop →
          </Link>
        </div>
      </div>

      {/* Spotlight-style Search Panel */}
      {searchOpen && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-[var(--vsc-gray-900)]/40 backdrop-blur-md animate-[fade-in_0.2s_ease-out]"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <div
            className="w-full max-w-2xl bg-[var(--vsc-cream)] border border-[var(--vsc-gray-200)] shadow-2xl overflow-hidden animate-[fade-in_0.15s_ease-out]"
            style={{ animationDelay: "50ms" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input row — Spotlight style */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--vsc-gray-200)]">
              <MagnifyingGlassIcon
                className="w-5 h-5 shrink-0 text-[var(--vsc-gray-500)]"
                strokeWidth={1.5}
              />
              <input
                ref={inputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collections, products..."
                className="flex-1 bg-transparent text-[var(--vsc-gray-900)] placeholder-[var(--vsc-gray-400)] text-base outline-none"
                style={{ fontFamily: "var(--font-space-mono)" }}
                autoComplete="off"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-[10px] text-[var(--vsc-gray-500)] bg-[var(--vsc-gray-100)] border border-[var(--vsc-gray-300)] uppercase tracking-wider">
                esc
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {searchQuery.trim() ? (
                results.length > 0 ? (
                  <ul className="py-2">
                    {results.map((item) => (
                      <li key={`${item.type}-${item.id}`}>
                        <Link
                          href={item.url}
                          onClick={closeSearch}
                          className="flex items-center gap-4 px-5 py-3 text-[var(--vsc-gray-700)] hover:bg-[var(--vsc-gray-100)] hover:text-[var(--vsc-gray-900)] transition-colors duration-150 group"
                        >
                          <div className="w-10 h-10 shrink-0 bg-[var(--vsc-gray-100)] border border-[var(--vsc-gray-200)] flex items-center justify-center overflow-hidden">
                            <span className="text-[10px] text-[var(--vsc-gray-500)] uppercase">
                              {item.type === "category" ? "cat" : "prod"}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span
                              className="block truncate font-medium text-[var(--vsc-gray-900)] group-hover:text-[var(--vsc-accent)]"
                              style={{ fontFamily: "var(--font-space-grotesk)" }}
                            >
                              {item.name}
                            </span>
                            <span
                              className="text-[10px] text-[var(--vsc-gray-500)] uppercase tracking-wider"
                              style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                              {item.type} {item.tag && `· ${item.tag}`}
                            </span>
                          </div>
                          {item.price != null && (
                            <span
                              className="text-sm font-bold text-[var(--vsc-gray-900)]"
                              style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                              ${item.price}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div
                    className="py-12 px-5 text-center text-[var(--vsc-gray-500)] text-sm"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  >
                    No results for &quot;{searchQuery}&quot;
                  </div>
                )
              ) : (
                <div
                  className="py-12 px-5 text-center text-[var(--vsc-gray-500)] text-sm"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  Start typing to search collections and products
                  <br />
                  <span className="text-[10px] mt-2 block">⌘K to open · Esc to close</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
