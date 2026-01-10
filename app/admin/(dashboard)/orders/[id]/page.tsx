import { getOrderByIdAction } from "@/lib/actions";
import OrderDetails from "@/components/admin/OrderDetails";
import { IOrder } from "@/lib/types";

const dummyOrders: IOrder[] = [
  {
    _id: "dummy-1",
    orderNumber: "ORD-7721",
    user: { _id: "u1", name: "Ahmed Faraz", email: "ahmed@example.com" },
    items: [
      {
        product: "p1",
        name: "Ryder Blackout Leather",
        selectedSize: "XL",
        quantity: 1,
        price: 12500,
        image: "/products/classic/1.jpg",
      },
    ],
    shippingAddress: {
      street: "Gulshan 2",
      city: "Dhaka",
      state: "Dhaka",
      zipCode: "1212",
      country: "Bangladesh",
      phone: "01712345678",
    },
    paymentMethod: "bkash",
    paymentStatus: "paid",
    itemsPrice: 12500,
    shippingPrice: 100,
    taxPrice: 0,
    totalPrice: 12600,
    orderStatus: "processing",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "dummy-2",
    orderNumber: "ORD-9932",
    user: { _id: "u2", name: "Sara Islam", email: "sara.i@example.com" },
    items: [
      {
        product: "p2",
        name: "Apex Sport Fusion",
        selectedSize: "M",
        quantity: 1,
        price: 8500,
        image: "/products/sport/2.jpg",
      },
    ],
    shippingAddress: {
      street: "Banani 11",
      city: "Dhaka",
      state: "Dhaka",
      zipCode: "1213",
      country: "Bangladesh",
      phone: "01887654321",
    },
    paymentMethod: "cash",
    paymentStatus: "pending",
    itemsPrice: 8500,
    shippingPrice: 100,
    taxPrice: 0,
    totalPrice: 8600,
    orderStatus: "pending",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "dummy-3",
    orderNumber: "ORD-4410",
    user: { _id: "u3", name: "Tanvir Hasan", email: "tanvir.h@example.com" },
    items: [
      {
        product: "p3",
        name: "Premium Onyx Edition",
        selectedSize: "L",
        quantity: 2,
        price: 15000,
        image: "/products/premium/3.jpg",
      },
    ],
    shippingAddress: {
      street: "Nasirabad",
      city: "Chittagong",
      state: "Chittagong",
      zipCode: "4000",
      country: "Bangladesh",
      phone: "01991122334",
    },
    paymentMethod: "nagad",
    paymentStatus: "paid",
    itemsPrice: 30000,
    shippingPrice: 150,
    taxPrice: 0,
    totalPrice: 30150,
    orderStatus: "delivered",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let order: IOrder | undefined = undefined;

  const res = await getOrderByIdAction(id);
  if (res.success) {
    order = res.data;
  } else {
    // Fallback to dummy data for testing
    order = dummyOrders.find((o) => o._id === id);
  }

  if (!order) {
    return (
      <div className="p-12 text-center text-neutral-500">Order not found</div>
    );
  }

  return <OrderDetails order={order} />;
}
