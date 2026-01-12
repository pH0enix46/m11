"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  InstagramIcon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";

const ComingSoonPage = () => {
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown to a specific date (adjust as needed)
  useEffect(() => {
    const targetDate = new Date("2026-03-01T00:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <div className="bg-white relative overflow-hidden py-16 md:pt-40">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-8xl mx-auto px-4 md:px-10 lg:px-20 min-h-screen flex items-center justify-center">
        <div className="w-full py-24 md:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6 md:space-y-8 text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center justify-center lg:justify-start"
              >
                <span className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider">
                  Coming Soon
                </span>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="space-y-4"
              >
                <h1 className="text-5xl md:text-5xl lg:text-8xl font-black text-gray-900 tracking-tight leading-[1.1]">
                  Something
                  <br />
                  <span className="text-red-600 italic">Amazing</span> is
                  <br />
                  on the Way
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  We&apos;re crafting an extraordinary experience for you. Get
                  ready to step into the future of footwear.
                </p>
              </motion.div>

              {/* Countdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="grid grid-cols-4 gap-3 md:gap-4 max-w-lg mx-auto lg:mx-0"
              >
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                    className="bg-white border border-gray-200 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900">
                      {String(item.value).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-500 mt-1 md:mt-2">
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Email Signup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="space-y-4"
              >
                <p className="text-sm md:text-base font-bold text-gray-900 uppercase tracking-wide">
                  Be the first to know
                </p>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:mx-0"
                >
                  <div className="relative flex-1">
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-white border border-gray-200 hover:border-gray-300 focus:border-red-600 rounded-full text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-red-600/10 transition-all duration-200 placeholder:text-gray-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-3.5 md:py-4 bg-black hover:bg-red-600 text-white rounded-full font-bold uppercase tracking-wide text-sm transition-all duration-300 cursor-pointer whitespace-nowrap"
                  >
                    Notify Me
                  </button>
                </form>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="flex items-center justify-center lg:justify-start gap-4"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Follow Us
                </span>
                <div className="flex items-center gap-3">
                  {[
                    { icon: InstagramIcon, href: "#", label: "Instagram" },
                    { icon: NewTwitterIcon, href: "#", label: "Twitter" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-black hover:bg-black text-gray-700 hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer"
                    >
                      <HugeiconsIcon
                        icon={social.icon}
                        size={18}
                        strokeWidth={2}
                      />
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <motion.div
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative aspect-square rounded-[40px] overflow-hidden bg-gray-100"
              >
                <Image
                  src="/Hero/m-landing-9.jpeg"
                  alt="Coming Soon"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-3xl p-6 shadow border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                    <span className="text-white font-black text-xl">M</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      M-11 Footwear
                    </p>
                    <p className="text-sm font-black text-gray-900">
                      Premium Collection
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-16 md:mt-24 lg:mt-32"
          >
            <div className="text-center mb-10 md:mb-12">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-500 mb-3"
              >
                What to Expect
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight"
              >
                Crafted for{" "}
                <span className="text-red-600 italic">Excellence</span>
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  title: "Premium Quality",
                  description:
                    "Handcrafted with the finest materials for unmatched comfort and durability.",
                  icon: "✨",
                },
                {
                  title: "Exclusive Designs",
                  description:
                    "Unique styles that blend contemporary fashion with timeless elegance.",
                  icon: "🎨",
                },
                {
                  title: "Limited Edition",
                  description:
                    "Each collection is carefully curated and produced in limited quantities.",
                  icon: "💎",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8 }}
                  className="bg-white border border-gray-200 rounded-3xl p-8 md:p-10 hover:border-gray-300 hover:shadow-xl transition-all duration-300 cursor-default"
                >
                  <div className="text-4xl md:text-5xl mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-4 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-20 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none hidden lg:block"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-20 left-20 w-96 h-96 bg-black/5 rounded-full blur-3xl pointer-events-none hidden lg:block"
      />
    </div>
  );
};

export default ComingSoonPage;
