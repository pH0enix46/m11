"use client";

import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Target03Icon,
  Award01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

const AboutPage = () => {
  const stats = [
    { label: "Years of Excellence", value: "5+" },
    { label: "Happy Customers", value: "10K+" },
    { label: "Products Sold", value: "25K+" },
    { label: "Countries Served", value: "15+" },
  ];

  const values = [
    {
      icon: Target03Icon,
      title: "Our Mission",
      description:
        "To craft premium footwear that combines timeless elegance with modern comfort, empowering individuals to step confidently into every moment.",
    },
    {
      icon: Award01Icon,
      title: "Quality First",
      description:
        "We believe in uncompromising quality. Every pair is meticulously handcrafted using the finest materials to ensure durability and style.",
    },
    {
      icon: UserGroupIcon,
      title: "Community Driven",
      description:
        "Our customers are at the heart of everything we do. We listen, adapt, and continuously improve to serve you better.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-black mt-20">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/Hero/m-landing-9.jpeg"
            alt="About M-11"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/20" />

        <div className="relative z-10 text-center space-y-6 px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-4 py-2 bg-red-600/20 backdrop-blur-sm border border-red-600/30 text-red-400 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider inline-block mb-6">
              About M-11 Footwear
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
              Crafting Excellence,
              <br />
              <span className="text-red-500 italic">One Step</span> at a Time
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Since 2019, we&apos;ve been redefining footwear with passion,
            precision, and purpose.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-8xl mx-auto px-4 md:px-10 lg:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-500">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="max-w-8xl mx-auto px-4 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6 md:space-y-8"
            >
              <div>
                <span className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider inline-block mb-4">
                  Our Story
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-[1.1]">
                  Where Passion Meets
                  <br />
                  <span className="text-red-600 italic">Craftsmanship</span>
                </h2>
              </div>
              <div className="space-y-4 text-base md:text-lg text-gray-600 font-medium leading-relaxed">
                <p>
                  M-11 Footwear was born from a simple belief: everyone deserves
                  to walk in style and comfort. What started as a small workshop
                  in 2019 has grown into a brand trusted by thousands across the
                  globe.
                </p>
                <p>
                  We combine traditional craftsmanship with modern design
                  principles, creating footwear that doesn&apos;t just look
                  good—it feels exceptional. Every stitch, every material, every
                  detail is carefully considered to deliver products that stand
                  the test of time.
                </p>
                <p>
                  Today, M-11 represents more than just shoes. It&apos;s a
                  lifestyle, a commitment to quality, and a celebration of
                  individuality.
                </p>
              </div>
              <Link
                href="/products"
                className="inline-block bg-black hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wide text-sm transition-all duration-300 cursor-pointer"
              >
                Explore Our Collection
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-3xl md:rounded-[40px] overflow-hidden bg-gray-100">
                <Image
                  src="/products/one/1.jpeg"
                  alt="M-11 Story"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 right-2 md:-right-6 bg-red-600 text-white p-6 md:p-8 rounded-3xl shadow-2xl max-w-[200px]">
                <div className="text-3xl md:text-4xl font-black mb-2">5+</div>
                <div className="text-xs md:text-sm font-bold uppercase tracking-wider opacity-90">
                  Years of Excellence
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-gray-50/50">
        <div className="max-w-8xl mx-auto px-4 md:px-10 lg:px-20">
          <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider inline-block mb-4">
                Our Values
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-[1.1]">
                What Drives Us{" "}
                <span className="text-red-600 italic">Forward</span>
              </h2>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="bg-white border border-gray-200 rounded-3xl p-8 md:p-10 hover:border-gray-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                  <HugeiconsIcon
                    icon={value.icon}
                    size={28}
                    className="text-red-600"
                    strokeWidth={2}
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-4 tracking-tight">
                  {value.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1]">
              Ready to Step Into
              <br />
              <span className="text-red-500 italic">Excellence?</span>
            </h2>
            <p className="text-lg md:text-xl text-white/80 font-medium max-w-2xl mx-auto">
              Discover our collection of premium footwear designed for those who
              refuse to compromise on style or comfort.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/products"
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold uppercase tracking-wide text-sm transition-all duration-300 cursor-pointer"
              >
                Shop Now
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-full font-bold uppercase tracking-wide text-sm transition-all duration-300 cursor-pointer"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
