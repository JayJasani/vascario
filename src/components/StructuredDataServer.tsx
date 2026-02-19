/**
 * Server-Side Structured Data Components
 * 
 * These components render structured data (JSON-LD) on the server,
 * which is better for SEO than client-side rendering.
 * 
 * Use these instead of the client-side StructuredData components
 * for better search engine indexing.
 */

import { SEO_STRUCTURED_DATA } from "@/lib/seo-config"

interface ProductStructuredDataProps {
  product: {
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
  }
}

export function ProductStructuredDataServer({ product }: ProductStructuredDataProps) {
  const structuredData = SEO_STRUCTURED_DATA.product(product)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface BreadcrumbStructuredDataProps {
  items: Array<{ name: string; url: string }>
}

export function BreadcrumbStructuredDataServer({ items }: BreadcrumbStructuredDataProps) {
  const structuredData = SEO_STRUCTURED_DATA.breadcrumb(items)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface OrganizationStructuredDataProps {
  name?: string
  url?: string
  logo?: string
  description?: string
}

export function OrganizationStructuredDataServer({
  name,
  url,
  logo,
  description,
}: OrganizationStructuredDataProps) {
  const structuredData = {
    ...SEO_STRUCTURED_DATA.organization,
    ...(name && { name }),
    ...(url && { url }),
    ...(logo && { logo }),
    ...(description && { description }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface FAQPageStructuredDataProps {
  faqs: Array<{ question: string; answer: string }>
}

export function FAQPageStructuredDataServer({ faqs }: FAQPageStructuredDataProps) {
  const structuredData = SEO_STRUCTURED_DATA.faqPage(faqs)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface WebsiteStructuredDataProps {
  searchUrl?: string
}

export function WebsiteStructuredDataServer({ searchUrl }: WebsiteStructuredDataProps) {
  const structuredData = {
    ...SEO_STRUCTURED_DATA.website,
    ...(searchUrl && {
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: searchUrl,
        },
        "query-input": "required name=search_term_string",
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface ItemListStructuredDataProps {
  items: Array<{
    name: string
    description?: string
    image?: string
    url: string
    price?: number
  }>
}

export function ItemListStructuredDataServer({ items }: ItemListStructuredDataProps) {
  const structuredData = SEO_STRUCTURED_DATA.itemList(items)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
