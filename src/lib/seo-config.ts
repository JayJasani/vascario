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
  defaultTitle: "Premium Embroidery Streetwear India | Top Embroidery Brand — Vascario Luxury Clothing",
  defaultDescription: "Vascario — India's top premium embroidery streetwear brand. Everyday luxury streetwear, limited drops, handcrafted kantha embroidery. Best embroidery clothing & embroidered t-shirts. Sustainable, cultural storytelling fashion. Free shipping.",
  brandName: "VASCARIO",
  logo: "/v.png",
  twitterHandle: "@vascario", // Update with actual handle if available
  // Social profiles for structured data
  socialProfiles: {
    twitter: "https://twitter.com/vascario", // Update with actual URL
    instagram: "https://instagram.com/vascario", // Update with actual URL
    facebook: "https://facebook.com/vascario", // Update with actual URL
  },
  // Contact information for structured data
  contact: {
    email: "hello@vascario.com", // Update with actual email
    phone: "+91-XXXXXXXXXX", // Update with actual phone
  },
}

// ─── KEYWORDS ───────────────────────────────────────────────────────────────
// 
// POWERFUL KEYWORD STRATEGY FOR #1 RANKINGS
// 
// Strategy:
// - High-intent buyer keywords (buy, shop, best, online)
// - Location-specific (India, Mumbai, Delhi, Bangalore)
// - Brand + product combinations
// - Comparison keywords (best, top, vs)
// - Price-sensitive keywords
// - Trending fashion keywords
// - Long-tail high-conversion phrases

