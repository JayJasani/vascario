import type { MetadataRoute } from "next"
import { SEO_BASE } from "@/lib/seo-config"

/**
 * Advanced Robots.txt Configuration for VASCARIO
 * 
 * Enhanced SEO optimization for 2025:
 * - Google-Extended support for AI features (Gemini, AI Overviews)
 * - Optimized crawl budget management
 * - Specific rules for different search engine bots
 * - Prevents duplicate content from URL parameters
 * - Blocks low-value pages to focus crawl budget on important content
 * 
 * Key Features:
 * - Google-Extended: Enables content in Google AI features (350M+ users)
 * - Googlebot-Image: Optimized image crawling for visual search
 * - Googlebot-Mobile: Mobile-first indexing optimization
 * - Crawl-delay: Prevents server overload from aggressive crawlers
 * - Comprehensive disallow rules for e-commerce best practices
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = SEO_BASE.siteUrl

  // Common disallow paths for all bots (strictly private / system paths)
  const commonDisallow = [
    "/admin",
    "/admin/*",
    "/api",
    "/api/*",
    // Block search parameters and filters that create duplicate content
    "/*?search=*",
    "/*?filter=*",
    "/*?sort=*",
    "/*?page=*",
    "/*?ref=*",
    "/*?utm_*",
    "/*?fbclid=*",
    "/*?gclid=*",
    // Block session/tracking parameters
    "/*?session=*",
    "/*?token=*",
    "/*?preview=*",
    // Block internal search results
    "/search",
    "/search/*",
  ]

  return {
    rules: [
      // Google-Extended: Critical for 2025 AI features (Gemini, AI Overviews)
      // 57% of top-10K domains allow this - zero impact on organic rankings
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: [
          ...commonDisallow,
          // Allow AI to access product pages and content
        ],
      },
      // Googlebot-Image: Optimize image crawling for Google Images and visual search
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: [
          ...commonDisallow,
          // Allow images on all public pages
        ],
      },
      // Googlebot-Mobile: Mobile-first indexing optimization
      {
        userAgent: "Googlebot-Mobile",
        allow: "/",
        disallow: commonDisallow,
      },
      // Main Googlebot: Full access to public content
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: commonDisallow,
      },
      // Bingbot: Optimize for Bing search
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: commonDisallow,
      },
      // Yandex: Russian search engine
      {
        userAgent: "Yandex",
        allow: "/",
        disallow: commonDisallow,
      },
      // Baiduspider: Chinese search engine (important for international reach)
      // Note: crawlDelay helps prevent server overload from aggressive crawling
      {
        userAgent: "Baiduspider",
        allow: "/",
        disallow: commonDisallow,
        crawlDelay: 1,
      },
      // Facebook External Hit: For social media previews
      {
        userAgent: "facebookexternalhit",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api",
          "/api/*",
        ],
      },
      // Twitter Bot: For Twitter card previews
      {
        userAgent: "Twitterbot",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api",
          "/api/*",
        ],
      },
      // LinkedIn Bot: For LinkedIn previews
      {
        userAgent: "LinkedInBot",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api",
          "/api/*",
        ],
      },
      // Instagram Bot: For Instagram link previews
      {
        userAgent: "Instagram",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api",
          "/api/*",
        ],
      },
      // Aggressive SEO crawlers: Block to preserve crawl budget
      // These bots consume resources without providing SEO value
      {
        userAgent: "AhrefsBot",
        disallow: "/",
      },
      {
        userAgent: "SemrushBot",
        disallow: "/",
      },
      {
        userAgent: "MJ12bot",
        disallow: "/",
      },
      {
        userAgent: "DotBot",
        disallow: "/",
      },
      {
        userAgent: "BLEXBot",
        disallow: "/",
      },
      {
        userAgent: "PetalBot",
        disallow: "/",
      },
      // Default rule for all other bots
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          ...commonDisallow,
          // Additional protection for unknown bots
          "/*.json$",
          "/*.xml$",
          "/_next",
          "/_next/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl.replace("https://", "").replace("http://", ""), // Canonical host
  }
}
