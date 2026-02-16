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
    images: ["/placeholder-tee-black.png"],
    tag: "Bestseller",
  },
  {
    id: "cat_2",
    name: "COLLECTION Vascario - Unisex",
    slug: "collection-vascario-unisex",
    images: ["/placeholder-tee-gold.png"],
    tag: "Limited",
  },
  {
    id: "cat_3",
    name: "Embroidery Hoodies - (unisex)",
    slug: "embroidery-hoodies-unisex",
    images: ["/placeholder-tee-bone.png"],
    tag: "Archive",
  },
  {
    id: "cat_4",
    name: "Festive T-shirts - (unisex) - (Festive Special)",
    slug: "festive-tshirts-unisex",
    images: ["/placeholder-tee-black.png"],
    tag: "Festive Special",
  },
];
