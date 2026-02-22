"use client";

import Image from "next/image";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getImageAlt } from "@/lib/seo-utils";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { useEffect, useRef, useState } from "react";
import { hasDiscount } from "@/lib/discount";
import { type SearchItem } from "@/lib/search-data";
import { searchItems, getFeaturedSearchItems } from "@/app/storefront-actions";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
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
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const performSearch = async () => {
      if (!searchQuery.trim()) {
        const items = await getFeaturedSearchItems();
        if (!cancelled) {
          setResults(items);
          setIsSearching(false);
        }
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

    // When query is empty, load featured immediately when search opens
    if (!searchQuery.trim()) {
      performSearch();
      return () => { cancelled = true; };
    }

    const timeoutId = setTimeout(performSearch, 300);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [open, searchQuery]);

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
            placeholder="Search products..."
            className="flex-1 bg-transparent text-[var(--vsc-gray-900)] placeholder-[var(--vsc-gray-400)] text-base outline-none"
            style={{ fontFamily: "var(--font-space-mono)" }}
            autoComplete="off"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-[10px] text-[var(--vsc-gray-500)] bg-[var(--vsc-gray-100)] border border-[var(--vsc-gray-300)] uppercase tracking-wider">
            esc
          </kbd>
          <button
            type="button"
            onClick={onClose}
            className="sm:hidden p-2 -m-2 text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] transition-colors"
            aria-label="Close search"
          >
            <XMarkIcon className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {searchQuery.trim() ? (
            isSearching ? (
              <div
                className="py-12 px-5 text-center text-[var(--vsc-gray-500)] text-sm"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Searching...
              </div>
            ) : results.length > 0 ? (
              <ul className="py-2">
                {results.map((item) => (
                  <li key={`${item.type}-${item.id}`}>
                    <Link
                      href={item.url}
                      onClick={onClose}
                      className="flex items-center gap-4 px-5 py-3 text-[var(--vsc-gray-700)] hover:bg-[var(--vsc-gray-100)] hover:text-[var(--vsc-gray-900)] transition-colors duration-150 group"
                    >
                      <div className="relative w-14 h-14 shrink-0 bg-[var(--vsc-gray-100)] border border-[var(--vsc-gray-200)] overflow-hidden">
                        {item.image && !item.image.includes("placeholder") ? (
                          <Image
                            src={item.image}
                            alt={getImageAlt("product", item.name)}
                            fill
                            className="object-cover object-center"
                            sizes="56px"
                          />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-[10px] text-[var(--vsc-gray-500)] uppercase">
                            prod
                          </span>
                        )}
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
                        <div className="flex items-center gap-2 shrink-0">
                          {item.price != null && hasDiscount(item.cutPrice, item.price) && (
                            <span
                              className="text-xs text-[var(--vsc-gray-500)] line-through"
                              style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                              {formatPrice(item.cutPrice!)}
                            </span>
                          )}
                          <span
                            className="text-sm font-bold text-[var(--vsc-gray-900)]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            {formatPrice(item.price)}
                          </span>
                        </div>
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
          ) : results.length > 0 ? (
            <>
              <div
                className="px-5 pt-4 pb-1 font-mono text-[10px] text-[var(--vsc-gray-500)] tracking-[0.15em] uppercase"
              >
                Featured
              </div>
              <ul className="py-2">
                {results.map((item) => (
                  <li key={`${item.type}-${item.id}`}>
                    <Link
                      href={item.url}
                      onClick={onClose}
                      className="flex items-center gap-4 px-5 py-3 text-[var(--vsc-gray-700)] hover:bg-[var(--vsc-gray-100)] hover:text-[var(--vsc-gray-900)] transition-colors duration-150 group"
                    >
                      <div className="relative w-14 h-14 shrink-0 bg-[var(--vsc-gray-100)] border border-[var(--vsc-gray-200)] overflow-hidden">
                        {item.image && !item.image.includes("placeholder") ? (
                          <Image
                            src={item.image}
                            alt={getImageAlt("product", item.name)}
                            fill
                            className="object-cover object-center"
                            sizes="56px"
                          />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-[10px] text-[var(--vsc-gray-500)] uppercase">
                            prod
                          </span>
                        )}
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
                        <div className="flex items-center gap-2 shrink-0">
                          {item.price != null && hasDiscount(item.cutPrice, item.price) && (
                            <span
                              className="text-xs text-[var(--vsc-gray-500)] line-through"
                              style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                              {formatPrice(item.cutPrice!)}
                            </span>
                          )}
                          <span
                            className="text-sm font-bold text-[var(--vsc-gray-900)]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div
              className="py-12 px-5 text-center text-[var(--vsc-gray-500)] text-sm"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Start typing to search products
              <br />
              <span className="text-[10px] mt-2 block">⌘K to open · Esc to close</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
