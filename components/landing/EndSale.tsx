"use client";

import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBag01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { Product } from "@/constants/products";
import { useState, useEffect } from "react";
import { getProductsAction } from "@/lib/actions";

const ProductCard = ({
  product,
  index,
}: {
  product: Product;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative flex flex-col h-full"
    >
      <Link href={`/products/${product.slug}`} className="flex flex-col h-full">
        <div className="relative aspect-4/5 overflow-hidden rounded-2xl shadow-lg bg-slate-100">
          {/* Badges */}
          <div className="absolute top-4 left-4 z-20 flex flex-col items-start gap-2">
            {product.badge && (
              <span className="bg-[#E2FF3B] text-black text-[11px] font-bold px-3 py-1 uppercase tracking-wider rounded-full shadow-sm">
                {product.badge}
              </span>
            )}
            {product.discountPrice && (
              <span className="bg-red-600 text-white text-[11px] font-bold px-3 py-1 uppercase tracking-wider rounded-full shadow-sm">
                Save{" "}
                {Math.round(
                  ((product.price - product.discountPrice) / product.price) *
                    100
                )}
                %
              </span>
            )}
          </div>

          {/* Image */}
          <div className="relative h-full w-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
            />
            {product.images[1] && (
              <Image
                src={product.images[1]}
                alt={`${product.name} hover`}
                fill
                className="absolute inset-0 object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:opacity-100 group-hover:scale-105"
              />
            )}
          </div>

          {/* Hover Action Overlay */}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />

          {/* Quick Add Icon */}
          <motion.div
            className="absolute bottom-4 right-4 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="bg-white/90 backdrop-blur-md p-3 cursor-pointer shadow-lg rounded-full text-black hover:bg-black hover:text-white transition-colors duration-300">
              <HugeiconsIcon icon={ShoppingBag01Icon} size={20} />
            </div>
          </motion.div>
        </div>

        {/* Info Section */}
        <div className="mt-5 flex flex-col grow space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className="flex-1 font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-300 min-h-[48px] line-clamp-2">
              {product.name}
            </h3>
            <div className="flex flex-col items-end shrink-0">
              <span className="font-bold text-gray-900">
                ৳{product.discountPrice || product.price}
              </span>
              {product.discountPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ৳{product.price}
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 line-clamp-2 mt-auto">
            {product.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

const TopProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getProductsAction({ limit: 4 });
        if (result.success && Array.isArray(result.data)) {
          // Show only top 4 products for the landing page section
          setProducts(result.data.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch top products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-24 px-4 md:px-10 lg:px-20">
      <div className="mx-auto max-w-8xl">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-red-600 font-bold text-sm uppercase tracking-widest block"
            >
              Curated Collection
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900"
            >
              Top Products
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/products"
              className="group flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-900 hover:text-red-600 transition-colors duration-300"
            >
              View All Collection
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={20}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {loading ? (
            // Skeleton loader
            [...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-4/5 bg-gray-100 rounded-2xl" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((product, index) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                index={index}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500">
              No products found.
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="mt-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/products"
              className="inline-flex items-center justify-center bg-gray-900 px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-xl hover:bg-red-600 hover:shadow-red-600/30 transition-all duration-300 rounded-full"
            >
              Explore Full Catalog
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default TopProducts;
