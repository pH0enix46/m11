export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: "Classic" | "Premium" | "Sport";
  images: string[];
  features: string[];
  sizes: string[];
  badge?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IOrderItem {
  product: string; // ID
  name: string;
  selectedSize: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface IOrder {
  _id: string;
  user: string; // User ID
  orderNumber: string;
  items: IOrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    phone: string;
  };
  paymentMethod: "cash" | "card" | "paypal" | "stripe";
  paymentStatus: "pending" | "paid" | "failed";
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  deliveredAt?: string;
  cancelledAt?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAdminProfile {
  name: string;
  email: string;
  avatar: string;
}
