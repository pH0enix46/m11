import { mockProducts } from "@/lib/mockData";
import ProductForm from "@/components/admin/ProductForm";

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const product = isNew ? undefined : mockProducts.find((p) => p._id === id);

  if (!isNew && !product) {
    return <div>Product not found</div>;
  }

  return <ProductForm initialData={product} isNew={isNew} />;
}
