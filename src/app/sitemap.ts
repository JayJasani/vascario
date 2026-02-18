import type { MetadataRoute } from "next"
import { SEO_BASE } from "@/lib/seo-config"
import { getActiveProducts } from "./storefront-actions"

/**
 * Dynamic Sitemap Generation for VASCARIO
 * 
 * Generates sitemap.xml with all public pages and products.
 * Automatically updates when products are added/removed.
 * 
 * Priority levels:
 * - Homepage: 1.0 (highest)
 * - Collection: 0.9
 * - Product pages: 0.8
 * - Important pages (About, Contact): 0.7
 * - Support pages (Shipping, Returns, etc.): 0.6
 * 
 * Change frequency:
 * - Homepage: daily
 * - Collection: daily (new drops)
 * - Products: weekly (stock changes)
 * - Static pages: monthly
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SEO_BASE.siteUrl
  const now = new Date()

  // Static public pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/collection`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/lookbook`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/size-chart`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  // Dynamic product pages
  try {
    const products = await getActiveProducts()
    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/product/${product.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }))

    return [...staticPages, ...productPages]
  } catch (error) {
    console.error("Error generating sitemap:", error)
    // Return static pages even if products fail to load
    return staticPages
  }
}
