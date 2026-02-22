import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { getProductBySlug, getProductById, getStaticContentUrls } from "@/app/storefront-actions"
import { ProductDetailClient } from "./ProductDetailClient"
import { getProductMetadata } from "@/lib/seo-config"
import { ProductStructuredDataServer, BreadcrumbStructuredDataServer } from "@/components/StructuredDataServer"
import { ResourcePreloader } from "@/components/ResourcePreloader"
import { SEO_BASE } from "@/lib/seo-config"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    
    // Check if slug looks like a Firebase ID (backward compatibility)
    const looksLikeId = /^[a-zA-Z0-9]{20}$/.test(slug)
    let product = null
    
    if (looksLikeId) {
        // Try fetching by ID first (backward compatibility)
        product = await getProductById(slug)
        if (product && product.slug && product.slug !== slug) {
            // Redirect to slug URL for SEO
            redirect(`/product/${product.slug}`)
        }
    } else {
        // Fetch by slug
        product = await getProductBySlug(slug)
    }

    if (!product) {
        return {
            title: "Product Not Found — VASCARIO",
        }
    }

    return getProductMetadata({
        name: product.name,
        description: product.description,
        images: product.images,
        slug: product.slug,
    })
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    
    // Check if slug looks like a Firebase ID (backward compatibility)
    const looksLikeId = /^[a-zA-Z0-9]{20}$/.test(slug)
    let product = null
    
    if (looksLikeId) {
        // Try fetching by ID first (backward compatibility)
        product = await getProductById(slug)
        if (product && product.slug && product.slug !== slug) {
            // Redirect to slug URL for SEO
            redirect(`/product/${product.slug}`)
        }
    } else {
        // Fetch by slug
        product = await getProductBySlug(slug)
    }

    if (!product) {
        notFound()
    }

    const staticContent = await getStaticContentUrls()

    // Breadcrumb items for structured data
    const breadcrumbItems = [
        { name: "Home", url: SEO_BASE.siteUrl },
        { name: "Collection", url: `${SEO_BASE.siteUrl}/collection` },
        { name: product.name, url: `${SEO_BASE.siteUrl}/product/${product.slug}` },
    ]

    // Preload first product image if from Firebase Storage (API)
    const isFirebaseUrl = (url: string) => url.startsWith('https://storage.googleapis.com')
    const firstImage = product.images?.[0]
    const criticalImages = firstImage && isFirebaseUrl(firstImage) ? [firstImage] : []

    return (
        <>
            {/* Server-side structured data for better SEO */}
            <ProductStructuredDataServer 
                product={{
                    ...product,
                    colors: product.colors,
                    sizes: product.sizes,
                }} 
            />
            <BreadcrumbStructuredDataServer items={breadcrumbItems} />
            <ResourcePreloader images={criticalImages} />
            <ProductDetailClient product={product} makingProcessVideoUrl={staticContent.making_process || undefined} />
        </>
    )
}
