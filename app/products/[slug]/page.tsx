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
  ArrowRight01Icon,
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

          // Fetch recommendations (just all products for now)
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
          <p className="text-gray-500">
            The shoe you&apos;re looking for might have walked away or
            doesn&apos;t exist in our collection.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-red-600 transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
            Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-2xl border-b border-gray-100/50 shadow-sm transition-all duration-300 mt-20">
        <div className="max-w-8xl mx-auto px-4 md:px-10 lg:px-20 h-24 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-3 text-sm font-black uppercase tracking-widest text-gray-600 hover:text-black transition-all duration-300 cursor-pointer"
          >
            <div className="p-2.5 rounded-full border-2 border-gray-100 group-hover:border-black group-hover:bg-black group-hover:text-white transition-all duration-300">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            </div>
            Back
          </button>

          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span className="opacity-30">/</span>
            <Link
              href="/products"
              className="hover:text-black transition-colors"
            >
              Collection
            </Link>
            <span className="opacity-30">/</span>
            <span className="text-black italic">{product.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="font-bold text-lg text-black">
              ৳{product.discountPrice || product.price}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-8xl mx-auto px-4 md:px-10 lg:px-20 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-square md:aspect-4/5 rounded-[40px] overflow-hidden bg-gray-50 group">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative h-full w-full"
              >
                <Image
                  src={product.images[activeImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>

              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />

              {/* Image Indicators */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
                {product.images.map((_: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`h-2 transition-all duration-300 rounded-full ${
                      activeImage === idx
                        ? "w-10 bg-white"
                        : "w-2 bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === idx
                      ? "border-red-600 ring-4 ring-red-600/10"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="space-y-8">
              <header className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {product.category}
                  </span>
                  {product.badge && (
                    <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full italic">
                      {product.badge}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.1]">
                  {product.name}
                </h1>

                <div className="flex items-baseline gap-4">
                  <span className="text-3xl md:text-4xl font-black text-gray-950">
                    ৳{product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <span className="text-xl font-bold text-gray-400 line-through">
                      ৳{product.price}
                    </span>
                  )}
                  {product.discountPrice && (
                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                      Save{" "}
                      {Math.round(
                        ((product.price - product.discountPrice) /
                          product.price) *
                          100
                      )}
                      % OFF
                    </span>
                  )}
                </div>
              </header>

              <div className="h-px bg-gray-100 w-full" />

              <section className="space-y-6">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-gray-950">
                  <span>Select Size</span>
                  <button className="text-gray-400 hover:text-black flex items-center gap-2 transition-colors cursor-pointer">
                    Size Guide{" "}
                    <HugeiconsIcon icon={InformationCircleIcon} size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-14 flex items-center justify-center rounded-2xl font-black text-sm transition-all border-2 cursor-pointer ${
                        selectedSize === size
                          ? "bg-black text-white border-black shadow-xl shadow-black/20 scale-105"
                          : "bg-white text-gray-700 border-gray-100 hover:border-black hover:text-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-8">
                <button
                  disabled={!selectedSize}
                  onClick={handleAddToCart}
                  className="group relative w-full h-20 bg-black disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-[24px] font-black uppercase tracking-widest text-lg overflow-hidden transition-all active:scale-[0.98] flex items-center justify-center gap-4 cursor-pointer shadow-2xl shadow-black/10"
                >
                  <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 flex items-center gap-3">
                    <HugeiconsIcon icon={ShoppingBag01Icon} size={24} />
                    {selectedSize ? "Secure Checkout" : "Select Your Size"}
                  </span>
                </button>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-gray-700">
                    <div className="p-1.5 bg-green-50 rounded-full">
                      <HugeiconsIcon
                        icon={DeliveryTruck01Icon}
                        size={16}
                        className="text-green-600"
                      />
                    </div>
                    <span>Free global express shipping</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-gray-700">
                    <div className="p-1.5 bg-green-50 rounded-full">
                      <HugeiconsIcon
                        icon={CheckmarkCircle02Icon}
                        size={16}
                        className="text-green-600"
                      />
                    </div>
                    <span>Limited batch - Ready to ship</span>
                  </div>
                </div>
              </section>

              <div className="h-px bg-gray-100 w-full" />

              <section className="space-y-6">
                <div className="prose prose-sm text-gray-500">
                  <p className="text-base font-medium text-gray-900 mb-4">
                    {product.description}
                  </p>
                  <ul className="space-y-3 p-0 list-none font-medium">
                    {product.features &&
                      product.features.length > 0 &&
                      product.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                          {feature}
                        </li>
                      ))}
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Recommended Section (Simple) */}
      <section className="bg-gray-50/50 py-32 px-4 md:px-10 lg:px-20 border-t border-gray-100 overflow-hidden">
        <div className="max-w-8xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Complete the look
              </p>
              <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight italic">
                You Might Also Like
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden md:flex items-center gap-2 group cursor-pointer"
            >
              <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-black transition-colors">
                View All
              </span>
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-black transition-all">
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {recommendations.map((p: Product) => (
              <Link
                key={p._id || p.id || p.slug}
                href={`/products/${p.slug}`}
                className="group space-y-4 cursor-pointer"
              >
                <div className="aspect-4/5 relative bg-gray-50 rounded-3xl overflow-hidden">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{p.name}</h3>
                  <p className="text-sm font-black text-black">
                    ৳{p.discountPrice || p.price}
                  </p>
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
