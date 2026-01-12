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
          category: selectedCategory === "All" ? undefined : selectedCategory,
          search: searchQuery,
        });

        if (result.success && Array.isArray(result.data)) {
          setProducts(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const categories = ["All", "Grand Series", "Simple Series"];

  // Client-side filtering and sorting
  const filteredProducts = React.useMemo(() => {
    let filtered = [...products];

    // Filter by search query (client-side backup)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Sort products
    if (sortBy === "price-low") {
      filtered.sort(
        (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)
      );
    } else if (sortBy === "price-high") {
      filtered.sort(
        (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)
      );
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => {
        const dateA = new Date(
          (a as Product & { createdAt?: string }).createdAt || 0
        ).getTime();
        const dateB = new Date(
          (b as Product & { createdAt?: string }).createdAt || 0
        ).getTime();
        return dateB - dateA;
      });
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy]);

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
      <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-2xl border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-8xl mx-auto px-4 py-4 md:py-6 md:px-10 lg:px-20">
          <div className="flex flex-col gap-4 md:gap-5">
            {/* Search */}
            <div className="relative w-full group">
              <HugeiconsIcon
                icon={Search01Icon}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200"
                strokeWidth={2.5}
                size={20}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-12 py-3.5 md:py-4 bg-white border border-gray-200 hover:border-gray-300 focus:border-red-600 rounded-full text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-red-600/10 transition-all duration-200 placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={16} />
                </button>
              )}
            </div>

            {/* Filters & Sort */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 md:gap-4 w-full">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 md:px-6 py-2.5 md:py-3 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-black text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Advanced Sort Dropdown */}
              <div className="relative group w-full sm:w-auto sm:min-w-[200px]">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                  <HugeiconsIcon
                    icon={Sorting05Icon}
                    size={20}
                    strokeWidth={2.5}
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 pl-14 pr-12 py-3.5 md:py-4 rounded-full text-sm font-bold uppercase tracking-wide text-gray-900 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 transition-all duration-200 cursor-pointer"
                >
                  <option value="default">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg
                    width="14"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L7 7L13 1"
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
