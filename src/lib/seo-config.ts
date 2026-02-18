import type { Metadata } from "next"

/**
 * Centralized SEO Configuration for Vascario
 * 
 * All SEO metadata, keywords, and descriptions are managed here.
 * Update this file to change SEO across the entire site.
 */

// ─── BASE CONFIGURATION ──────────────────────────────────────────────────────

export const SEO_BASE = {
  siteName: "VASCARIO",
  siteUrl: "https://www.vascario.com",
  defaultTitle: "Premium Embroidered Streetwear | Vascario Luxury Embroidery Clothing India",
  defaultDescription: "Discover Vascario premium embroidered streetwear — luxury cotton tees, hoodies & limited drops. High-quality embroidery clothing designed for modern culture.",
  brandName: "VASCARIO",
  logo: "/v.png",
  twitterHandle: "@vascario", // Update with actual handle if available
}

// ─── KEYWORDS ───────────────────────────────────────────────────────────────

export const SEO_KEYWORDS = {
  primary: [
    "embroidered clothing",
    "luxury streetwear India",
    "embroidered t-shirts",
    "premium embroidery fashion",
    "embroidered hoodie India",
  ],
  secondary: [
    "handcrafted embroidery fashion",
    "luxury cotton streetwear",
    "limited drop clothing brand",
    "premium embroidered tees",
    "Italian cotton streetwear",
    "VASCARIO",
  ],
  all: function() {
    return [...this.primary, ...this.secondary]
  },
}

// ─── PAGE-SPECIFIC SEO CONFIGURATION ─────────────────────────────────────────

