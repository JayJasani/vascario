"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/context/UserProfileContext";
import {
  MagnifyingGlassIcon,
  HeartIcon,
  ShoppingBagIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CURRENCIES } from "@/lib/currency";

const getFlagUrl = (code: string) =>
  `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
import { useCurrency } from "@/context/CurrencyContext";
import { SearchPanel } from "@/components/SearchPanel";
import { AccountDrawer } from "@/components/AccountDrawer";
import {
  trackCurrencyChange,
  trackOpenSearch,
  trackOpenAccountDrawer,
  trackOpenMobileMenu,
  trackClickNavLink,
} from "@/lib/analytics";

const NAV_LINKS = [
  { href: "/collection", label: "Collection" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/about", label: "About" },
] as const;

export function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { currencyCode, setCurrency } = useCurrency();
  const { getDisplayName, profile } = useUserProfile();

  const displayName = getDisplayName();
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
    if (!mobileMenuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((open) => {
          if (!open) trackOpenSearch();
          return !open;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-[var(--vsc-white)]/95 backdrop-blur-sm border-b border-[var(--vsc-gray-200)]"
        : "bg-[var(--vsc-white)]/90 border-b border-transparent"
        }`}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 md:py-4 md:px-12 lg:px-20">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen((o) => {
              if (!o) trackOpenMobileMenu();
              return !o;
            });
          }}
          className="md:hidden p-2 text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] transition-colors"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6" strokeWidth={1.5} />
          ) : (
            <Bars3Icon className="w-6 h-6" strokeWidth={1.5} />
          )}
        </button>

        {/* Logo — brutalist, cropped feeling */}
        <Link
          href="/"
          prefetch
          onMouseEnter={() => router.prefetch("/")}
          onPointerDown={() => router.prefetch("/")}
          className="text-display flex-1 md:flex-none text-center md:text-left"
        >
          <span
            className="text-xl sm:text-2xl md:text-3xl font-bold tracking-[-0.06em] uppercase text-[var(--vsc-gray-900)]"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            VASC
            <span className="text-[var(--vsc-accent)]">A</span>
            RIO
          </span>
        </Link>

        {/* Nav Links — monospace, minimal */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              onMouseEnter={() => router.prefetch(link.href)}
              onPointerDown={() => router.prefetch(link.href)}
              onClick={() => trackClickNavLink({ link_text: link.label, link_url: link.href, location: "header" })}
              className="text-mono text-xs uppercase tracking-[0.2em] text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] transition-colors duration-200"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side — Currency, Search, Favourites, Cart + User */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          {/* Currency selector — hide on very small screens */}
          <div className="relative hidden sm:block" ref={currencyRef}>
            <button
              type="button"
              onClick={() => setCurrencyOpen((o) => !o)}
              className="flex items-center gap-1 p-1.5 sm:p-2 md:px-3 md:py-2 text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] transition-colors duration-200 border border-transparent rounded"
              aria-label="Select currency"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              <img
                src={getFlagUrl(CURRENCIES[currencyCode]?.flagCode ?? "in")}
                alt=""
                className="w-5 h-[0.75rem] sm:w-6 sm:h-[0.9rem] object-cover rounded-sm"
              />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">{currencyCode}</span>
              <ChevronDownIcon className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${currencyOpen ? "rotate-180" : ""}`} />
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
                      trackCurrencyChange({ from_currency: currencyCode, to_currency: code });
                      setCurrency(code);
                      setCurrencyOpen(false);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`w-full text-left px-4 py-2 text-xs uppercase tracking-wider transition-colors flex items-center gap-2 ${currencyCode === code ? "bg-[var(--vsc-gray-900)] text-[var(--vsc-cream)]" : "text-[var(--vsc-gray-900)] hover:bg-[var(--vsc-cream)]"}`}
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  >
                    <img
                      src={getFlagUrl(c.flagCode)}
                      alt=""
                      className="w-5 h-[0.75rem] object-cover rounded-sm shrink-0"
                    />
                    <span>{code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search icon */}
          <button
            type="button"
            onClick={() => {
              trackOpenSearch();
              setSearchOpen(true);
            }}
            className="p-2 sm:p-3 text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] transition-colors duration-200 border border-transparent"
            aria-label="Search (⌘K)"
          >
            <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
          </button>

          {/* Favourites icon */}
          <Link
            href="/favourites"
            prefetch
            onMouseEnter={() => router.prefetch("/favourites")}
            onPointerDown={() => router.prefetch("/favourites")}
            className="p-2 sm:p-3 text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] transition-colors duration-200 border border-transparent"
            aria-label="View favourites"
          >
            <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
          </Link>

          {/* Cart icon */}
          <Link
            href="/cart"
            prefetch
            onMouseEnter={() => router.prefetch("/cart")}
            onPointerDown={() => router.prefetch("/cart")}
            className="relative p-2 sm:p-3 text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] transition-colors duration-200 border border-transparent"
            aria-label="View bag"
          >
            <ShoppingBagIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center bg-[var(--vsc-gray-900)] text-[var(--vsc-white)] text-[9px] sm:text-[10px] font-bold rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User — mobile: avatar opens drawer; desktop: avatar + name */}
          {user && (
            <button
              type="button"
              onClick={() => {
                trackOpenAccountDrawer();
                setMenuOpen(true);
              }}
              className="md:hidden p-2 text-[var(--vsc-gray-600)] hover:text-[var(--vsc-gray-900)] transition-colors rounded-full"
              aria-label="Account menu"
              aria-expanded={menuOpen}
            >
              <div className="w-8 h-8 rounded-full bg-[var(--vsc-gray-900)] text-[var(--vsc-cream)] flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  userInitial
                )}
              </div>
            </button>
          )}
          {!user && (
            <Link
              href="/login"
              prefetch
              onMouseEnter={() => router.prefetch("/login")}
              onPointerDown={() => router.prefetch("/login")}
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
                onClick={() => {
                  trackOpenAccountDrawer();
                  setMenuOpen(true);
                }}
                className="flex items-center gap-2 p-1 -m-1 rounded text-[var(--vsc-gray-600)] hover:text-[var(--vsc-gray-900)] transition-colors duration-200 border border-transparent"
                aria-label="Account menu"
                aria-expanded={menuOpen}
              >
                <div className="w-7 h-7 rounded-full bg-[var(--vsc-gray-900)] text-[var(--vsc-cream)] flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    userInitial
                  )}
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
                prefetch
                onMouseEnter={() => router.prefetch("/login")}
                onPointerDown={() => router.prefetch("/login")}
                className="text-[10px] text-[var(--vsc-gray-500)] uppercase tracking-[0.18em] hover:text-[var(--vsc-accent)]"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu — portaled to body so it isn't affected by Lenis transform on scroll */}
      {mounted &&
        mobileMenuOpen &&
        createPortal(
          <div className="md:hidden fixed inset-0 top-[73px] z-[60] bg-[var(--vsc-white)] border-t border-[var(--vsc-gray-200)]">
            <div ref={mobileMenuRef} className="h-full overflow-y-auto">
              <nav className="px-6 py-8" style={{ fontFamily: "var(--font-space-mono)" }}>
                <ul className="space-y-6">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        prefetch
                        onMouseEnter={() => router.prefetch(link.href)}
                        onPointerDown={() => router.prefetch(link.href)}
                        onClick={() => {
                          trackClickNavLink({ link_text: link.label, link_url: link.href, location: "mobile_menu" });
                          setMobileMenuOpen(false);
                        }}
                        className="block text-sm uppercase tracking-[0.2em] text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] transition-colors duration-200 py-2"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li className="pt-6 border-t border-[var(--vsc-gray-200)]">
                    <p className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                      Currency
                      <span className="normal-case flex items-center gap-1.5 text-[var(--vsc-gray-700)]">
                        <img
                          src={getFlagUrl(CURRENCIES[currencyCode]?.flagCode ?? "in")}
                          alt=""
                          className="w-4 h-3 object-cover rounded-sm"
                        />
                        {currencyCode}
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(CURRENCIES).map(([code, c]) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            trackCurrencyChange({ from_currency: currencyCode, to_currency: code });
                            setCurrency(code);
                            setMobileMenuOpen(false);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-2 text-[10px] uppercase tracking-wider transition-colors border-2 ${currencyCode === code
                              ? "bg-[var(--vsc-gray-900)] text-[var(--vsc-cream)] border-[var(--vsc-gray-900)]"
                              : "bg-transparent text-[var(--vsc-gray-600)] border-[var(--vsc-gray-200)] hover:border-[var(--vsc-gray-300)]"
                            }`}
                        >
                          <img
                            src={getFlagUrl(c.flagCode)}
                            alt=""
                            className="w-5 h-[0.75rem] object-cover rounded-sm shrink-0"
                          />
                          <span>{code}</span>
                        </button>
                      ))}
                    </div>
                  </li>
                  {!user && (
                    <li className="pt-6 border-t border-[var(--vsc-gray-200)]">
                      <Link
                        href="/login"
                        prefetch
                        onMouseEnter={() => router.prefetch("/login")}
                        onPointerDown={() => router.prefetch("/login")}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-sm uppercase tracking-[0.18em] text-[var(--vsc-gray-500)] hover:text-[var(--vsc-accent)] transition-colors py-2"
                      >
                        Sign in
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </div>,
          document.body
        )}

      <AccountDrawer
        open={menuOpen && !!user}
        onClose={() => setMenuOpen(false)}
        displayName={displayName}
        userEmail={user?.email ?? ""}
        userInitial={userInitial}
        photoURL={profile?.photoURL}
        cartCount={cartCount}
        onLogout={logout}
      />

      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
}
