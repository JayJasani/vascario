import { NextRequest } from "next/server";
import { getProductById, getProductBySku, getProductBySlug } from "@/lib/repositories/product.repository";
import { getStockLevelsByProductId } from "@/lib/repositories/stock.repository";

/** Firebase doc IDs are typically 20 chars alphanumeric. */
function looksLikeFirebaseId(value: string): boolean {
  return /^[a-zA-Z0-9]{20}$/.test(value);
}

async function resolveProduct(idOrSkuOrSlug: string) {
  const trimmed = idOrSkuOrSlug.trim();
  if (looksLikeFirebaseId(trimmed)) {
    const byId = await getProductById(trimmed);
    if (byId) return byId;
  }
  const bySku =
    (await getProductBySku(trimmed)) ??
    (await getProductBySku(trimmed.toUpperCase())) ??
    (await getProductBySku(trimmed.toLowerCase()));
  if (bySku) return bySku;
  return getProductBySlug(trimmed);
}

/**
 * GET /api/products/[id]
 * Returns product info for storefront (e.g. adding to cart from checkout?item_id={id}).
 * [id] can be product id, SKU (e.g. vsc-002), or slug. Public endpoint - no auth required.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idOrSkuOrSlug } = await params;
    if (!idOrSkuOrSlug?.trim()) {
      return Response.json({ error: "Product id, SKU or slug required" }, { status: 400 });
    }

    const product = await resolveProduct(idOrSkuOrSlug.trim());

    if (!product || !product.isActive) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    const stockLevels = await getStockLevelsByProductId(product.id);

    const stockBySize = stockLevels.map((s) => ({
      size: s.size,
      quantity: s.quantity,
    }));
    const firstInStockSize = stockBySize.find((s) => s.quantity > 0)?.size ?? stockBySize[0]?.size;

    return Response.json(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        images: product.images ?? [],
        sizes: product.sizes ?? [],
        stockBySize,
        firstInStockSize,
      },
      {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
      }
    );
  } catch (error) {
    console.error("Product storefront API error:", error);
    return Response.json(
      { error: "Failed to load product" },
      { status: 500 }
    );
  }
}
