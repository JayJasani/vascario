import { NextRequest } from "next/server";
import { getProductById } from "@/lib/repositories/product.repository";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || !Array.isArray(body.ids)) {
      return Response.json(
        { error: "Expected body.ids to be an array of product IDs" },
        { status: 400 },
      );
    }

    const rawIds = body.ids as unknown[];
    const ids = Array.from(
      new Set(
        rawIds
          .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
          .map((id) => id.trim()),
      ),
    );

    if (ids.length === 0) {
      return Response.json({ prices: {} }, { status: 200 });
    }

    const products = await Promise.all(ids.map((id) => getProductById(id)));

    const prices: Record<
      string,
      {
        price: number;
        cutPrice: number | null;
      }
    > = {};

    ids.forEach((id, index) => {
      const product = products[index];
      if (!product) return;
      prices[id] = {
        price: Number(product.price),
        cutPrice:
          product.cutPrice != null ? Number(product.cutPrice) : null,
      };
    });

    return Response.json({ prices }, { status: 200 });
  } catch (error) {
    console.error("Products pricing API error:", error);
    return Response.json(
      { error: "Failed to load product prices" },
      { status: 500 },
    );
  }
}

