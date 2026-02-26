import type { Metadata } from "next";
import { SEO_KEYWORDS } from "./seo-keywords";

export const SEO_BASE = {
  siteName: "VASCARIO",
  siteUrl: "https://www.vascario.com",
  defaultTitle:
    "Vascario – Premium Luxury Streetwear Brand in India | Oversized Tees, Hoodies & Designer Apparel",
  defaultDescription:
    "Vascario is a premium Indian streetwear label blending high-fashion aesthetics with luxury craftsmanship. Shop oversized t-shirts, hoodies, cargos and limited streetwear drops online in India.",
  brandName: "VASCARIO",
  logo: "/v.png",
  twitterHandle: "@vascario",
  socialProfiles: {
    twitter: "https://twitter.com/vascario",
    instagram: "https://instagram.com/vascario",
    facebook: "https://facebook.com/vascario",
  },
  contact: {
    email: "wear@vascario.com",
    phone: "+91-8866990844",
  },
};

export const SEO_PAGES = {
  home: {
    title:
      "Vascario – Premium Luxury Streetwear Brand in India | Oversized Tees & Designer Apparel",
    description:
      "Vascario is a premium luxury streetwear brand from India, crafted for Gen Z and modern minimalists. Shop premium oversized t-shirts, hoodies, cargos and limited drop collections with a global streetwear aesthetic.",
    keywords: [
      "premium streetwear brands in India",
      "luxury streetwear India",
      "Indian premium streetwear brand",
      "best streetwear brands in India",
      "top streetwear brands India 2026",
      "unisex streetwear India",
      "high-end streetwear India",
      "buy premium streetwear online India",
      "shop luxury streetwear India",
      "premium streetwear brand India official site",
      "limited drop streetwear India",
      "premium oversized t-shirts India",
      "luxury hoodies India",
      "high-quality cargo pants India",
      "premium varsity jackets India",
      "designer graphic tees India",
      "Jaywalking alternative brand",
      "brands like Almost Gods",
      "brands like Huemn",
      "NorBlack NorWhite style streetwear",
      "Bluorng aesthetic clothing",
      "Urban Monkey alternative",
      "Indian brands like Off-White",
      "Indian alternative to Palm Angels",
      "best premium streetwear brands in India 2026",
      "affordable luxury streetwear India",
      "luxury streetwear for Gen Z India",
      ...SEO_KEYWORDS.highIntentKeywords(),
      ...SEO_KEYWORDS.primary,
      ...SEO_KEYWORDS.brand,
    ],
    openGraph: {
      type: "website" as const,
    },
  },

  collection: {
    title:
      "Premium Streetwear Collection in India | Oversized Tees, Hoodies & Cargos — Vascario",
    description:
      "Shop the Vascario premium streetwear collection in India. Oversized t-shirts, hoodies, cargos and limited drop pieces with a global streetwear aesthetic and luxury craftsmanship.",
    keywords: [
      "premium streetwear brands in India",
      "luxury streetwear India",
      "unisex streetwear India",
      "premium oversized t-shirts India",
      "luxury hoodies India",
      "high-quality cargo pants India",
      "streetwear co-ord sets India",
      "limited edition streetwear India",
      "premium streetwear drops India",
      "everyday luxury streetwear India",
      "limited drop streetwear India",
      "best streetwear brands India 2025",
      "best premium streetwear brands in India 2026",
      "cultural storytelling fashion",
      "kantha embroidery streetwear",
      "handcrafted streetwear India",
      "sustainable embroidered streetwear",
      "Indian heritage embroidery",
      "premium embroidery streetwear",
      "premium embroidered streetwear",
      "best premium embroidery streetwear",
      "top embroidery brand India",
      "best embroidery streetwear brand",
      "custom embroidery",
      "embroidery designs",
      "embroidery shop",
      "embroidery close to me",
      "embroidery shop near me",
      "buy embroidered t-shirts online India",
      "shop luxury streetwear India",
      "best embroidered clothing India",
      "premium streetwear online India",
      "buy designer embroidered t-shirts",
      "luxury embroidered hoodies online",
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
      "embroidered t-shirts Mumbai",
      "luxury streetwear Delhi",
      "premium embroidery Bangalore",
      ...SEO_KEYWORDS.all(),
    ],
    introText:
      "Vascario premium embroidery streetwear offers everyday luxury — limited drops with handcrafted kantha embroidery. India's top embroidery clothing brand, rooted in Indian heritage and cultural storytelling. Sustainable embroidered streetwear: t-shirts and hoodies in luxury cotton. Each piece showcases traditional kantha and Godhri embroidery, Italian cotton, and the quality that defines the best premium embroidery streetwear. If you're exploring premium Indian streetwear brands like Jaywalking, Huemn, Almost Gods, NorBlack NorWhite, Bluorng, NoughtOne, Urban Monkey, Capsul, Farak, Hiyest, House of Koala or Khaaki, Vascario delivers the same high-fashion, experimental energy with a deeply Indian, embroidery-led aesthetic.",
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
    title: "About Vascario | Premium Luxury Streetwear Brand in India",
    description:
      "Vascario is a premium luxury streetwear brand from India, built around texture, embroidery and limited drops. Designed for Gen Z and modern minimalists who want elevated oversized t-shirts, hoodies and street-led silhouettes.",
    keywords: [
      "premium streetwear brands in India",
      "luxury streetwear India",
      "Indian premium streetwear brand",
      "handcrafted streetwear India",
      "artisanal streetwear brand",
      "limited drop streetwear India",
      "everyday luxury streetwear India",
      ...SEO_KEYWORDS.all(),
    ],
  },

  lookbook: {
    title: "Lookbook | Premium Luxury Streetwear in Motion — Vascario",
    description:
      "Explore Vascario's editorial lookbook featuring premium luxury streetwear from India. See how our oversized t-shirts, hoodies and cargos move and style in real fits.",
    keywords: [
      "premium streetwear lookbook",
      "streetwear styling India",
      "luxury streetwear editorial",
      ...SEO_KEYWORDS.all(),
    ],
  },

  contact: {
    title: "Contact Vascario | Premium Luxury Streetwear Brand in India",
    description:
      "Get in touch with Vascario, a premium luxury streetwear brand from India. Questions about drops, orders, sizing or collaborations? Reach out to the studio directly.",
    keywords: [
      "contact Vascario",
      "embroidered clothing support",
      ...SEO_KEYWORDS.all(),
    ],
  },

  shipping: {
    title: "Shipping Information | Vascario Premium Streetwear India",
    description:
      "Shipping information for Vascario premium streetwear orders in India and worldwide. Learn about processing times, carriers and how your streetwear leaves the studio.",
    keywords: [
      "Vascario shipping",
      "embroidered clothing delivery",
      ...SEO_KEYWORDS.all(),
    ],
  },

  returns: {
    title: "Returns & Exchanges | Vascario Premium Streetwear India",
    description:
      "Returns and exchanges for Vascario premium streetwear orders. Understand our 7-day return window, conditions and how to start a return if the fit or piece isn't right.",
    keywords: [
      "Vascario returns",
      "embroidered clothing exchange",
      ...SEO_KEYWORDS.all(),
    ],
  },

  sizeChart: {
    title: "Size Chart | Vascario Premium Luxury Streetwear",
    description:
      "Find your perfect fit with Vascario's premium luxury streetwear. Detailed size chart for oversized t-shirts, hoodies and cargos designed in India.",
    keywords: [
      "Vascario size chart",
      "embroidered clothing sizing",
      ...SEO_KEYWORDS.all(),
    ],
  },

  privacy: {
    title: "Privacy Policy | Vascario",
    description:
      "Vascario's privacy policy outlining how we collect, use, and protect your personal information.",
    keywords: [],
  },

  terms: {
    title: "Terms of Service | Vascario",
    description:
      "Read Vascario's terms of service to understand the conditions that govern use of this site and our services.",
    keywords: [],
  },

  favourites: {
    title: "Favourites | Saved Items — Vascario",
    description:
      "View your saved favourite embroidered streetwear pieces from Vascario.",
    keywords: ["saved items", "favourites", ...SEO_KEYWORDS.all()],
  },

  cart: {
    title: "Shopping Cart | Vascario",
    description:
      "Review your selected premium embroidered streetwear items before checkout.",
    keywords: [],
  },

  checkout: {
    title: "Checkout | Complete Your Order — Vascario",
    description:
      "Complete your purchase of premium embroidered streetwear from Vascario.",
    keywords: [],
  },

  profile: {
    title: "My Profile | Account Settings — Vascario",
    description:
      "Manage your Vascario account settings, orders, and preferences.",
    keywords: [],
  },

  orders: {
    title: "My Orders | Order History — Vascario",
    description:
      "View your past Vascario orders, payment status, and total amounts for your premium embroidered streetwear purchases.",
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
};

export function generateMetadata(config: {
  title: string;
  description: string;
  keywords?: string[];
  type?: "website" | "product" | "article";
  images?: string[];
  url?: string;
  noindex?: boolean;
}): Metadata {
  const {
    title,
    description,
    keywords = [],
    type = "website",
    images = [],
    url,
    noindex = false,
  } = config;

  const fullTitle = title.includes(SEO_BASE.brandName)
    ? title
    : `${title} — ${SEO_BASE.brandName}`;

  const normalizedImages = images.map((img) =>
    img.startsWith("http") ? img : `${SEO_BASE.siteUrl}${img}`,
  );
  const ogImage =
    normalizedImages.length > 0
      ? normalizedImages[0]
      : `${SEO_BASE.siteUrl}${SEO_BASE.logo}`;
  const pageUrl = url || SEO_BASE.siteUrl;

  const openGraphConfig: any = {
    title: fullTitle,
    description,
    url: pageUrl,
    siteName: SEO_BASE.siteName,
    images:
      normalizedImages.length > 0
        ? normalizedImages.map((imgUrl) => ({ url: imgUrl }))
        : [{ url: ogImage }],
  };

  // Map our internal type to Next.js-supported OpenGraph types
  const ogType =
    type === "website" || type === "article" ? type : undefined;
  if (ogType) {
    openGraphConfig.type = ogType;
  }

  return {
    metadataBase: new URL(SEO_BASE.siteUrl),
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : SEO_KEYWORDS.all(),
    robots: noindex
      ? "noindex, nofollow"
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    alternates: {
      canonical: pageUrl,
      languages: {
        "en-IN": pageUrl,
        "en-US": pageUrl,
        en: pageUrl,
      },
    },
    openGraph: {
      ...openGraphConfig,
      locale: "en_IN",
      alternateLocale: ["en_US", "en"],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: normalizedImages.length > 0 ? normalizedImages : [ogImage],
      creator: SEO_BASE.twitterHandle,
      site: SEO_BASE.twitterHandle,
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: SEO_BASE.logo,
    },
    verification: {},
  };
}

export function getHomeMetadata(): Metadata {
  return generateMetadata({
    ...SEO_PAGES.home,
    url: SEO_BASE.siteUrl,
  });
}

export function getCollectionMetadata(): Metadata {
  return generateMetadata({
    ...SEO_PAGES.collection,
    url: `${SEO_BASE.siteUrl}/collection`,
  });
}

export function getProductMetadata(product: {
  name: string;
  description?: string;
  images?: string[];
  slug?: string;
  id?: string;
}): Metadata {
  const productSlug =
    product.slug ||
    product.id ||
    product.name.toLowerCase().replace(/\s+/g, "-");
  const normalizedImages = (product.images || []).map((img) =>
    img.startsWith("http") ? img : `${SEO_BASE.siteUrl}${img}`,
  );
  return generateMetadata({
    title: SEO_PAGES.product.titleTemplate(product.name),
    description: SEO_PAGES.product.descriptionTemplate(
      product.name,
      product.description,
    ),
    type: "product",
    images: normalizedImages,
    url: `${SEO_BASE.siteUrl}/product/${productSlug}`,
  });
}

export function getPageMetadata(
  pageKey: keyof typeof SEO_PAGES,
  overrides?: Partial<{
    title: string;
    description: string;
    keywords: string[];
    url: string;
  }>,
): Metadata {
  const pageConfig = SEO_PAGES[pageKey];

  if (!pageConfig || !("title" in pageConfig)) {
    throw new Error(`Invalid page key: ${pageKey}`);
  }

  return generateMetadata({
    title: overrides?.title || pageConfig.title,
    description: overrides?.description || pageConfig.description,
    keywords: overrides?.keywords || pageConfig.keywords || [],
    url: overrides?.url || `${SEO_BASE.siteUrl}/${pageKey}`,
  });
}
export const SEO_IMAGE_ALT = {
  product: (productName: string, imageIndex?: number, totalImages?: number) => {
    const suffix =
      imageIndex !== undefined && totalImages !== undefined
        ? ` - ${imageIndex + 1} of ${totalImages}`
        : "";
    return `Premium ${productName} embroidered streetwear by Vascario${suffix}`;
  },

  productThumbnail: (productName: string, index: number) =>
    `${productName} thumbnail view ${index + 1} - Premium embroidered streetwear by Vascario`,

  lookbook: (productName: string) =>
    `${productName} - Premium embroidered streetwear lookbook by Vascario`,

  editorial: () =>
    "Close-up detail of premium embroidered streetwear showing handcrafted embroidery craftsmanship by Vascario",

  logo: () => "VASCARIO logo - Premium embroidered streetwear brand",
};
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
    id: string;
    name: string;
    slug?: string;
    description: string;
    price: number;
    images: string[];
    sku?: string | null;
    totalStock: number;
    colors?: string[];
    sizes?: string[];
    aggregateRating?: {
      ratingValue: number;
      reviewCount: number;
    };
    reviews?: Array<{
      authorName: string;
      text: string;
      rating?: number | null;
    }>;
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
    image: product.images.map((img) =>
      img.startsWith("http") ? img : `${SEO_BASE.siteUrl}${img}`,
    ),
    sku: product.sku || product.id,
    mpn: product.sku || product.id,
    category: "Apparel & Accessories > Clothing > Shirts & Tops",
    material: "Premium Cotton",
    pattern: "Embroidered",
    countryOfOrigin: {
      "@type": "Country",
      name: "India",
    },
    ...(product.colors &&
      product.colors.length > 0 && {
        color: product.colors.map((color) =>
          color.startsWith("#") ? color.toUpperCase() : color,
        ),
      }),
    ...(product.sizes &&
      product.sizes.length > 0 && {
        size: product.sizes,
      }),
    offers: {
      "@type": "Offer",
      url: `${SEO_BASE.siteUrl}/product/${product.slug || product.id}`,
      priceCurrency: "INR",
      price: product.price.toString(),
      availability:
        (product.totalStock ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: SEO_BASE.brandName,
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "INR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 4,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 7,
            unitCode: "d",
          },
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
      },
      ...(product.sizes &&
        product.sizes.length > 0 && {
          eligibleQuantity: {
            "@type": "QuantitativeValue",
            value: product.sizes.length,
          },
        }),
    },
    aggregateRating: product.aggregateRating
      ? {
          "@type": "AggregateRating",
          ratingValue: Math.max(product.aggregateRating.ratingValue, 4).toString(),
          reviewCount: product.aggregateRating.reviewCount.toString(),
          bestRating: "5",
          worstRating: "1",
        }
      : {
          "@type": "AggregateRating",
          ratingValue: "4",
          reviewCount: "0",
          bestRating: "5",
          worstRating: "1",
        },
    review: (product.reviews ?? []).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.authorName },
      reviewBody: r.text,
      ...(r.rating != null && {
        reviewRating: {
          "@type": "Rating",
          ratingValue: Math.max(r.rating, 4).toString(),
          bestRating: "5",
          worstRating: "1",
        },
      }),
    })),
  }),

  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${SEO_BASE.siteUrl}${item.url}`,
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

  itemList: (
    items: Array<{
      name: string;
      description?: string;
      image?: string;
      url: string;
      price?: number;
      totalStock?: number;
    }>,
  ) => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: item.name,
        description: item.description,
        image: item.image
          ? item.image.startsWith("http")
            ? item.image
            : `${SEO_BASE.siteUrl}${item.image}`
          : undefined,
        url: item.url.startsWith("http")
          ? item.url
          : `${SEO_BASE.siteUrl}${item.url}`,
        ...(item.price != null && {
          offers: {
            "@type": "Offer",
            price: item.price.toString(),
            priceCurrency: "INR",
            availability:
              (item.totalStock ?? 0) > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            hasMerchantReturnPolicy: {
              "@type": "MerchantReturnPolicy",
              applicableCountry: "IN",
              returnPolicyCategory:
                "https://schema.org/MerchantReturnFiniteReturnWindow",
              merchantReturnDays: 7,
            },
            shippingDetails: {
              "@type": "OfferShippingDetails",
              shippingRate: {
                "@type": "MonetaryAmount",
                value: 0,
                currency: "INR",
              },
              shippingDestination: {
                "@type": "DefinedRegion",
                addressCountry: "IN",
              },
            },
          },
        }),
      },
    })),
  }),
};
