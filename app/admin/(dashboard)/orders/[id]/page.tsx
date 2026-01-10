import { mockOrders } from "@/lib/mockData";
import OrderDetails from "@/components/admin/OrderDetails";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = mockOrders.find((o) => o._id === id);

  if (!order) {
    return <div>Order not found</div>;
  }

  return <OrderDetails order={order} />;
}
