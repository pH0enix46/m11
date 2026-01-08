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
  Logout01Icon,
  UserCircleIcon,
  ShoppingBag02Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import CartSidebar from "./CartSidebar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const { user, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isAccountOpen &&
        !(e.target as HTMLElement).closest(".account-dropdown")
      ) {
        setIsAccountOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isAccountOpen]);

  const navLinks = [
    { name: "Collection", href: "/products" },
    { name: "Coming Soon", href: "/coming-soon" },
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

          <div className="relative account-dropdown">
            <button
              onClick={() =>
                user
                  ? setIsAccountOpen(!isAccountOpen)
                  : (window.location.href = "/login")
              }
              className="hover:text-red-600 transition-colors p-1 cursor-pointer flex items-center gap-2 group"
            >
              <HugeiconsIcon icon={UserIcon} size={20} />
              {user && (
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">
                  {user.name.split(" ")[0]}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isAccountOpen && user && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-black/5 p-6 z-50"
                  style={{ backdropFilter: "blur(20px)" }}
                >
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-black/5">
                      <p className="text-[10px] font-black text-black/40 uppercase tracking-widest mb-1">
                        Signed in as
                      </p>
                      <p className="text-sm font-black text-black truncate">
                        {user.name}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Link
                        href="/account"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                      >
                        <HugeiconsIcon
                          icon={UserCircleIcon}
                          size={18}
                          className="text-black/40 group-hover:text-black"
                        />
                        <span className="text-xs font-bold text-black/60 group-hover:text-black">
                          Profile
                        </span>
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                      >
                        <HugeiconsIcon
                          icon={ShoppingBag02Icon}
                          size={18}
                          className="text-black/40 group-hover:text-black"
                        />
                        <span className="text-xs font-bold text-black/60 group-hover:text-black">
                          My Orders
                        </span>
                      </Link>
                      <Link
                        href="/account/settings"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                      >
                        <HugeiconsIcon
                          icon={Settings02Icon}
                          size={18}
                          className="text-black/40 group-hover:text-black"
                        />
                        <span className="text-xs font-bold text-black/60 group-hover:text-black">
                          Settings
                        </span>
                      </Link>
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setIsAccountOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-50 transition-colors group text-red-600 cursor-pointer"
                    >
                      <HugeiconsIcon icon={Logout01Icon} size={18} />
                      <span className="text-xs font-black uppercase tracking-widest">
                        Logout
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="hover:text-red-600 transition-colors p-1 cursor-pointer relative group"
          >
            <HugeiconsIcon icon={ShoppingBag01Icon} size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] flex items-center justify-center rounded-full font-bold shadow-sm transition-transform group-hover:scale-110">
              {totalItems}
            </span>
          </button>
        </div>
      </nav>

      {/* Cart Sidebar */}
      <CartSidebar />

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
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (user) {
                      setIsAccountOpen(true);
                    } else {
                      window.location.href = "/login";
                    }
                  }}
                  className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-black"
                >
                  <HugeiconsIcon icon={UserCircleIcon} size={18} />
                  {user ? user.name : "Sign In"}
                </button>

                {user && (
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-red-600"
                  >
                    <HugeiconsIcon icon={Logout01Icon} size={18} />
                    Logout
                  </button>
                )}

                <p className="text-[10px] font-bold text-black/30 tracking-widest uppercase">
                  © M-11 FOOTWEAR {new Date().getFullYear()}
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
