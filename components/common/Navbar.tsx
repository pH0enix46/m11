"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  UserIcon,
  ShoppingBag01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="w-full flex flex-col font-sans">
      {/* Top Banner */}
      <div className="w-full bg-red-600 py-3 text-white text-[10px] md:text-[11px] text-center font-bold uppercase tracking-widest">
        Sign up for our newsletter and receive 10% off your order
      </div>

      {/* Main Navbar */}
      <nav className="w-full bg-slate-50 border-b border-gray-200/80 px-6 md:px-12 py-8 flex items-center justify-between relative text-black shadow">
        {/* Left Side Links */}
        <div className="hidden md:flex items-center gap-10 text-[12px] font-bold tracking-[0.05em]">
          <Link
            href="/coming-soon"
            className="hover:text-gray-400 transition-colors uppercase"
          >
            Coming Soon
          </Link>
          <Link
            href="/footwear"
            className="hover:text-gray-400 transition-colors uppercase"
          >
            Footwear
          </Link>
          <Link
            href="/accessories"
            className="hover:text-gray-400 transition-colors uppercase"
          >
            Accessories
          </Link>
          <Link
            href="/about"
            className="hover:text-gray-400 transition-colors uppercase"
          >
            About
          </Link>
        </div>

        {/* Mobile menu space */}
        <div className="md:hidden w-8"></div>

        {/* Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer italic">
          <span className="text-4xl font-medium tracking-tight leading-none mb-1 text-red-600">
            M
          </span>
          <div className="w-[85px] h-[7px] bg-black"></div>
          <span className="text-[28px] font-medium leading-none mt-1 self-end mr-[-4px] text-red-600">
            11
          </span>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-6">
          <button className="hover:text-gray-400 transition-colors p-1 cursor-pointer">
            <HugeiconsIcon
              icon={Search01Icon}
              size={22}
              color="currentColor"
              strokeWidth={1.6}
            />
          </button>
          <button className="hidden sm:block hover:text-gray-400 transition-colors p-1 cursor-pointer">
            <HugeiconsIcon
              icon={UserIcon}
              size={22}
              color="currentColor"
              strokeWidth={1.6}
            />
          </button>
          <button className="hover:text-gray-400 transition-colors p-1 cursor-pointer relative">
            <HugeiconsIcon
              icon={ShoppingBag01Icon}
              size={22}
              color="currentColor"
              strokeWidth={1.6}
            />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
