import type { MetadataRoute } from "next"
import { SEO_BASE } from "@/lib/seo-config"

/**
 * Robots.txt Configuration for VASCARIO
 * 
 * Controls search engine crawling behavior:
 * - Allows all public pages
 * - Blocks admin and API routes
 * - Points to sitemap for efficient indexing
 * 
 * Custom rules for different bots:
 * - Googlebot: Full access to public content
 * - Bingbot: Full access to public content
 * - All others: Standard rules apply
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = SEO_BASE.siteUrl

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api",
          "/checkout",
          "/cart",
          "/profile",
          "/favourites",
          "/order-success",
          "/login",
          // Block search parameters and filters that create duplicate content
          "/collection?*",
          "/product?*",
        ],
      },
      // Optimize for Googlebot
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin",
          "/api",
          "/checkout",
          "/cart",
          "/profile",
          "/favourites",
          "/order-success",
          "/login",
        ],
      },
      // Optimize for Bingbot
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: [
          "/admin",
          "/api",
          "/checkout",
          "/cart",
          "/profile",
          "/favourites",
          "/order-success",
          "/login",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
