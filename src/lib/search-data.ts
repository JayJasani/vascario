import { CATEGORIES } from "./categories";

export interface SearchItem {
  id: string;
  name: string;
  type: "category" | "product";
  url: string;
  image?: string;
  price?: number;
  tag?: string;
}

const PRODUCTS: SearchItem[] = [
  { id: "prod_1", name: "Signature Tee — Onyx", type: "product", url: "/product/prod_1", image: "/placeholder-tee-black.png", price: 85, tag: "Bestseller" },
  { id: "prod_2", name: "Heavyweight — Charcoal", type: "product", url: "/product/prod_2", image: "/placeholder-tee-charcoal.png", price: 95, tag: "New" },
  { id: "prod_3", name: "Gold Edition", type: "product", url: "/product/prod_3", image: "/placeholder-tee-gold.png", price: 120, tag: "Limited" },
  { id: "prod_4", name: "Phantom — All Black", type: "product", url: "/product/prod_4", image: "/placeholder-tee-phantom.png", price: 110 },
  { id: "prod_5", name: "Archive 001 — Bone", type: "product", url: "/product/prod_5", image: "/placeholder-tee-bone.png", price: 130, tag: "Archive" },
];

const CATEGORY_ITEMS: SearchItem[] = CATEGORIES.map((c) => ({
  id: c.id,
  name: c.name,
  type: "category" as const,
  url: `/collection/${c.slug}`,
  image: c.images[0],
  tag: c.tag,
}));

export const SEARCH_ITEMS: SearchItem[] = [...CATEGORY_ITEMS, ...PRODUCTS];

export function searchItems(query: string): SearchItem[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  return SEARCH_ITEMS.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      (item.tag && item.tag.toLowerCase().includes(q))
  );
}