export const SEO_KEYWORDS = {
  // PRIMARY: High-volume, high-intent keywords targeting #1 rankings
  primary: [
    // Ultra high-volume embroidery keywords (135K–27K monthly searches)
    "custom embroidery",
    "embroidery designs",
    "embroidery shop",
    "emb design",
    "embro design",
    "machine embroidery designs",
    "embroidery for beginners",
    // PREMIUM EMBROIDERY STREETWEAR (target keyword + variations)
    "premium embroidery streetwear",
    "premium embroidered streetwear",
    "best premium embroidery streetwear",
    "top premium embroidery streetwear",
    "premium embroidery streetwear India",
    "best embroidery streetwear brand",
    "top embroidery streetwear brand",
    // Core product keywords
    "embroidered clothing",
    "luxury streetwear India",
    "embroidered t-shirts",
    "premium embroidery fashion",
    "embroidered hoodie India",
    "handcrafted embroidery clothing",
    "luxury embroidered streetwear",
    "premium embroidered menswear",
    "Indian luxury streetwear brand",
    "embroidered cotton t-shirts",
    "limited edition streetwear",
    "artisanal embroidery fashion",
    
    // High-intent buyer keywords (HIGH CONVERSION)
    "buy embroidered t-shirts online",
    "shop luxury streetwear India",
    "best embroidered clothing India",
    "premium streetwear online India",
    "luxury embroidered hoodies online",
    "designer embroidered t-shirts India",
    
    // Location-specific (HIGH LOCAL SEO VALUE)
    "embroidered streetwear Mumbai",
    "luxury streetwear Delhi",
    "premium embroidery clothing Bangalore",
    "embroidered t-shirts online India",
    "luxury menswear India",
    
    // Brand positioning keywords (TOP/LEADING authority)
    "best luxury streetwear brand India",
    "top embroidered clothing brand",
    "premium embroidery fashion brand",
    "top embroidery brand India",
    "best embroidery brand India",
    "leading embroidery clothing brand",
    "top premium clothing brand India",
    "best premium clothing brand",
    "top embroidery t-shirt brand",
    "best embroidery t-shirt brand",
    "top embroidered t-shirt brand India",
    "number one embroidery brand",
    // High-impact 2025 trends (fast growth)
    "everyday luxury streetwear India",
    "everyday luxury fashion",
    "limited drop streetwear India",
    "limited edition embroidered clothing",
    "best streetwear brands India 2025",
    "best streetwear brands India",
    "handcrafted streetwear India",
    "cultural storytelling fashion",
    "kantha embroidery streetwear",
    "Indian heritage embroidery",
    "sustainable embroidered streetwear",
    "Indian craft streetwear",
  ],
  
  // SECONDARY: Supporting keywords with good search volume
  secondary: [
    "handcrafted embroidery fashion",
    "luxury cotton streetwear",
    "limited drop clothing brand",
    "premium embroidered tees",
    "Italian cotton streetwear",
    "VASCARIO",
    "kantha embroidery clothing",
    "Godhri embroidery fashion",
    "designer embroidered t-shirts",
    "luxury Indian menswear",
    "premium streetwear online",
    "embroidered clothing brand India",
    "high-end embroidery fashion",
    "luxury cotton embroidery",
    "artisanal streetwear India",
    "premium embroidered hoodies",
    "limited drop embroidered clothing",
    "handcrafted luxury streetwear",
    
    // Additional high-value keywords
    "embroidered streetwear brand",
    "luxury embroidery clothing online",
    "premium cotton streetwear",
    "designer streetwear India",
    "artisanal menswear India",
    "handcrafted streetwear brand",
    "limited edition embroidery",
    "premium embroidered apparel",
    "luxury casual wear India",
    "embroidered designer wear",
    // High-volume embroidery category keywords
    "embroidery sites",
    // Premium embroidery streetwear variants
    "premium embroidery streetwear brand",
    "luxury premium embroidery streetwear",
    "designer premium embroidery streetwear",
    "best embroidered streetwear India",
    "top embroidered clothing India",
    "premium embroidered t-shirts India",
    // 2025 high-impact keywords
    "everyday luxury India",
    "limited drop embroidery",
    "handcrafted Indian streetwear",
    "artisan embroidery streetwear",
    "sustainable streetwear India",
    "ethical embroidered clothing",
    "eco-friendly streetwear",
    "oversized embroidered streetwear",
    "oversized premium streetwear",
    "functional streetwear",
    "versatile embroidered clothing",
    "full back embroidery",
    "embroidered cotton jersey",
    "retro embroidery streetwear",
    "desi streetwear",
    "premium menswear India",
  ],
  
  // LONG-TAIL: High-conversion, low-competition keywords
  longTail: [
    // Buy intent keywords (HIGHEST CONVERSION)
    "buy embroidered t-shirts online India",
    "buy luxury streetwear online India",
    "shop premium embroidered hoodies India",
    "buy designer embroidered t-shirts",
    "purchase luxury embroidery clothing",
    "order embroidered streetwear online",
    
    // Best/Top comparison keywords (HIGH INTENT)
    "best embroidered clothing India",
    "best luxury streetwear brand India",
    "top embroidered t-shirt brands",
    "best premium streetwear online",
    "top luxury embroidery fashion",
    "best handcrafted embroidery clothing",
    // Premium embroidery streetwear — full long-tail coverage
    "best premium embroidery streetwear India",
    "top premium embroidery streetwear brand",
    "buy premium embroidery streetwear online",
    "shop premium embroidery streetwear India",
    "premium embroidery streetwear online India",
    "best embroidery clothing brand India",
    "top embroidery clothing brand India",
    "leading premium embroidery brand",
    "best premium clothing brand India",
    "top embroidery t-shirt brand India",
    "best embroidered t-shirt brand India",
    
    // Location + product combinations (LOCAL SEO POWER)
    "embroidered t-shirts Mumbai",
    "luxury streetwear Delhi online",
    "premium embroidery Bangalore",
    "embroidered hoodies Chennai",
    "luxury streetwear Hyderabad",
    "designer embroidery Pune",
    "premium streetwear Kolkata",
    
    // Price-sensitive keywords (CONVERSION FOCUSED)
    "affordable luxury streetwear India",
    "premium embroidered t-shirts price",
    "luxury streetwear online sale",
    "embroidered clothing best price",
    
    // Specific product + intent
    "luxury embroidered streetwear India",
    "premium embroidered hoodies online",
    "handcrafted embroidery clothing brand",
    "limited edition embroidered streetwear",
    "luxury cotton embroidered t-shirts",
    "premium streetwear with embroidery",
    "artisanal embroidery menswear India",
    "designer embroidered streetwear online",
    
    // Brand + product combinations
    "VASCARIO embroidered t-shirts",
    "VASCARIO luxury streetwear",
    "VASCARIO premium embroidery",
    "VASCARIO embroidered hoodies",
    
    // Local / near me keywords (27K–135K vol — high intent)
    "embroidery close to me",
    "embroidery shop near me",
    "embroidery place near me",
    "embroidery store near me",
    "stores that embroider near me",
    // Style/trend keywords
    "trendy embroidered streetwear",
    "modern luxury embroidery fashion",
    "contemporary embroidered clothing",
    "stylish premium streetwear",
    
    // Quality/technique keywords
    "handcrafted kantha embroidery clothing",
    "traditional Godhri embroidery fashion",
    "artisanal hand-embroidered streetwear",
    "premium Italian cotton embroidery",
    
    // 2025 high-impact long-tail (fast growth)
    "everyday luxury streetwear India",
    "limited drop embroidered clothing",
    "best streetwear brands India 2025",
    "cultural storytelling fashion brand",
    "Indian heritage embroidery streetwear",
    "sustainable embroidered streetwear India",
    "kantha embroidery streetwear India",
    "handcrafted streetwear India",
    "oversized embroidered streetwear India",
    "ethical embroidery clothing India",
    "desi streetwear brand India",
    "rooted Indian streetwear",
    "functional premium streetwear",
    // Occasion-based keywords
    "luxury streetwear for men",
    "premium embroidered casual wear",
    "designer embroidery for everyday",
    "luxury casual embroidery clothing",
  ],
  
  // HIGH-INTENT: Keywords with strongest buyer intent (PRIORITY FOR #1 RANKINGS)
  highIntent: [
    // TARGET: Premium embroidery streetwear (primary rank target)
    "premium embroidery streetwear",
    "premium embroidered streetwear",
    "best premium embroidery streetwear",
    "top premium embroidery streetwear",
    "premium embroidery streetwear India",
    // Authority keywords (top embroidery / clothing / t-shirt brand)
    "top embroidery brand India",
    "best embroidery brand India",
    "top premium clothing brand India",
    "best embroidery streetwear brand",
    "top embroidery t-shirt brand",
    // 2025 high-impact fast-growth keywords
    "everyday luxury streetwear India",
    "limited drop streetwear India",
    "best streetwear brands India 2025",
    "handcrafted streetwear India",
    "cultural storytelling fashion brand",
    "kantha embroidery streetwear",
    "Indian heritage embroidery",
    "sustainable embroidered streetwear",
    // Next-level high-search keywords (18K–27K vol)
    "custom embroidery",
    "embroidery designs",
    "embroidery shop",
    "embroidery shop near me",
    "embroidery close to me",
    "buy embroidered t-shirts online India",
    "shop luxury streetwear India",
    "best embroidered clothing India",
    "premium streetwear online India",
    "buy designer embroidered t-shirts",
    "luxury embroidered hoodies online",
    "order embroidered streetwear online",
    "purchase luxury embroidery clothing",
    "best luxury streetwear brand India",
    "top embroidered clothing brand",
    "embroidered t-shirts Mumbai",
    "luxury streetwear Delhi online",
    "premium embroidery Bangalore",
    "affordable luxury streetwear India",
    "VASCARIO embroidered t-shirts",
    "VASCARIO luxury streetwear",
  ],
  
  // BRAND KEYWORDS: For brand dominance
  brand: [
    "VASCARIO",
    "VASCARIO premium embroidery streetwear",
    "VASCARIO embroidered clothing",
    "VASCARIO streetwear",
    "VASCARIO luxury",
    "VASCARIO premium",
    "VASCARIO India",
    "VASCARIO brand",
    "VASCARIO online",
    "VASCARIO embroidery",
    "VASCARIO premium clothing",
  ],
  
  // All keywords combined
  all: function() {
    return [...this.primary, ...this.secondary, ...this.longTail]
  },
  
  // Get high-intent keywords (for conversion-focused pages)
  highIntentKeywords: function() {
    return [...this.highIntent, ...this.primary.filter(k => 
      k.includes("buy") || k.includes("shop") || k.includes("best") || k.includes("online")
    )]
  },
  
  // Get location-specific keywords
  locationKeywords: function(location: string = "India") {
    return this.all().filter(k => k.toLowerCase().includes(location.toLowerCase()))
  },
}

