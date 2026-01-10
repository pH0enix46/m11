import { getProductByIdAction } from "@/lib/actions";
import ProductForm from "@/components/admin/ProductForm";
import { IProduct } from "@/lib/types";

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  let product: IProduct | undefined = undefined;

  if (!isNew) {
    const res = await getProductByIdAction(id);
    if (res.success) {
      product = res.data;
    }
  }

  if (!isNew && !product) {
    return (
      <div className="p-12 text-center text-neutral-500">Product not found</div>
    );
  }

  return <ProductForm initialData={product} isNew={isNew} />;
}