export const SEO_PAGES = {
  home: {
    title: "Premium Embroidered Streetwear | Vascario Luxury Embroidery Clothing India",
    description: "Discover Vascario premium embroidered streetwear — luxury cotton tees, hoodies & limited drops. High-quality embroidery clothing designed for modern culture.",
    keywords: SEO_KEYWORDS.all(),
    openGraph: {
      type: "website" as const,
    },
  },

  collection: {
    title: "Embroidered T-Shirts & Hoodies | Premium Streetwear – Vascario",
    description: "Shop premium embroidered t-shirts, hoodies and streetwear from Vascario. Limited drops, luxury fabrics, handcrafted embroidery designs.",
    keywords: [
      "embroidered t-shirts",
      "embroidered hoodies",
      "premium streetwear",
      "limited drop clothing",
      "luxury embroidery",
      ...SEO_KEYWORDS.all(),
    ],
    introText: "Vascario embroidered streetwear combines premium cotton fabrics with luxury embroidery craftsmanship. Our collection features limited drop hoodies and t-shirts designed for comfort, culture and premium style. Each piece showcases handcrafted embroidery techniques, Italian cotton quality, and the attention to detail that defines luxury streetwear.",
  },

  product: {
    titleTemplate: (productName: string) => 
      `${productName} | Premium Embroidered Streetwear — Vascario`,
    descriptionTemplate: (productName: string, productDescription?: string) => 
      productDescription 
        ? `${productDescription.substring(0, 155)}...`
        : `Shop ${productName} — premium embroidered streetwear from Vascario. Luxury cotton, handcrafted embroidery, limited drop.`,
  },

  about: {
    title: "About Vascario | Premium Embroidered Streetwear Brand India",
    description: "Discover the story behind Vascario — premium embroidered streetwear crafted with Italian cotton, luxury embroidery techniques, and limited drop philosophy. Learn about our craftsmanship process and vision.",
    keywords: [
      "embroidered clothing brand",
      "luxury streetwear India",
      "embroidery craftsmanship",
      "Italian cotton fashion",
      "premium embroidery process",
      ...SEO_KEYWORDS.all(),
    ],
  },

  lookbook: {
    title: "Lookbook | Premium Embroidered Streetwear — Vascario",
    description: "Explore Vascario's editorial lookbook featuring premium embroidered streetwear. See how our luxury cotton tees and hoodies are styled in motion.",
    keywords: [
      "embroidered streetwear lookbook",
      "fashion editorial",
      "streetwear styling",
      ...SEO_KEYWORDS.all(),
    ],
  },

  contact: {
    title: "Contact Us | Vascario Premium Streetwear",
    description: "Get in touch with Vascario. Questions about our premium embroidered streetwear, orders, or collaborations? We'd love to hear from you.",
    keywords: [
      "contact Vascario",
      "embroidered clothing support",
      ...SEO_KEYWORDS.all(),
    ],
  },

  shipping: {
    title: "Shipping Information | Vascario",
    description: "Details on Vascario shipping timelines, carriers, and how we handle orders from dispatch to delivery.",
    keywords: [
      "Vascario shipping",
      "embroidered clothing delivery",
      ...SEO_KEYWORDS.all(),
    ],
  },

  returns: {
    title: "Returns & Exchanges | Vascario",
    description: "Information on Vascario returns, exchanges, and how to reach us if something isn't right with your order.",
    keywords: [
      "Vascario returns",
      "embroidered clothing exchange",
      ...SEO_KEYWORDS.all(),
    ],
  },

  sizeChart: {
    title: "Size Chart | Vascario Premium Streetwear",
    description: "Find your perfect fit with Vascario's size chart. Detailed measurements for our premium embroidered streetwear collection.",
    keywords: [
      "Vascario size chart",
      "embroidered clothing sizing",
      ...SEO_KEYWORDS.all(),
    ],
  },

  privacy: {
    title: "Privacy Policy | Vascario",
    description: "Vascario's privacy policy outlining how we collect, use, and protect your personal information.",
    keywords: [],
  },

  terms: {
    title: "Terms of Service | Vascario",
    description: "Read Vascario's terms of service to understand the conditions that govern use of this site and our services.",
    keywords: [],
  },

  favourites: {
    title: "Favourites | Saved Items — Vascario",
    description: "View your saved favourite embroidered streetwear pieces from Vascario.",
    keywords: [
      "saved items",
      "favourites",
      ...SEO_KEYWORDS.all(),
    ],
  },

  cart: {
    title: "Shopping Cart | Vascario",
    description: "Review your selected premium embroidered streetwear items before checkout.",
    keywords: [],
  },

  checkout: {
    title: "Checkout | Complete Your Order — Vascario",
    description: "Complete your purchase of premium embroidered streetwear from Vascario.",
    keywords: [],
  },

  profile: {
    title: "My Profile | Account Settings — Vascario",
    description: "Manage your Vascario account settings, orders, and preferences.",
    keywords: [],
  },
}

// ─── METADATA GENERATOR FUNCTIONS ────────────────────────────────────────────

/**
 * Generate complete metadata object for a page
 */
export function generateMetadata(config: {
  title: string
  description: string
  keywords?: string[]
  type?: "website" | "product" | "article"
  images?: string[]
  url?: string
  noindex?: boolean
}): Metadata {
  const {
    title,
    description,
    keywords = [],
    type = "website",
    images = [],
    url,
    noindex = false,
  } = config

  const fullTitle = title.includes(SEO_BASE.brandName) 
    ? title 
    : `${title} — ${SEO_BASE.brandName}`

  const ogImage = images.length > 0 ? images[0] : SEO_BASE.logo
  const pageUrl = url || SEO_BASE.siteUrl

  const openGraphConfig: any = {
    title: fullTitle,
    description,
    url: pageUrl,
    siteName: SEO_BASE.siteName,
    images: images.length > 0 ? images : [{ url: ogImage }],
  }

  // Only add type if it's website or article (product type handled differently)
  if (type === "website" || type === "article") {
    openGraphConfig.type = type
  }

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : SEO_KEYWORDS.all(),
    robots: noindex ? "noindex, nofollow" : "index, follow",
    openGraph: openGraphConfig,
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: images.length > 0 ? images : [],
    },
    icons: {
      icon: SEO_BASE.logo,
      shortcut: SEO_BASE.logo,
      apple: SEO_BASE.logo,
    },
  }
}

