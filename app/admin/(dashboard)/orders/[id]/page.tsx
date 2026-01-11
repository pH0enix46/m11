import { getOrderByIdAction } from "@/lib/actions";
import OrderDetails from "@/components/admin/OrderDetails";
import { IOrder } from "@/lib/types";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await getOrderByIdAction(id);

  if (!res.success || !res.data) {
    return (
      <div className="p-12 text-center">
        <p className="text-neutral-500">Order not found</p>
        <p className="text-sm text-neutral-400 mt-2">{res.message}</p>
      </div>
    );
  }

  return <OrderDetails order={res.data} />;
}
