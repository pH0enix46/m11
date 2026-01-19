export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: "Grand Series" | "Simple Series";
  images: string[];
  features: string[];
  sizes: string[];
  badge?: string;
  isActive: boolean;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
  sizeStock?: { size: string; stock: number }[];
  tags?: string[];
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
  user: string | { _id: string; name: string; email: string };
  orderNumber: string;
  items: IOrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: "cash" | "card" | "paypal" | "stripe" | "bkash" | "nagad";
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
