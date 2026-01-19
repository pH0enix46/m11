"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ShoppingBag01Icon,
  CheckmarkCircle02Icon,
  DeliveryTruck01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { Product } from "@/constants/products";
import { useCart } from "@/context/CartContext";
import { getProductBySlugAction, getProductsAction } from "@/lib/actions";

const ProductDetailPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const productResult = await getProductBySlugAction(slug);

        if (productResult.success && productResult.data) {
          setProduct(productResult.data);

          const recResult = await getProductsAction({ limit: 5 });
          if (recResult.success && Array.isArray(recResult.data)) {
            setRecommendations(
              recResult.data.filter((p: Product) => p.slug !== slug)
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [slug]);

  const handleAddToCart = () => {
    if (product && selectedSize) {
      addToCart(product, selectedSize);
    }
  };

  // Helper to check stock for a specific size
  const getSizeStock = (sizeName: string) => {
    const sizeData = product?.sizeStock?.find((s) => s.size === sizeName);
    return sizeData ? sizeData.stock : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full" />
          <div className="h-4 bg-gray-100 rounded w-48" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-9xl font-black text-gray-100 italic">404</h1>
          <h2 className="text-3xl font-bold text-gray-900">
            Product not found
          </h2>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-red-600 transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
            Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-2xl border-b border-gray-100/50 shadow-sm transition-all duration-300 pt-10">
        <div className="max-w-8xl mx-auto px-4 md:px-10 lg:px-20 h-16 md:h-20 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 md:gap-3 text-xs md:text-sm font-black uppercase tracking-wider text-gray-600 hover:text-black transition-all cursor-pointer"
          >
            <div className="p-2 rounded-full border-2 border-gray-100 group-hover:bg-black group-hover:text-white transition-all">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            </div>
            <span>Back</span>
          </button>

          <div className="font-bold text-base md:text-lg text-black">
            ৳{product.discountPrice || product.price}
          </div>
        </div>
      </div>

      <main className="max-w-8xl mx-auto px-4 md:px-10 lg:px-20 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-20 mt-16 md:mt-8">
          {/* Left: Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-square md:aspect-4/5 rounded-3xl overflow-hidden bg-gray-50">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative h-full w-full"
              >
                <Image
                  src={product.images[activeImage]}
                  alt={product.name}
                  fill
                  className={`object-cover transition-all duration-700 ${
                    isOutOfStock ? "grayscale contrast-125 brightness-90" : ""
                  }`}
                  priority
                />
              </motion.div>
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] z-10">
                  <span className="bg-black text-white px-8 py-3 rounded-full text-sm font-black uppercase tracking-[0.3em] shadow-2xl ring-1 ring-white/20">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === idx
                      ? "border-black scale-95"
                      : "border-transparent opacity-60"
                  } ${isOutOfStock ? "grayscale" : ""}`}
                >
                  <Image
                    src={img}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-5 space-y-8">
            <header className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                    isOutOfStock
                      ? "bg-gray-200 text-gray-500"
                      : "bg-black text-white"
                  }`}
                >
                  {product.category}
                </span>
                {isOutOfStock ? (
                  <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                    Sold Out
                  </span>
                ) : (
                  product.badge && (
                    <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full italic">
                      {product.badge}
                    </span>
                  )
                )}
              </div>
              <h1
                className={`text-4xl md:text-5xl font-black tracking-tight leading-none ${
                  isOutOfStock ? "text-gray-400" : "text-gray-900"
                }`}
              >
                {product.name}
              </h1>
              <div className="flex items-baseline gap-4">
                <span
                  className={`text-3xl font-black ${
                    isOutOfStock ? "text-gray-400" : "text-gray-950"
                  }`}
                >
                  ৳{product.discountPrice || product.price}
                </span>
                {!isOutOfStock && product.discountPrice && (
                  <span className="text-xl font-bold text-gray-400 line-through">
                    ৳{product.price}
                  </span>
                )}
              </div>
            </header>

            <div className="h-px bg-gray-100" />

            {/* Size Selection */}
            <section className="space-y-6">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span>Select Size</span>
                <span className="text-gray-400">UK/BD Sizing</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {product.sizes
                  .sort((a: string, b: string) => Number(a) - Number(b))
                  .map((size) => {
                    const sizeStock = getSizeStock(size);
                    const isSizeSoldOut = sizeStock <= 0;

                    return (
                      <button
                        key={size}
                        disabled={isSizeSoldOut}
                        onClick={() => setSelectedSize(size)}
                        className={`h-14 flex flex-col items-center justify-center rounded-2xl font-black text-sm transition-all border-2 relative overflow-hidden ${
                          selectedSize === size
                            ? "bg-black text-white border-black scale-105 shadow-xl"
                            : isSizeSoldOut
                            ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                            : "bg-white text-gray-700 border-gray-100 hover:border-black"
                        }`}
                      >
                        <span>{size}</span>
                        {isSizeSoldOut && (
                          <span className="text-[8px] uppercase absolute bottom-1 opacity-60">
                            Sold
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </section>

            {/* Action Button */}
            <section className="space-y-8">
              <button
                disabled={isOutOfStock || !selectedSize}
                onClick={handleAddToCart}
                className="group relative w-full h-20 bg-black disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-[24px] font-black uppercase tracking-widest text-lg overflow-hidden transition-all active:scale-[0.98] flex items-center justify-center gap-4 shadow-xl shadow-black/10"
              >
                {!isOutOfStock && !selectedSize && (
                  <div className="absolute inset-0 bg-gray-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                )}
                {!isOutOfStock && selectedSize && (
                  <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                )}

                <span className="relative z-10 flex items-center gap-3">
                  <HugeiconsIcon icon={ShoppingBag01Icon} size={24} />
                  <span>
                    {isOutOfStock
                      ? "Stock Out"
                      : selectedSize
                      ? "Add to cart"
                      : "Select Your Size"}
                  </span>
                </span>
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-gray-700">
                  <div className="p-1.5 bg-green-50 rounded-full">
                    <HugeiconsIcon
                      icon={DeliveryTruck01Icon}
                      size={14}
                      className="text-green-600"
                    />
                  </div>
                  <span>
                    {isOutOfStock
                      ? "Restocking soon"
                      : "Free global express shipping"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-gray-700">
                  <div className="p-1.5 bg-green-50 rounded-full">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={14}
                      className="text-green-600"
                    />
                  </div>
                  <span>Authentic Handcrafted Leather</span>
                </div>
              </div>
            </section>

            <div className="h-px bg-gray-100" />

            <section className="prose prose-sm">
              <p className="text-base font-medium text-gray-900 leading-relaxed">
                {product.description}
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Recommendations */}
      <section className="bg-gray-50/50 py-24 px-4 md:px-10 lg:px-20 border-t border-gray-100">
        <div className="max-w-8xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight italic mb-12">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group space-y-4"
              >
                <div className="aspect-4/5 relative bg-gray-200 rounded-3xl overflow-hidden">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className={`object-cover transition-transform duration-700 group-hover:scale-110 ${
                      p.stock === 0 ? "grayscale" : ""
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{p.name}</h3>
                  <p className="font-black">৳{p.discountPrice || p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
