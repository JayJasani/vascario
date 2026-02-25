import { cache, Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { getProductBySlug, getProductById, getStaticContentUrls } from "@/app/storefront-actions"
import { ProductDetailClient } from "./ProductDetailClient"
import { getProductMetadata } from "@/lib/seo-config"
import { ProductStructuredDataServer, BreadcrumbStructuredDataServer } from "@/components/StructuredDataServer"
import { ResourcePreloader } from "@/components/ResourcePreloader"
import { SEO_BASE } from "@/lib/seo-config"
import ProductLoading from "../loading"

const getProductForPage = cache(async (slug: string) => {
    const looksLikeId = /^[a-zA-Z0-9]{20}$/.test(slug)
    if (looksLikeId) {
        const product = await getProductById(slug)
        if (product && product.slug && product.slug !== slug) redirect(`/product/${product.slug}`)
        return product
    }
    return getProductBySlug(slug)
})

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const product = await getProductForPage(slug)

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

async function ProductDetailData({ slug }: { slug: string }) {
    const [product, staticContent] = await Promise.all([
        getProductForPage(slug),
        getStaticContentUrls(),
    ])

    if (!product) {
        notFound()
    }

    const breadcrumbItems = [
        { name: "Home", url: SEO_BASE.siteUrl },
        { name: "Collection", url: `${SEO_BASE.siteUrl}/collection` },
        { name: product.name, url: `${SEO_BASE.siteUrl}/product/${product.slug}` },
    ]

    const isFirebaseUrl = (url: string) => url.startsWith('https://storage.googleapis.com')
    const firstImage = product.images?.[0]
    const criticalImages = firstImage && isFirebaseUrl(firstImage) ? [firstImage] : []

    return (
        <>
            <ProductStructuredDataServer
                product={{ ...product, colors: product.colors, sizes: product.sizes }}
            />
            <BreadcrumbStructuredDataServer items={breadcrumbItems} />
            <ResourcePreloader images={criticalImages} />
            <ProductDetailClient product={product} makingProcessVideoUrl={staticContent.making_process || undefined} />
        </>
    )
}

export default function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    return (
        <Suspense fallback={<ProductLoading />}>
            <ProductDetailContent params={params} />
        </Suspense>
    )
}

async function ProductDetailContent({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    return <ProductDetailData slug={slug} />
}
