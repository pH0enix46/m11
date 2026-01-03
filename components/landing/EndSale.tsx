"use client";

import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBag01Icon } from "@hugeicons/core-free-icons";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: string;
  image: string;
  hoverImage: string;
  badge: string;
  isLifestyle?: boolean;
}

const products: Product[] = [
  {
    id: 1,
    name: "Alpine Hiker Carbon Black",
    price: 150,
    originalPrice: 250,
    discount: "40%",
    image:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=2000&auto=format&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop",
    badge: "Final Stock",
  },
  {
    id: 2,
    name: "Alpine Hiker Midnight Blue",
    price: 150,
    originalPrice: 250,
    discount: "40%",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1996&auto=format&fit=crop",
    badge: "Final Stock",
  },
  {
    id: 3,
    name: "Classic Charcoal Grey (Water-resistant)",
    price: 110,
    originalPrice: 220,
    discount: "50%",
    image:
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1964&auto=format&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2080&auto=format&fit=crop",
    badge: "Final Stock",
    isLifestyle: true,
  },
  {
    id: 4,
    name: "Classic Granit Grey (Water-resistant)",
    price: 110,
    originalPrice: 220,
    discount: "50%",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2080&auto=format&fit=crop",
    badge: "Final Stock",
  },
];

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
      className="group relative flex flex-col"
    >
      <div className="relative aspect-4/5 overflow-hidden rounded-2xl shadow bg-slate-100">
        {/* Badges - Tight and modern */}
        <div className="absolute top-0 left-0 z-20 flex flex-col items-start pt-4 pl-4">
          <span className="bg-[#E2FF3B] text-black text-[11px] font-bold px-3 py-1 uppercase tracking-wider mb-2 rounded-full shadow-xs">
            {product.badge}
          </span>
          <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-1 uppercase tracking-wider rounded-full shadow-xs">
            Save up to {product.discount}
          </span>
        </div>

        {/* Image - Edge to Edge */}
        <div className="relative h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
          />
          <Image
            src={product.hoverImage}
            alt={`${product.name} hover`}
            fill
            className="absolute inset-0 object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:opacity-100 group-hover:scale-110"
          />
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />

        {/* Quick Add Icon (As seen in the 3rd card in image) */}
        <motion.div
          className="absolute bottom-4 right-4 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-full shadow-xs"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="bg-red-500 p-2 cursor-pointer shadow-xs rounded-full">
            <HugeiconsIcon icon={ShoppingBag01Icon} size={20} color="white" />
          </div>
        </motion.div>
      </div>

      {/* Info Section */}
      <div className="mt-4 flex items-center justify-between gap-4 text-[13px]">
        <h3 className="flex-1 font-medium text-black line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="h-px w-8 bg-black/20" />
          <span className="font-bold text-black/90">€{product.price} EUR</span>
          <span className="text-black/30 line-through">
            €{product.originalPrice} EUR
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const EndSale = () => {
  return (
    <section className="bg-white py-24 px-4 md:px-8">
      <div className="mx-auto max-w-8xl">
        {/* Header */}
        <div className="mb-16 text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-black"
          >
            End of Season Sale
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-black/60 font-medium"
          >
            Up to 50% off
          </motion.p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Footer Action */}
        <div className="mt-20 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 px-14 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[0_10px_30px_rgba(220,38,38,0.3)] hover:shadow-[0_15px_40px_rgba(220,38,38,0.4)] transition-all duration-300 cursor-pointer rounded-full"
          >
            Shop Now
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default EndSale;
