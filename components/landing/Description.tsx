"use client";

import React from "react";
import { motion } from "motion/react";
import Image from "next/image";

import Link from "next/link";

const Description = () => {
  return (
    <section className="bg-white py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="mx-auto max-w-8xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          {/* Left: Overlapping Image Composition */}
          <div className="relative order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative aspect-4/3 w-full lg:w-[110%] ml-auto"
            >
              {/* Background Image: Landscape/Atmosphere */}
              <Image
                src="/Hero/m-landing-1.jpeg"
                alt="Scandinavian Landscape"
                fill
                className="object-cover rounded-sm grayscale-[0.2]"
              />
            </motion.div>

            {/* Foreground Image: Product Detail */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1, ease: "circOut" }}
              className="absolute -bottom-12 -left-4 md:-left-12 w-2/3 md:w-1/2 aspect-square bg-transparent backdrop-blur-sm rounded-md shadow p-2"
            >
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src="/Hero/m-landing-9.jpeg"
                  alt="Product Highlight"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-1000"
                />
              </div>
            </motion.div>
          </div>

          {/* Right: Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-1 lg:order-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black leading-[1.1]">
                <span className="text-red-600">Designed</span> for the Elements.{" "}
                <br className="hidden md:block" />
                Defined by <span className="text-[#8B7355]">Simplicity</span>.
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-black/70 text-lg md:text-xl font-medium max-w-xl leading-relaxed"
            >
              Rooted in Scandinavian minimalism, M-11 redefines everyday
              footwear through a lens of timeless design and refined
              craftsmanship. Each pair is thoughtfully constructed from premium
              materials and engineered for seasonal versatility — balancing
              understated luxury with functional performance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Link
                href="/products"
                className="bg-red-600 px-12 py-4 text-white text-sm font-bold uppercase tracking-widest hover:bg-red-500 transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer rounded-full duration-300 inline-block"
              >
                Read More
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Description;
