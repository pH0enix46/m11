"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import Image from "next/image";
import { getProductsAction } from "@/lib/actions";
import { IProduct } from "@/lib/types";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [trendingProducts, setTrendingProducts] = useState<IProduct[]>([]);

  // Fetch trending products on mount
  useEffect(() => {
    const fetchTrending = async () => {
      const response = await getProductsAction({ limit: 6 });
      if (response.success) {
        setTrendingProducts(response.data.products || response.data);
      }
    };
    if (isOpen) fetchTrending();
  }, [isOpen]);

  // Search logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        const response = await getProductsAction({ search: searchQuery });
        if (response.success) {
          setSearchResults(response.data.products || response.data);
        }
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Reset on close
  // No-op to avoid lint, resetting via parent or logic below if needed
  // Alternatively, we can reset search results when searchQuery is empty in the render logic or effect

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100"
          />

          {/* Search Panel */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 w-full max-h-[85vh] md:max-h-[75vh] bg-white z-101 shadow-2xl overflow-y-auto"
          >
            <div className="max-w-8xl mx-auto px-6 md:px-12 pt-10 md:pt-16 pb-24 md:pb-32">
              {/* Search Header */}
              <div className="flex items-center gap-6 md:gap-12">
                <div className="flex-1 relative group">
                  <HugeiconsIcon
                    icon={Search01Icon}
                    size={28}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-red-600 transition-colors"
                  />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What are you looking for?"
                    className="w-full bg-transparent border-b-2 border-black/10 pl-10 md:pl-12 py-4 mb-2 text-xl md:text-4xl font-black tracking-tight outline-none focus:border-red-600 transition-all text-black placeholder:text-black/10"
                  />
                  {isSearching && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                      <div className="w-6 h-6 border-3 border-red-600/20 border-t-red-600 rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-all hover:rotate-90 group cursor-pointer"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={24}
                    className="text-black/60 group-hover:text-black"
                  />
                </button>
              </div>

              {/* Suggestions or Results */}
              <div className="mt-12">
                {searchQuery.length < 2 ? (
                  <div className="space-y-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                      Trending Products
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {trendingProducts.map((product, idx) => (
                        <motion.div
                          key={`trending-${product._id}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                        >
                          <Link
                            href={`/products/${product.slug}`}
                            onClick={onClose}
                            className="group block space-y-3"
                          >
                            <div className="relative aspect-4/5 bg-gray-50 rounded-2xl overflow-hidden">
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="text-[11px] font-black text-black group-hover:text-red-600 transition-colors line-clamp-1 uppercase">
                                {product.name}
                              </h4>
                              <p className="text-[10px] font-bold text-black/60">
                                ৳{product.price}
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-black/5 pb-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
                        {searchResults.length}{" "}
                        {searchResults.length === 1 ? "Result" : "Results"} for
                        &quot;{searchQuery}&quot;
                      </h3>
                    </div>

                    {searchResults.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {searchResults.map((product, idx) => (
                          <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                          >
                            <Link
                              href={`/products/${product.slug}`}
                              onClick={onClose}
                              className="group block space-y-3"
                            >
                              <div className="relative aspect-4/5 bg-gray-50 rounded-2xl overflow-hidden">
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {product.discountPrice &&
                                product.discountPrice > 0 ? (
                                  <div className="absolute top-2 right-2 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase">
                                    Sale
                                  </div>
                                ) : null}
                              </div>
                              <div className="space-y-0.5">
                                <h4 className="text-xs font-black text-black group-hover:text-red-600 transition-colors line-clamp-1 uppercase">
                                  {product.name}
                                </h4>
                                <p className="text-[11px] font-bold text-black/60">
                                  ৳{product.price}
                                </p>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      !isSearching && (
                        <div className="text-center py-12 md:py-20 bg-gray-50 rounded-[40px] border border-dashed border-black/5">
                          <p className="text-base font-black text-black/30">
                            No products found matching your search.
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
