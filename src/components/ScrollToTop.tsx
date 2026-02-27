"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  // Ensure browser scroll restoration is manual so we control it
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // On route change, gently reset scroll position once.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollToTop = () => {
      const lenisInstance = (window as any).lenis;
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { immediate: true });
      }
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    scrollToTop();
  }, [pathname]);

  return null;
}

