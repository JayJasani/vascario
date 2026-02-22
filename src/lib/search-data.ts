import { getActiveProducts } from "@/lib/firebase-helpers";

export interface SearchItem {
  id: string;
  name: string;
  type: "product";
  url: string;
  image?: string;
  price?: number;
  /** Original price before discount, shown crossed out when present */
  cutPrice?: number | null;
  tag?: string;
}

/**
 * Fetches all searchable products dynamically from Firebase
 */
export async function getAllSearchItems(): Promise<SearchItem[]> {
  try {
    // Fetch active products from Firebase
    const products = await getActiveProducts();
    
    // Convert products to search items
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      type: "product" as const,
      url: `/product/${product.id}`,
      image: product.images[0],
      price: product.price,
      cutPrice: product.cutPrice ?? null,
    }));
  } catch (error) {
    console.error("Error fetching search items:", error);
    return [];
  }
}

/**
 * Search function that filters search items by query
 * @param items - Array of search items to filter
 * @param query - Search query string
 */
export function filterSearchItems(items: SearchItem[], query: string): SearchItem[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      (item.tag && item.tag.toLowerCase().includes(q))
  );
}

/**
 * Legacy synchronous search function for backward compatibility
 * @deprecated Use getAllSearchItems() + filterSearchItems() instead
 */
export function searchItems(query: string): SearchItem[] {
  // This function is deprecated and returns empty array
  // Use getAllSearchItems() + filterSearchItems() for dynamic search
  return [];
}
