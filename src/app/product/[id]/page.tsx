import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getProductById } from "@/app/storefront-actions"
import { ProductDetailClient } from "./ProductDetailClient"
import { getProductMetadata } from "@/lib/seo-config"
import { ProductStructuredDataServer, BreadcrumbStructuredDataServer } from "@/components/StructuredDataServer"
import { SEO_BASE } from "@/lib/seo-config"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>
}): Promise<Metadata> {
    const { id } = await params
    const product = await getProductById(id)

    if (!product) {
        return {
            title: "Product Not Found — VASCARIO",
        }
    }

    return getProductMetadata({
        name: product.name,
        description: product.description,
        images: product.images,
        id: product.id,
    })
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const product = await getProductById(id)

    if (!product) {
        notFound()
    }

    // Breadcrumb items for structured data
    const breadcrumbItems = [
        { name: "Home", url: SEO_BASE.siteUrl },
        { name: "Collection", url: `${SEO_BASE.siteUrl}/collection` },
        { name: product.name, url: `${SEO_BASE.siteUrl}/product/${product.id}` },
    ]

    return (
        <>
            {/* Server-side structured data for better SEO */}
            <ProductStructuredDataServer product={product} />
            <BreadcrumbStructuredDataServer items={breadcrumbItems} />
            <ProductDetailClient product={product} />
        </>
    )
}
