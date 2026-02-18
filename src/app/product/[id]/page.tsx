import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getProductById } from "@/app/storefront-actions"
import { ProductDetailClient } from "./ProductDetailClient"
import { getProductMetadata } from "@/lib/seo-config"

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

    return <ProductDetailClient product={product} />
}
