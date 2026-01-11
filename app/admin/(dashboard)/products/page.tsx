"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  Search01Icon,
  PencilEdit02Icon,
  Delete02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { getAllProductsAction, deleteProductAction } from "@/lib/actions";
import { IProduct } from "@/lib/types";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    productId: string | null;
    productName: string | null;
  }>({
    show: false,
    productId: null,
    productName: null,
  });

  const fetchProducts = async () => {
    try {
      const res = await getAllProductsAction();
      if (res.success) {
        setProducts(res.data);
      } else {
        toast.error(res.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("An error occurred while fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.productId) return;

    const loadingToast = toast.loading("Deleting product...");
    try {
      const res = await deleteProductAction(deleteModal.productId);
      if (res.success) {
        setProducts(products.filter((p) => p._id !== deleteModal.productId));
        toast.success("Product deleted successfully", { id: loadingToast });
      } else {
        toast.error(res.message || "Failed to delete product", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred", { id: loadingToast });
    } finally {
      setDeleteModal({ show: false, productId: null, productName: null });
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Active" ? p.isActive : !p.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ["All", "Grand Series", "Simple Series"];
  const statuses = ["All", "Active", "Draft"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Products
          </h1>
          <p className="text-neutral-500 mt-1">Manage your product catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={20} />
          Add Product
        </Link>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex flex-col lg:flex-row gap-5">
          {/* Enhanced Search */}
          <div className="relative flex-1 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-red-500 transition-colors">
              <HugeiconsIcon icon={Search01Icon} size={20} />
            </div>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-800 border-2 border-transparent focus:border-red-500/10 focus:bg-white dark:focus:bg-neutral-900 rounded-2xl py-2 pl-12 pr-12 text-neutral-900 dark:text-white placeholder-neutral-500 transition-all outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="flex bg-neutral-50 dark:bg-neutral-800 p-1 rounded-2xl border border-neutral-100 dark:border-neutral-700">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-white dark:bg-neutral-700 text-red-600 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl px-4 py-3 text-xs font-bold text-neutral-600 dark:text-neutral-300 outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  Status: {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 text-sm font-medium">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {loading
                ? [...Array(5)].map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
                          <div className="space-y-2">
                            <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-32" />
                            <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-48" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-neutral-100 dark:bg-neutral-800 rounded-full w-20" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-16" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-24" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 text-transparent">
                          Actions
                        </div>
                      </td>
                    </tr>
                  ))
                : filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden relative">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-neutral-900 dark:text-white">
                              {product.name}
                            </h3>
                            <p className="text-sm text-neutral-500 truncate max-w-[200px]">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm font-medium text-neutral-600 dark:text-neutral-300">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-900 dark:text-white">
                          ৳{product.price}
                          {product.discountPrice && (
                            <span className="text-sm text-neutral-400 line-through ml-2">
                              ৳{product.discountPrice}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              product.isActive ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {product.isActive ? "Active" : "Draft"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product._id}`}
                            className="p-2 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors cursor-pointer"
                          >
                            <HugeiconsIcon icon={PencilEdit02Icon} size={20} />
                          </Link>
                          <button
                            className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors cursor-pointer"
                            onClick={() =>
                              setDeleteModal({
                                show: true,
                                productId: product._id,
                                productName: product.name,
                              })
                            }
                          >
                            <HugeiconsIcon icon={Delete02Icon} size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!loading && filteredProducts.length === 0 && (
          <div className="p-12 text-center text-neutral-500">
            No products found matching your search.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setDeleteModal({
                  show: false,
                  productId: null,
                  productName: null,
                })
              }
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-800 p-6 overflow-hidden"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600">
                  <HugeiconsIcon icon={AlertCircleIcon} size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Delete Product?
                  </h3>
                  <p className="text-neutral-500 mt-2">
                    Are you sure you want to delete{" "}
                    <span className="font-bold text-neutral-900 dark:text-white">
                      &quot;{deleteModal.productName}&quot;
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-3 w-full pt-4">
                  <button
                    onClick={() =>
                      setDeleteModal({
                        show: false,
                        productId: null,
                        productName: null,
                      })
                    }
                    className="flex-1 px-6 py-3 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-6 py-3 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
