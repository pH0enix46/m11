"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { mockProducts } from "@/lib/mockData";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  Search01Icon,
  FilterHorizontalIcon,
  PencilEdit02Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { motion } from "motion/react";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={20} />
          Add Product
        </Link>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
              <HugeiconsIcon icon={Search01Icon} size={20} />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl py-2.5 pl-12 pr-4 text-neutral-900 dark:text-white placeholder-neutral-500 focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          <button className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 rounded-xl text-neutral-600 dark:text-neutral-300 font-medium flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
            <HugeiconsIcon icon={FilterHorizontalIcon} size={20} />
            Filter
          </button>
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
              {filteredProducts.map((product) => (
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
                      ${product.price}
                      {product.discountPrice && (
                        <span className="text-sm text-neutral-400 line-through ml-2">
                          ${product.discountPrice}
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
                        className="p-2 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <HugeiconsIcon icon={PencilEdit02Icon} size={20} />
                      </Link>
                      <button
                        className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        onClick={() =>
                          alert("Delete functionality would go here")
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

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center text-neutral-500">
            No products found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
