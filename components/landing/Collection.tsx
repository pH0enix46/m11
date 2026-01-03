"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import Image from "next/image";

const collections = [
  {
    id: 1,
    title: "Urban Boot",
    description:
      "The Urban Boot continues our pursuit of timeless design infused with technical precision.",
    image:
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1964&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Rain Boots",
    description:
      "Our take on the iconic Chelsea Boot remixed with a sneaker sole.",
    image:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2080&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Alpine Hiker",
    description:
      "Designed and built for urban escapes or terrain demanding environments.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Arena Sneaker",
    description: "A sneaker designed for the city and the elements alike.",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop",
  },
];

const CollectionCard = ({
  collection,
  index,
}: {
  collection: (typeof collections)[0];
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Parallax effect on scroll
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
      className="group relative h-[450px] md:h-[500px] w-full overflow-hidden rounded-2xl cursor-pointer"
    >
      {/* Background Image Container with Parallax and Liquid Zoom */}
      <motion.div
        style={{ y: smoothY }}
        className="absolute inset-0 h-[120%] w-full"
      >
        <Image
          src={collection.image}
          alt={collection.title}
          fill
          className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-110 brightness-[0.85] group-hover:brightness-100"
        />
        {/* Liquid/Water Overlay Mask Effect */}
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply opacity-30 transition-opacity group-hover:opacity-10" />
      </motion.div>

      {/* Decorative Gradient for Text Readability */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {collection.title}
          </h3>
          <p className="mt-2 text-white/80 text-sm md:text-base font-medium max-w-[280px] leading-relaxed">
            {collection.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
        >
          <button className="bg-red-600 px-10 py-3 text-white text-[11px] font-extrabold uppercase tracking-[0.2em] rounded-full shadow-lg transition-all duration-300 hover:bg-red-500 hover:scale-105 active:scale-95 cursor-pointer">
            Shop Now
          </button>
        </motion.div>
      </div>

      {/* Modern Edge Light Effect on Hover */}
      <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-colors duration-500 rounded-2xl pointer-events-none" />
    </motion.div>
  );
};

const Collection = () => {
  return (
    <section className="bg-white py-24 px-4 md:px-8">
      <div className="mx-auto max-w-8xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-4">
          {collections.map((collection, index) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collection;
