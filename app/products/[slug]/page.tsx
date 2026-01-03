"use client";

import React, { useState } from "react";
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
import { products } from "@/constants/products";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const product = products.find((p) => p.slug === slug);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

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
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-red-600 transition-colors"
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
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            <div className="p-2 rounded-full border border-gray-100 group-hover:border-black transition-colors">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
            </div>
            Back
          </button>

          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-gray-400">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-black">
              Collection
            </Link>
            <span>/</span>
            <span className="text-black">{product.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="font-bold text-lg">
              ৳{product.discountPrice || product.price}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-16">
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
                {product.images.map((_, idx) => (
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
              {product.images.map((img, idx) => (
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
                  <span className="text-3xl font-bold text-gray-900">
                    ৳{product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      ৳{product.price}
                    </span>
                  )}
                  {product.discountPrice && (
                    <span className="text-sm font-bold text-red-600 uppercase tracking-wider">
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
                <div className="flex items-center justify-between text-sm font-bold uppercase tracking-wider">
                  <span>Select Size</span>
                  <button className="text-gray-400 hover:text-black flex items-center gap-2">
                    Size Guide{" "}
                    <HugeiconsIcon icon={InformationCircleIcon} size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-14 flex items-center justify-center rounded-2xl font-bold transition-all border-2 ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-900 border-gray-100 hover:border-gray-300"
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
                  className="group relative w-full h-20 bg-black disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-[24px] font-black uppercase tracking-widest text-lg overflow-hidden transition-all active:scale-95 flex items-center justify-center gap-4"
                >
                  <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 flex items-center gap-3">
                    <HugeiconsIcon icon={ShoppingBag01Icon} size={24} />
                    {selectedSize ? "Add to Cart" : "Select a Size"}
                  </span>
                </button>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                    <HugeiconsIcon
                      icon={DeliveryTruck01Icon}
                      size={20}
                      className="text-green-600"
                    />
                    <span>Free shipping on orders over ৳5000</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={20}
                      className="text-green-600"
                    />
                    <span>In stock and ready to ship</span>
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
                    {product.features.map((feature, idx) => (
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
      <section className="bg-gray-50 py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
              You Might Also Like
            </h2>
            <Link
              href="/products"
              className="text-sm font-bold uppercase tracking-widest text-red-600 hover:text-black transition-colors flex items-center gap-2"
            >
              Browse More <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {products
              .filter((p) => p.slug !== slug)
              .slice(0, 3)
              .map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`} className="group">
                  <div className="relative aspect-square rounded-[32px] overflow-hidden bg-white shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2">
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="mt-6 flex justify-between items-center px-2">
                    <h3 className="font-bold text-gray-900">{p.name}</h3>
                    <span className="font-black text-sm text-gray-900">
                      ৳{p.discountPrice || p.price}
                    </span>
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
