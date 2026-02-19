"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  // Disable browser scroll restoration on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // Use useLayoutEffect for synchronous execution before browser paint
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    
    // Immediately reset scroll position synchronously
    const lenisInstance = (window as any).lenis;
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true });
    }
    
    // Also reset native scroll positions
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Force scroll reset on the scroll container if it exists
    const scrollContainer = document.querySelector('[data-lenis-root]') || document.documentElement;
    if (scrollContainer) {
      (scrollContainer as HTMLElement).scrollTop = 0;
    }
  }, [pathname]);

  // Additional effect to handle cases where content loads after initial render
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Multiple attempts to ensure scroll happens even with late-loading content
    const scrollToTop = () => {
      const lenisInstance = (window as any).lenis;
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { immediate: true });
      }
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const scrollContainer = document.querySelector('[data-lenis-root]') || document.documentElement;
      if (scrollContainer) {
        (scrollContainer as HTMLElement).scrollTop = 0;
      }
    };

    // Immediate
    scrollToTop();
    
    // After next frame
    requestAnimationFrame(() => {
      scrollToTop();
      // After another frame
      requestAnimationFrame(() => {
        scrollToTop();
      });
    });

    // Also check after delays to catch late-loading content
    const timeout1 = setTimeout(scrollToTop, 50);
    const timeout2 = setTimeout(scrollToTop, 150);
    const timeout3 = setTimeout(scrollToTop, 300);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [pathname]);

  return null;
}

