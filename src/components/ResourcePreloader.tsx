"use client";

import { useEffect } from "react";

interface ResourcePreloaderProps {
  images?: string[];
  videos?: string[];
}

/**
 * Preloads critical images and videos from Firebase Storage (API) for faster loading.
 * Uses link preload for better browser caching. This ensures API-served assets
 * are cached and loaded quickly, just like local assets.
 */
export function ResourcePreloader({ images = [], videos = [] }: ResourcePreloaderProps) {
  useEffect(() => {
    // Preload images from Firebase Storage (API)
    images.forEach((src) => {
      const existingLink = document.querySelector(`link[href="${src}"][as="image"]`);
      if (!existingLink && src) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = src;
        link.setAttribute("fetchpriority", "high");
        document.head.appendChild(link);
      }
    });

    // Preload videos (e.g. hero section) so they start buffering immediately
    videos.forEach((src) => {
      const existingLink = document.querySelector(`link[href="${src}"][as="video"]`);
      if (!existingLink && src) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "video";
        link.href = src;
        link.setAttribute("fetchpriority", "high");
        document.head.appendChild(link);
      }
    });
  }, [images, videos]);

  return null;
}
