"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { type SearchItem } from "@/lib/search-data";
import { searchItems } from "@/app/storefront-actions";
import { useCurrency } from "@/context/CurrencyContext";

interface SearchPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SearchPanel({ open, onClose }: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (open) {
      setSearchQuery("");
      setResults([]);
      setIsSearching(false);
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    let cancelled = false;
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const items = await searchItems(searchQuery);
        if (!cancelled) {
          setResults(items);
          setIsSearching(false);
        }
      } catch (error) {
        console.error("Search error:", error);
        if (!cancelled) {
          setResults([]);
          setIsSearching(false);
        }
      }
    };
    const timeoutId = setTimeout(performSearch, 300);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-3 sm:px-4 bg-[var(--vsc-gray-900)]/40 backdrop-blur-md animate-[fade-in_0.2s_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className="w-full max-w-2xl bg-[var(--vsc-cream)] border border-[var(--vsc-gray-200)] shadow-2xl overflow-hidden animate-[fade-in_0.15s_ease-out]"
        style={{ animationDelay: "50ms" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-[var(--vsc-gray-200)]">
          <MagnifyingGlassIcon
            className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-[var(--vsc-gray-500)]"
            strokeWidth={1.5}
          />
          <input
            ref={inputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-[var(--vsc-gray-900)] placeholder-[var(--vsc-gray-400)] text-sm sm:text-base outline-none"
            style={{ fontFamily: "var(--font-space-mono)" }}
            autoComplete="off"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-[10px] text-[var(--vsc-gray-500)] bg-[var(--vsc-gray-100)] border border-[var(--vsc-gray-300)] uppercase tracking-wider">
            esc
          </kbd>
        </div>

        <div className="max-h-[70vh] sm:max-h-[60vh] overflow-y-auto">
          {searchQuery.trim() ? (
            isSearching ? (
              <div
                className="py-8 sm:py-12 px-4 sm:px-5 text-center text-[var(--vsc-gray-500)] text-xs sm:text-sm"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Searching...
              </div>
            ) : results.length > 0 ? (
              <ul className="py-1 sm:py-2">
                {results.map((item) => (
                  <li key={`${item.type}-${item.id}`}>
                    <Link
                      href={item.url}
                      onClick={onClose}
                      className="flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-2.5 sm:py-3 text-[var(--vsc-gray-700)] hover:bg-[var(--vsc-gray-100)] hover:text-[var(--vsc-gray-900)] transition-colors duration-150 group"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 bg-[var(--vsc-gray-100)] border border-[var(--vsc-gray-200)] flex items-center justify-center overflow-hidden">
                        <span className="text-[9px] sm:text-[10px] text-[var(--vsc-gray-500)] uppercase">
                          prod
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className="block truncate font-medium text-sm sm:text-base text-[var(--vsc-gray-900)] group-hover:text-[var(--vsc-accent)]"
                          style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                          {item.name}
                        </span>
                        <span
                          className="text-[9px] sm:text-[10px] text-[var(--vsc-gray-500)] uppercase tracking-wider"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          {item.type} {item.tag && `· ${item.tag}`}
                        </span>
                      </div>
                      {item.price != null && (
                        <span
                          className="text-xs sm:text-sm font-bold text-[var(--vsc-gray-900)] shrink-0"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          {formatPrice(item.price)}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div
                className="py-8 sm:py-12 px-4 sm:px-5 text-center text-[var(--vsc-gray-500)] text-xs sm:text-sm"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                No results for &quot;{searchQuery}&quot;
              </div>
            )
          ) : (
            <div
              className="py-8 sm:py-12 px-4 sm:px-5 text-center text-[var(--vsc-gray-500)] text-xs sm:text-sm"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Start typing to search products
              <br />
              <span className="text-[9px] sm:text-[10px] mt-2 block">⌘K to open · Esc to close</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
