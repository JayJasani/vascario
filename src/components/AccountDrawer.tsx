"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  HeartIcon,
  ShoppingBagIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface AccountDrawerProps {
  open: boolean;
  onClose: () => void;
  displayName: string;
  userEmail: string;
  userInitial: string;
  cartCount: number;
  onLogout: () => void;
}

export function AccountDrawer({
  open,
  onClose,
  displayName,
  userEmail,
  userInitial,
  cartCount,
  onLogout,
}: AccountDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (drawerRef.current && !drawerRef.current.contains(target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[120] bg-[var(--vsc-gray-900)]/40 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 bottom-0 z-[125] w-full max-w-sm bg-[var(--vsc-cream)] border-l-2 border-[var(--vsc-gray-200)] shadow-2xl flex flex-col animate-[slide-in-right_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Account menu"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--vsc-gray-200)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--vsc-gray-900)] text-[var(--vsc-cream)] flex items-center justify-center text-sm font-bold">
              {userInitial}
            </div>
            <div>
              <p
                className="text-sm font-medium text-[var(--vsc-gray-900)]"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {displayName || "Account"}
              </p>
              <p
                className="text-[10px] text-[var(--vsc-gray-500)] truncate max-w-[200px]"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {userEmail}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[var(--vsc-gray-500)] hover:text-[var(--vsc-gray-900)] transition-colors"
            aria-label="Close menu"
          >
            <XMarkIcon className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>
        <nav
          className="flex-1 px-4 py-6"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          <ul className="space-y-1">
            <li>
              <Link
                href="/profile"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 text-[var(--vsc-gray-700)] hover:bg-[var(--vsc-gray-100)] hover:text-[var(--vsc-gray-900)] transition-colors text-xs uppercase tracking-[0.18em]"
              >
                <UserCircleIcon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
                Profile
              </Link>
            </li>
            <li>
              <Link
                href="/favourites"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 text-[var(--vsc-gray-700)] hover:bg-[var(--vsc-gray-100)] hover:text-[var(--vsc-gray-900)] transition-colors text-xs uppercase tracking-[0.18em]"
              >
                <HeartIcon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
                Favourites
              </Link>
            </li>
            <li>
              <Link
                href="/cart"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 text-[var(--vsc-gray-700)] hover:bg-[var(--vsc-gray-100)] hover:text-[var(--vsc-gray-900)] transition-colors text-xs uppercase tracking-[0.18em]"
              >
                <ShoppingBagIcon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
                Bag {cartCount > 0 ? `(${cartCount})` : ""}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="border-t border-[var(--vsc-gray-200)] p-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-[var(--vsc-gray-600)] hover:bg-[var(--vsc-gray-100)] hover:text-[var(--vsc-accent)] transition-colors text-xs uppercase tracking-[0.18em]"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            <ArrowRightOnRectangleIcon
              className="w-5 h-5 shrink-0"
              strokeWidth={1.5}
            />
            Sign out
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
