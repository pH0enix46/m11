import { getOrderByIdAction } from "@/lib/actions";
import OrderDetails from "@/components/admin/OrderDetails";
import { IOrder } from "@/lib/types";

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
  }

  if (!order) {
    return (
      <div className="p-12 text-center text-neutral-500">Order not found</div>
    );
  }

  return <OrderDetails order={order} />;
}
