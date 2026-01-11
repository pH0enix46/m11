export interface Product {
  id?: string;
  _id?: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  description: string;
  features: string[];
  sizes: string[];
  images: string[];
  category: "Grand" | "Simple";
  badge?: string;
}