// ─── PAGE-SPECIFIC SEO CONFIGURATION ─────────────────────────────────────────

export const SEO_PAGES = {
  home: {
    title: "Premium Embroidery Streetwear India | Top Embroidery Brand — Vascario",
    description: "Vascario is India's top premium embroidery streetwear brand. Best embroidery clothing & embroidered t-shirt brand. Shop premium embroidered streetwear, luxury cotton tees & hoodies. Free shipping.",
    keywords: [
      ...SEO_KEYWORDS.highIntentKeywords(),
      ...SEO_KEYWORDS.primary,
      ...SEO_KEYWORDS.brand,
    ],
    openGraph: {
      type: "website" as const,
    },
  },

  collection: {
    title: "Premium Embroidery Streetwear Collection | Best Embroidered T-Shirts India — Vascario",
    description: "Shop Vascario premium embroidery streetwear — India's top embroidery clothing brand. Best embroidered t-shirts & hoodies. Premium handcrafted kantha embroidery. Free shipping.",
    keywords: [
      // 2025 high-impact fast-growth
      "everyday luxury streetwear India",
      "limited drop streetwear India",
      "best streetwear brands India 2025",
      "cultural storytelling fashion",
      "kantha embroidery streetwear",
      "handcrafted streetwear India",
      "sustainable embroidered streetwear",
      "Indian heritage embroidery",
      // TARGET: Premium embroidery streetwear
      "premium embroidery streetwear",
      "premium embroidered streetwear",
      "best premium embroidery streetwear",
      "top embroidery brand India",
      "best embroidery streetwear brand",
      // Ultra high-volume keywords
      "custom embroidery",
      "embroidery designs",
      "embroidery shop",
      "embroidery close to me",
      "embroidery shop near me",
      // High-intent keywords
      "buy embroidered t-shirts online India",
      "shop luxury streetwear India",
      "best embroidered clothing India",
      "premium streetwear online India",
      "buy designer embroidered t-shirts",
      "luxury embroidered hoodies online",
      // Product keywords
      "embroidered t-shirts",
      "embroidered hoodies",
      "premium streetwear",
      "premium embroidery streetwear",
      "limited drop clothing",
      "luxury embroidery",
      "handcrafted embroidery collection",
      "artisanal streetwear India",
      "designer embroidered clothing",
      "premium embroidered apparel",
      // Location keywords
      "embroidered t-shirts Mumbai",
      "luxury streetwear Delhi",
      "premium embroidery Bangalore",
      ...SEO_KEYWORDS.all(),
    ],
    introText: "Vascario premium embroidery streetwear offers everyday luxury — limited drops with handcrafted kantha embroidery. India's top embroidery clothing brand, rooted in Indian heritage and cultural storytelling. Sustainable embroidered streetwear: t-shirts and hoodies in luxury cotton. Each piece showcases traditional kantha and Godhri embroidery, Italian cotton, and the quality that defines the best premium embroidery streetwear.",
  },

  product: {
    titleTemplate: (productName: string) => 
      `Buy ${productName} Online India | Premium Embroidered Streetwear — Vascario`,
    descriptionTemplate: (productName: string, productDescription?: string) => 
      productDescription 
        ? `Buy ${productName} online India. ${productDescription.substring(0, 120)}... Premium embroidered streetwear from Vascario. Free shipping, best price guarantee.`
        : `Buy ${productName} online India — premium embroidered streetwear from Vascario. Luxury cotton, handcrafted embroidery, limited drop. Best price, free shipping across India.`,
  },

  about: {
    title: "About Vascario | Top Premium Embroidery Streetwear & Embroidered Clothing Brand India",
    description: "Vascario — India's top premium embroidery streetwear brand. Leading embroidery clothing and embroidered t-shirt brand. Handcrafted luxury with kantha & Godhri embroidery. Best premium embroidery streetwear.",
    keywords: [
      "premium embroidery streetwear",
      "top embroidery brand India",
      "best embroidery brand India",
      "best embroidered clothing brand India",
      "luxury streetwear India",
      "top embroidery craftsmanship",
      "Italian cotton fashion",
      "premium embroidery process",
      "artisanal streetwear brand",
      "handcrafted embroidery techniques",
      "kantha embroidery",
      "Godhri embroidery",
      "best luxury streetwear brand",
      ...SEO_KEYWORDS.all(),
    ],
  },

  lookbook: {
    title: "Lookbook | Premium Embroidery Streetwear — Top Embroidery Brand Vascario",
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

  login: {
    title: "Login or Create Account | Vascario Premium Streetwear",
    description:
      "Sign in or create your Vascario account to sync your shopping bag, favourites, and checkout across devices.",
    keywords: [
      "Vascario login",
      "Vascario account",
      "sign in Vascario",
      "create account Vascario",
      "streetwear account login",
      ...SEO_KEYWORDS.brand,
    ],
  },

  orderSuccess: {
    title: "Order Confirmed | Thank You for Shopping Vascario",
    description:
      "Your Vascario order is confirmed. View your digital receipt, print your order details, and continue shopping premium embroidered streetwear.",
    keywords: [
      "order confirmation",
      "Vascario order confirmed",
      "Vascario receipt",
      "Vascario order success",
      "streetwear order confirmation",
      ...SEO_KEYWORDS.brand,
    ],
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
    metadataBase: new URL(SEO_BASE.siteUrl),
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : SEO_KEYWORDS.all(),
    robots: noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    alternates: {
      canonical: pageUrl,
      languages: {
        "en-IN": pageUrl, // Primary: English (India)
        "en-US": pageUrl, // English (US) - same content for now
        "en": pageUrl, // Generic English
      },
    },
    openGraph: {
      ...openGraphConfig,
      locale: "en_IN", // India locale for better local SEO
      alternateLocale: ["en_US", "en"], // Add more locales as needed
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: images.length > 0 ? images : [],
      creator: SEO_BASE.twitterHandle,
      site: SEO_BASE.twitterHandle,
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: SEO_BASE.logo,
    },
    verification: {
      // Google Search Console verification
      // ✅ VERIFIED VIA DNS METHOD (Domain Name Provider)
      // No HTML meta tag needed - verification is done at DNS level via TXT record
      // This method verifies the entire domain and all subdomains automatically
      //
      // For other search engines (Bing, Yandex, etc.), add verification codes here if needed:
      // bing: "your-bing-verification-code",
      // yandex: "your-yandex-verification-code",
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
  slug?: string
  id?: string
}): Metadata {
  // Use slug if available, otherwise fallback to ID or generate from name
  const productSlug = product.slug || product.id || product.name.toLowerCase().replace(/\s+/g, "-")
  return generateMetadata({
    title: SEO_PAGES.product.titleTemplate(product.name),
    description: SEO_PAGES.product.descriptionTemplate(product.name, product.description),
    type: "product",
    images: product.images || [],
    url: `${SEO_BASE.siteUrl}/product/${productSlug}`,
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
    contactPoint: {
      "@type": "ContactPoint",
      email: SEO_BASE.contact.email,
      contactType: "Customer Service",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
    sameAs: [
      SEO_BASE.socialProfiles.twitter,
      SEO_BASE.socialProfiles.instagram,
      SEO_BASE.socialProfiles.facebook,
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Yogi Chowk",
      addressLocality: "Surat",
      postalCode: "395006",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
  },

  product: (product: {
    id: string
    name: string
    slug?: string
    description: string
    price: number
    images: string[]
    sku?: string | null
    totalStock: number
    colors?: string[]
    sizes?: string[]
    aggregateRating?: {
      ratingValue: number
      reviewCount: number
    }
  }) => ({
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: SEO_BASE.brandName,
      logo: `${SEO_BASE.siteUrl}${SEO_BASE.logo}`,
    },
    image: product.images.map(img => img.startsWith("http") ? img : `${SEO_BASE.siteUrl}${img}`),
    sku: product.sku || product.id,
    mpn: product.sku || product.id,
    category: "Apparel & Accessories > Clothing > Shirts & Tops",
    // Enhanced product attributes for better SEO
    material: "Premium Cotton", // VASCARIO uses premium cotton
    pattern: "Embroidered", // All products feature embroidery
    countryOfOrigin: {
      "@type": "Country",
      name: "India",
    },
    // Add colors if available
    ...(product.colors && product.colors.length > 0 && {
      color: product.colors.map(color => {
        // Handle hex colors and named colors
        if (color.startsWith("#")) {
          return color.toUpperCase()
        }
        return color
      }),
    }),
    // Add sizes if available
    ...(product.sizes && product.sizes.length > 0 && {
      size: product.sizes,
    }),
    offers: {
      "@type": "Offer",
      url: `${SEO_BASE.siteUrl}/product/${product.slug || product.id}`,
      priceCurrency: "INR",
      price: product.price.toString(),
      availability: product.totalStock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 1 year from now
      seller: {
        "@type": "Organization",
        name: SEO_BASE.brandName,
      },
      // Add available sizes and colors to offer
      ...(product.sizes && product.sizes.length > 0 && {
        eligibleQuantity: {
          "@type": "QuantitativeValue",
          value: product.sizes.length,
        },
      }),
    },
    ...(product.aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.aggregateRating.ratingValue.toString(),
        reviewCount: product.aggregateRating.reviewCount.toString(),
        bestRating: "5",
        worstRating: "1",
      },
    }),
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

  faqPage: (faqs: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }),

  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SEO_BASE.siteName,
    url: SEO_BASE.siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SEO_BASE.siteUrl}/collection?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  },

  itemList: (items: Array<{
    name: string
    description?: string
    image?: string
    url: string
    price?: number
  }>) => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: item.name,
        description: item.description,
        image: item.image ? (item.image.startsWith("http") ? item.image : `${SEO_BASE.siteUrl}${item.image}`) : undefined,
        url: item.url.startsWith("http") ? item.url : `${SEO_BASE.siteUrl}${item.url}`,
        ...(item.price && {
          offers: {
            "@type": "Offer",
            price: item.price.toString(),
            priceCurrency: "INR",
          },
        }),
      },
    })),
  }),
}
