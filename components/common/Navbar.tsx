"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  UserIcon,
  ShoppingBag01Icon,
  Menu01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Coming Soon", href: "/coming-soon" },
    { name: "Footwear", href: "/footwear" },
    { name: "Accessories", href: "/accessories" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex flex-col font-sans transition-all duration-300">
      {/* Top Banner */}
      <AnimatePresence>
        {!scrolled && (
          <motion.div
            initial={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full bg-[#E60000] py-2 text-white text-[10px] md:text-[11px] text-center font-bold uppercase tracking-[0.2em] overflow-hidden"
          >
            Sign up for our newsletter and receive 10% off your order
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl py-4 shadow-sm"
            : "bg-slate-50 py-6 md:py-8"
        } border-b border-black/5 px-6 md:px-12 flex items-center justify-between relative text-black`}
      >
        {/* Left Side: Desktop Links & Mobile Menu Trigger */}
        <div className="flex-1 flex items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden hover:text-red-600 transition-colors p-1"
          >
            <HugeiconsIcon icon={Menu01Icon} size={24} />
          </button>

          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold tracking-widest">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-red-600 transition-all uppercase relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>

        {/* Center: Logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center p-2"
        >
          <div
            className={`relative transition-all duration-500 ${
              scrolled
                ? "w-10 h-10 md:w-12 md:h-12"
                : "w-12 h-12 md:w-16 md:h-16"
            }`}
          >
            <Image
              src="/brand-circle.png"
              alt="M-11 Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Right Side: Icons */}
        <div className="flex-1 flex items-center justify-end gap-4 md:gap-7">
          <button className="hover:text-red-600 transition-colors p-1 cursor-pointer">
            <HugeiconsIcon icon={Search01Icon} size={20} />
          </button>
          <Link
            href="/account"
            className="hidden sm:block hover:text-red-600 transition-colors p-1 cursor-pointer"
          >
            <HugeiconsIcon icon={UserIcon} size={20} />
          </Link>
          <button className="hover:text-red-600 transition-colors p-1 cursor-pointer relative group">
            <HugeiconsIcon icon={ShoppingBag01Icon} size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] flex items-center justify-center rounded-full font-bold shadow-sm transition-transform group-hover:scale-110">
              0
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-60 md:hidden"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 w-[85%] h-full bg-white p-8 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-16">
                <div className="relative w-12 h-12">
                  <Image
                    src="/brand-circle.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-8">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * (i + 1) }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-2xl font-black tracking-tighter text-black uppercase hover:text-red-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto pt-16 border-t border-black/5 flex flex-col gap-6">
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-black"
                >
                  <HugeiconsIcon icon={UserIcon} size={18} />
                  My Account
                </Link>
                <div className="flex gap-6">
                  {/* Could add social links here matching footer */}
                </div>
                <p className="text-[10px] font-bold text-black/30 tracking-widest uppercase">
                  © M-11 FOOTWEAR 2025
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
