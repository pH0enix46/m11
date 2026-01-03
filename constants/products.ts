export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  description: string;
  features: string[];
  sizes: string[];
  images: string[];
  category: "Classic" | "Premium" | "Sport";
  badge?: string;
}

export const products: Product[] = [
  {
    id: "1",
    slug: "ryder-blackout",
    name: "Ryder Blackout",
    price: 2500,
    description: "Designed and Manufactured in Bangladesh 🇧🇩",
    features: [
      "Premium Canton leather Upper",
      "Ultra Soft leather lining",
      "Highest degree of comfort",
      "PVC sole with stitching for durability",
    ],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    images: [
      "/products/one/1.jpeg",
      "/products/one/2.jpeg",
      "/products/one/3.jpeg",
      "/products/one/4.jpeg",
    ],
    category: "Premium",
    badge: "New Arrival",
  },
  {
    id: "2",
    slug: "shark-polar-white-black",
    name: "Shark Polar White/Black",
    price: 2500,
    description: "Designed and Manufactured in Bangladesh 🇧🇩",
    features: [
      "Full Grain leather Upper",
      "Ultra Soft leather lining",
      "Highest degree of comfort",
      "PVC sole with stitching for durability",
    ],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    images: [
      "/products/two/1.jpeg",
      "/products/two/2.jpeg",
      "/products/two/3.jpeg",
      "/products/two/4.jpeg",
    ],
    category: "Premium",
  },
  {
    id: "3",
    slug: "avion-polar-white",
    name: "Avion Polar White",
    price: 2500,
    discountPrice: 1500,
    description: "Designed and Manufactured in Bangladesh 🇧🇩",
    features: [
      "Full Grain leather Upper",
      "Ultra Soft leather lining",
      "Highest degree of comfort",
      "PVC sole with stitching for durability",
    ],
    sizes: ["45"],
    images: [
      "/products/three/1.jpeg",
      "/products/three/2.jpeg",
      "/products/three/3.jpeg",
      "/products/three/4.jpeg",
    ],
    category: "Classic",
    badge: "Sale",
  },
  {
    id: "4",
    slug: "avion-blackout",
    name: "Avion Blackout",
    price: 2500,
    discountPrice: 1500,
    description: "Designed and Manufactured in Bangladesh 🇧🇩",
    features: [
      "Full Grain leather Upper",
      "Ultra Soft leather lining",
      "Highest degree of comfort",
      "PVC sole with stitching for durability",
    ],
    sizes: ["42"],
    images: [
      "/products/four/1.jpeg",
      "/products/four/2.jpeg",
      "/products/four/3.jpeg",
      "/products/four/4.jpeg",
    ],
    category: "Classic",
    badge: "Sale",
  },
];
