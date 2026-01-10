import { IProduct, IOrder } from "./types";

export const mockProducts: IProduct[] = [
  {
    _id: "1",
    name: "Classic Leather Jacket",
    slug: "classic-leather-jacket",
    description: "Premium leather jacket for all seasons.",
    price: 199.99,
    category: "Classic",
    images: [
      "https://images.unsplash.com/photo-1551028919-ac76c9028b1e?q=80&w=1000",
    ],
    features: ["Genuine Leather", "All Season", "Waterproof"],
    sizes: ["S", "M", "L", "XL"],
    isActive: true,
  },
  {
    _id: "2",
    name: "Sport Runners X1",
    slug: "sport-runners-x1",
    description: "High performance running shoes.",
    price: 129.5,
    discountPrice: 99.99,
    category: "Sport",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000",
    ],
    features: ["Lightweight", "Breathable", "High Grip"],
    sizes: ["8", "9", "10", "11"],
    badge: "Best Seller",
    isActive: true,
  },
];

export const mockOrders: IOrder[] = [
  {
    _id: "101",
    user: "u1",
    orderNumber: "ORD-123456-1",
    items: [
      {
        product: "1",
        name: "Classic Leather Jacket",
        selectedSize: "M",
        quantity: 1,
        price: 199.99,
        image:
          "https://images.unsplash.com/photo-1551028919-ac76c9028b1e?q=80&w=1000",
      },
    ],
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      address: "123 Main St",
      city: "New York",
      phone: "123-456-7890",
    },
    paymentMethod: "card",
    paymentStatus: "paid",
    itemsPrice: 199.99,
    shippingPrice: 10,
    taxPrice: 20,
    totalPrice: 229.99,
    orderStatus: "processing",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "102",
    user: "u2",
    orderNumber: "ORD-123456-2",
    items: [
      {
        product: "2",
        name: "Sport Runners X1",
        selectedSize: "10",
        quantity: 1,
        price: 99.99,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000",
      },
    ],
    shippingAddress: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      address: "456 Elm St",
      city: "Los Angeles",
      phone: "098-765-4321",
    },
    paymentMethod: "paypal",
    paymentStatus: "paid",
    itemsPrice: 99.99,
    shippingPrice: 10,
    taxPrice: 5,
    totalPrice: 114.99,
    orderStatus: "shipped",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];
