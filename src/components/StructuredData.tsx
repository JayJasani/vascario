"use client"

import { useEffect } from "react"
import { SEO_STRUCTURED_DATA } from "@/lib/seo-config"

interface ProductStructuredDataProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    images: string[]
    sku: string | null
    totalStock: number
  }
}

export function ProductStructuredData({ product }: ProductStructuredDataProps) {
  useEffect(() => {
    const structuredData = SEO_STRUCTURED_DATA.product(product)

    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.text = JSON.stringify(structuredData)
    script.id = "product-structured-data"
    
    // Remove existing script if present
    const existing = document.getElementById("product-structured-data")
    if (existing) {
      existing.remove()
    }
    
    document.head.appendChild(script)

    return () => {
      const scriptToRemove = document.getElementById("product-structured-data")
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [product])

  return null
}

interface BreadcrumbStructuredDataProps {
  items: Array<{ name: string; url: string }>
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  useEffect(() => {
    const structuredData = SEO_STRUCTURED_DATA.breadcrumb(items)

    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.text = JSON.stringify(structuredData)
    script.id = "breadcrumb-structured-data"
    
    const existing = document.getElementById("breadcrumb-structured-data")
    if (existing) {
      existing.remove()
    }
    
    document.head.appendChild(script)

    return () => {
      const scriptToRemove = document.getElementById("breadcrumb-structured-data")
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [items])

  return null
}

interface OrganizationStructuredDataProps {
  name?: string
  url?: string
  logo?: string
  description?: string
}

export function OrganizationStructuredData({ 
  name,
  url,
  logo,
  description
}: OrganizationStructuredDataProps) {
  useEffect(() => {
    const structuredData = {
      ...SEO_STRUCTURED_DATA.organization,
      ...(name && { name }),
      ...(url && { url }),
      ...(logo && { logo }),
      ...(description && { description }),
    }

    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.text = JSON.stringify(structuredData)
    script.id = "organization-structured-data"
    
    const existing = document.getElementById("organization-structured-data")
    if (existing) {
      existing.remove()
    }
    
    document.head.appendChild(script)

    return () => {
      const scriptToRemove = document.getElementById("organization-structured-data")
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [name, url, logo, description])

  return null
}
