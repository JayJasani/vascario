export interface Category {
  id: string;
  name: string;
  slug: string;
  images: string[];
  tag?: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "cat_1",
    name: "3D Embroidery T-shirts",
    slug: "3d-embroidery-tshirts",
    images: ["/tshirt/tshirt1.webp"],
    tag: "Bestseller",
  },
  {
    id: "cat_2",
    name: "COLLECTION Vascario - Unisex",
    slug: "collection-vascario-unisex",
    images: ["/tshirt/tshirt2.webp"],
    tag: "Limited",
  },
  {
    id: "cat_3",
    name: "Embroidery Hoodies - (unisex)",
    slug: "embroidery-hoodies-unisex",
    images: ["/tshirt/tshirt3.webp"],
    tag: "Archive",
  },
  {
    id: "cat_4",
    name: "Festive T-shirts - (unisex) - (Festive Special)",
    slug: "festive-tshirts-unisex",
    images: ["/tshirt/tshirt2.webp"],
    tag: "Festive Special",
  },
];
