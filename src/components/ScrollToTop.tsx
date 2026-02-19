"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Use multiple requestAnimationFrame calls to ensure DOM is fully ready
    // This is important for Next.js client-side navigation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Try to use Lenis if available (for smooth scrolling)
        const lenisInstance = (window as any).lenis;
        if (lenisInstance) {
          lenisInstance.scrollTo(0, { immediate: true });
        } else {
          // Fallback to native scroll if Lenis is not available
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
          // Also reset scroll position on documentElement for better compatibility
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      });
    });
  }, [pathname]);

  return null;
}

