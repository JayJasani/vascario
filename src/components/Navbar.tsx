"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  MagnifyingGlassIcon,
  HeartIcon,
  ShoppingBagIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CURRENCIES } from "@/lib/currency";
import { useCurrency } from "@/context/CurrencyContext";
import { SearchPanel } from "@/components/SearchPanel";
import { AccountDrawer } from "@/components/AccountDrawer";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDisplayName, setProfileDisplayName] = useState<string>("");
  const currencyRef = useRef<HTMLDivElement>(null);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { currencyCode, setCurrency } = useCurrency();

  const displayName =
    profileDisplayName ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "";
  const userInitial = displayName
    ? displayName.charAt(0).toUpperCase()
    : "?";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!currencyOpen) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (currencyRef.current && !currencyRef.current.contains(target)) {
        setCurrencyOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [currencyOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setProfileDisplayName("");
        return;
      }
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const fromDb =
          (data.displayName as string | undefined) ||
          [data.firstName, data.lastName].filter(Boolean).join(" ").trim();
        if (fromDb) {
          setProfileDisplayName(fromDb);
        }
      } catch {
        // ignore, fall back to auth displayName/email
      }
    };

    const handleProfileUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{
        displayName?: string;
        firstName?: string;
        lastName?: string;
      }>).detail;
      const fromEvent =
        detail.displayName?.trim() ||
        [detail.firstName, detail.lastName].filter(Boolean).join(" ").trim();
      if (fromEvent) {
        setProfileDisplayName(fromEvent);
      }
    };

    loadProfile();
    window.addEventListener(
      "vascario:profile-updated",
      handleProfileUpdated as EventListener
    );
    return () => {
      window.removeEventListener(
        "vascario:profile-updated",
        handleProfileUpdated as EventListener
      );
    };
  }, [user]);

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
            href="/lookbook"
            className="text-mono text-xs uppercase tracking-[0.2em] text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] transition-colors duration-200"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Lookbook
          </Link>
          <Link
            href="/about"
            className="text-mono text-xs uppercase tracking-[0.2em] text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] transition-colors duration-200"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            About
          </Link>
        </div>

        {/* Right side — Currency, Search, Favourites, Cart + User */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Currency selector */}
          <div className="relative" ref={currencyRef}>
            <button
              type="button"
              onClick={() => setCurrencyOpen((o) => !o)}
              className="flex items-center gap-1 p-2 md:px-3 md:py-2 text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] transition-colors duration-200 border border-transparent rounded"
              aria-label="Select currency"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              <span className="text-xs font-bold uppercase tracking-wider">{currencyCode}</span>
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${currencyOpen ? "rotate-180" : ""}`} />
            </button>
            {currencyOpen && (
              <div
                className="absolute right-0 top-full mt-1 py-1 min-w-[140px] bg-[var(--vsc-white)] border-2 border-[var(--vsc-gray-200)] shadow-lg z-[200]"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                role="listbox"
                aria-label="Select currency"
              >
                {Object.entries(CURRENCIES).map(([code, c]) => (
                  <button
                    key={code}
                    type="button"
                    role="option"
                    aria-selected={currencyCode === code}
                    onClick={() => {
                      setCurrency(code);
                      setCurrencyOpen(false);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`w-full text-left px-4 py-2 text-xs uppercase tracking-wider transition-colors ${currencyCode === code ? "bg-[var(--vsc-gray-900)] text-[var(--vsc-cream)]" : "text-[var(--vsc-gray-900)] hover:bg-[var(--vsc-cream)]"}`}
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  >
                    {c.symbol} {code}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search icon */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
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

          {/* User — mobile: avatar opens drawer; desktop: avatar + name */}
          {user && (
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2 text-[var(--vsc-gray-600)] hover:text-[var(--vsc-gray-900)] transition-colors rounded-full"
              aria-label="Account menu"
              aria-expanded={menuOpen}
            >
              <div className="w-8 h-8 rounded-full bg-[var(--vsc-gray-900)] text-[var(--vsc-cream)] flex items-center justify-center text-xs font-bold">
                {userInitial}
              </div>
            </button>
          )}
          {!user && (
            <Link
              href="/login"
              className="md:hidden p-3 text-[var(--vsc-gray-500)] hover:text-[var(--vsc-accent)] text-[10px] uppercase tracking-[0.18em]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Sign in
            </Link>
          )}
          <div className="hidden md:flex items-center gap-2 pl-3 ml-1 border-l border-[var(--vsc-gray-200)]">
            {user ? (
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="flex items-center gap-2 p-1 -m-1 rounded text-[var(--vsc-gray-600)] hover:text-[var(--vsc-gray-900)] transition-colors duration-200 border border-transparent"
                aria-label="Account menu"
                aria-expanded={menuOpen}
              >
                <div className="w-7 h-7 rounded-full bg-[var(--vsc-gray-900)] text-[var(--vsc-cream)] flex items-center justify-center text-xs font-bold">
                  {userInitial}
                </div>
                <span
                  className="text-[10px] uppercase tracking-[0.18em] max-w-[12ch] truncate"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                  title={displayName || user?.email || undefined}
                >
                  {displayName}
                </span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
              </button>
            ) : (
              <Link
                href="/login"
                className="text-[10px] text-[var(--vsc-gray-500)] uppercase tracking-[0.18em] hover:text-[var(--vsc-accent)]"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>

      <AccountDrawer
        open={menuOpen && !!user}
        onClose={() => setMenuOpen(false)}
        displayName={displayName}
        userEmail={user?.email ?? ""}
        userInitial={userInitial}
        cartCount={cartCount}
        onLogout={logout}
      />

      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
}
