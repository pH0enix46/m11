"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  ShoppingBag01Icon,
  Sorting05Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { Product } from "@/constants/products";
import { getProductsAction } from "@/lib/actions";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("default");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await getProductsAction({
          category: selectedCategory,
          search: searchQuery,
        });

        if (result.success && Array.isArray(result.data)) {
          const sortedProducts = result.data;

          // Client-side sorting as the API sort is simple
          if (sortBy === "price-low") {
            sortedProducts.sort(
              (a: Product, b: Product) =>
                (a.discountPrice || a.price) - (b.discountPrice || b.price)
            );
          } else if (sortBy === "price-high") {
            sortedProducts.sort(
              (a: Product, b: Product) =>
                (b.discountPrice || b.price) - (a.discountPrice || a.price)
            );
          } else if (sortBy === "name") {
            sortedProducts.sort((a: Product, b: Product) =>
              a.name.localeCompare(b.name)
            );
          }

          setProducts(sortedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, sortBy]);

  const categories = ["All", "Classic", "Premium", "Sport"];

  const filteredProducts = products;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-black mt-20">
        <div className="absolute inset-0 opacity-50">
          <Image
            src="/products/one/1.jpeg"
            alt="Products Hero"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/20" />

        <div className="relative z-10 text-center space-y-4 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight"
          >
            OUR COLLECTION
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto"
          >
            Explore our premium selection of handcrafted leather footwear,
            designed for style and comfort.
          </motion.p>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-20 z-30 bg-white/90 backdrop-blur-2xl border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-8xl mx-auto px-4 py-6 md:px-10 lg:px-20">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-1/3 group">
              <HugeiconsIcon
                icon={Search01Icon}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors duration-300"
                size={18}
              />
              <input
                type="text"
                placeholder="Find your perfect pair..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-gray-100 hover:bg-white border-2 border-transparent focus:border-red-600/10 focus:bg-white rounded-2xl text-sm font-medium text-gray-900 shadow-xs transition-all outline-none cursor-text placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all cursor-pointer"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={16} />
                </button>
              )}
            </div>

            {/* Filters & Sort */}
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-5 w-full lg:w-2/3">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100/50">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-black text-white shadow-lg shadow-black/10 scale-105"
                        : "text-gray-500 hover:text-black hover:bg-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="hidden sm:block h-10 w-px bg-gray-200 mx-2" />

              {/* Advanced Sort Dropdown */}
              <div className="relative group min-w-[180px]">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-red-600 transition-colors pointer-events-none">
                  <HugeiconsIcon icon={Sorting05Icon} size={16} />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-gray-50 hover:bg-white border-2 border-transparent hover:border-gray-100 pl-11 pr-10 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-700 outline-none focus:ring-4 focus:ring-red-600/5 transition-all cursor-pointer shadow-xs"
                >
                  <option value="default">Sort Options</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Product: A-Z</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none group-hover:text-gray-600 transition-colors">
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing between Toolbar and Grid */}
      <div className="h-12 bg-white" />

      {/* Main Content */}
      <main className="max-w-8xl mx-auto px-4 py-16 md:px-10 lg:px-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-4/5 bg-gray-100 rounded-3xl" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id || product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group flex flex-col h-full"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="flex flex-col h-full"
                  >
                    <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 shrink-0">
                      {/* Badge */}
                      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                        {product.badge && (
                          <span className="bg-[#E2FF3B] text-black text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest rounded-full">
                            {product.badge}
                          </span>
                        )}
                        {product.discountPrice && (
                          <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest rounded-full">
                            Sale
                          </span>
                        )}
                      </div>

                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {product.images[1] && (
                        <Image
                          src={product.images[1]}
                          alt={product.name}
                          fill
                          className="absolute inset-0 object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-hover:scale-110"
                        />
                      )}

                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="absolute bottom-12 left-6 right-6 flex justify-between items-center translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl text-black">
                          <HugeiconsIcon icon={ShoppingBag01Icon} size={24} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col grow space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors min-h-[48px] line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="text-right shrink-0">
                          <p className="text-base font-bold text-gray-900">
                            ৳{product.discountPrice || product.price}
                          </p>
                          {product.discountPrice && (
                            <p className="text-xs text-gray-400 line-through">
                              ৳{product.price}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mt-auto">
                        {product.category}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
            <div className="bg-gray-50 p-8 rounded-full">
              <HugeiconsIcon
                icon={Search01Icon}
                size={48}
                className="text-gray-300"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              No products found
            </h2>
            <p className="text-gray-500">
              Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 text-red-600 font-bold uppercase tracking-widest text-sm hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductsPage;
