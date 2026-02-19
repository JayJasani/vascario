"use client";

import { useEffect } from "react";

interface ResourcePreloaderProps {
  images?: string[];
}

/**
 * Preloads critical images from Firebase Storage (API) for faster loading.
 * Uses link preload for better browser caching. This ensures API-served images
 * are cached and loaded quickly, just like local assets.
 */
export function ResourcePreloader({ images = [] }: ResourcePreloaderProps) {
  useEffect(() => {
    // Preload images from Firebase Storage (API)
    images.forEach((src) => {
      // Check if link already exists to avoid duplicates
      const existingLink = document.querySelector(`link[href="${src}"]`);
      if (!existingLink && src) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = src;
        // Add cache hints for Firebase Storage images
        link.setAttribute("fetchpriority", "high");
        document.head.appendChild(link);
      }
    });

    // Note: We don't clean up preload links as they should persist for the page lifecycle
    // The browser will handle cache management automatically
  }, [images]);

  return null;
}