/**
 * Generate metadata for homepage
 */
export function getHomeMetadata(): Metadata {
  return generateMetadata({
    ...SEO_PAGES.home,
    url: SEO_BASE.siteUrl,
  })
}

/**
 * Generate metadata for collection page
 */
export function getCollectionMetadata(): Metadata {
  return generateMetadata({
    ...SEO_PAGES.collection,
    url: `${SEO_BASE.siteUrl}/collection`,
  })
}

/**
 * Generate metadata for product page
 */
export function getProductMetadata(product: {
  name: string
  description?: string
  images?: string[]
}): Metadata {
  return generateMetadata({
    title: SEO_PAGES.product.titleTemplate(product.name),
    description: SEO_PAGES.product.descriptionTemplate(product.name, product.description),
    type: "product",
    images: product.images || [],
    url: `${SEO_BASE.siteUrl}/product/${product.name.toLowerCase().replace(/\s+/g, "-")}`,
  })
}

/**
 * Generate metadata for any page by key
 */
export function getPageMetadata(pageKey: keyof typeof SEO_PAGES, overrides?: Partial<{
  title: string
  description: string
  keywords: string[]
  url: string
}>): Metadata {
  const pageConfig = SEO_PAGES[pageKey]
  
  if (!pageConfig || !("title" in pageConfig)) {
    throw new Error(`Invalid page key: ${pageKey}`)
  }

  return generateMetadata({
    title: overrides?.title || pageConfig.title,
    description: overrides?.description || pageConfig.description,
    keywords: overrides?.keywords || (pageConfig.keywords || []),
    url: overrides?.url || `${SEO_BASE.siteUrl}/${pageKey}`,
  })
}

// ─── IMAGE ALT TEXT GENERATORS ───────────────────────────────────────────────

export const SEO_IMAGE_ALT = {
  product: (productName: string, imageIndex?: number, totalImages?: number) => {
    const suffix = imageIndex !== undefined && totalImages !== undefined
      ? ` - ${imageIndex + 1} of ${totalImages}`
      : ""
    return `Premium ${productName} embroidered streetwear by Vascario${suffix}`
  },

  productThumbnail: (productName: string, index: number) => 
    `${productName} thumbnail view ${index + 1} - Premium embroidered streetwear by Vascario`,

  lookbook: (productName: string) => 
    `${productName} - Premium embroidered streetwear lookbook by Vascario`,

  editorial: () => 
    "Close-up detail of premium embroidered streetwear showing handcrafted embroidery craftsmanship by Vascario",

  logo: () => "VASCARIO logo - Premium embroidered streetwear brand",
}

// ─── STRUCTURED DATA CONFIGURATION ────────────────────────────────────────────

export const SEO_STRUCTURED_DATA = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SEO_BASE.brandName,
    url: SEO_BASE.siteUrl,
    logo: `${SEO_BASE.siteUrl}${SEO_BASE.logo}`,
    description: SEO_BASE.defaultDescription,
  },

  product: (product: {
    id: string
    name: string
    description: string
    price: number
    images: string[]
    sku?: string | null
    totalStock: number
  }) => ({
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: SEO_BASE.brandName,
    },
    image: product.images.map(img => img.startsWith("http") ? img : `${SEO_BASE.siteUrl}${img}`),
    sku: product.sku || product.id,
    offers: {
      "@type": "Offer",
      url: `${SEO_BASE.siteUrl}/product/${product.id}`,
      priceCurrency: "INR",
      price: product.price.toString(),
      availability: product.totalStock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  }),

  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SEO_BASE.siteUrl}${item.url}`,
    })),
  }),
}
