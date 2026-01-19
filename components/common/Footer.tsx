"use client";

import React from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InstagramIcon as InstaIcon,
  Facebook02Icon as FbIcon,
  ArrowRight01Icon as ArrowIcon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";

const Footer = () => {
  const footerLinks = {
    footwear: ["All Shoes", "New Arrivals", "Best Sellers", "Sale"],
    company: ["Our Story", "Sustainability", "Materials", "Stockists"],
    support: ["FAQ", "Shipping & Returns", "Contact Us", "Size Guide"],
    legal: ["Terms & Conditions", "Privacy Policy", "Cookie Policy"],
  };

  return (
    <footer className="bg-[#FAF4F4] text-black pt-24 pb-12 px-4 md:px-8 border-t border-red-100 overflow-hidden">
      <div className="mx-auto max-w-8xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-8 mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="relative w-20 h-20 mb-6">
                <Image
                  src="/brand-circle.png"
                  alt="M-11 Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-black/60 text-sm font-medium leading-relaxed max-w-[200px]">
                MODERN AESTHETIC DESIGNED USING HIGH QUALITY MATERIALS. MADE BY
                BEST SHOE MAKERS.
              </p>
            </motion.div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-12">
            {[
              { title: "Footwear", links: footerLinks.footwear },
              { title: "Support", links: footerLinks.support },
              { title: "Company", links: footerLinks.company },
            ].map((column, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="space-y-6"
              >
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-black/40">
                  {column.title}
                </h3>
                <ul className="space-y-4">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <a
                        href="#"
                        className="text-black/70 hover:text-black text-sm font-bold transition-all duration-300 relative group inline-block"
                      >
                        {link}
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-black/40">
                NEWSLETTER
              </h3>
              <p className="text-black/60 text-sm font-medium leading-relaxed">
                Join our community and get 10% off your first order.
              </p>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full bg-white border border-black/5 px-6 py-4 rounded-full focus:border-red-600/20 outline-none transition-all placeholder:text-black/20 text-sm font-bold shadow-xs"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-[#E60000] text-white px-4 rounded-full hover:bg-[#CC0000] transition-all flex items-center justify-center cursor-pointer">
                  <HugeiconsIcon icon={ArrowIcon} size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-6 justify-center md:justify-start"
            >
              <a
                href="https://www.instagram.com/m11.bd?igsh=Ym0wdjFrNHl4Mnky"
                className="text-black/40 hover:text-[#E60000] transition-colors duration-300"
              >
                <HugeiconsIcon icon={InstaIcon} size={24} />
              </a>
              <a
                href="https://www.facebook.com/share/183oG2BsZm/"
                className="text-black/40 hover:text-[#E60000] transition-colors duration-300"
              >
                <HugeiconsIcon icon={FbIcon} size={24} />
              </a>
            </motion.div>
            <p className="text-black/30 text-[10px] font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} M-11 FOOTWEAR. ALL RIGHTS RESERVED.
            </p>
            <p className="text-black/20 text-[9px] font-bold uppercase tracking-[0.2em]">
              Developed by{" "}
              <a
                href="https://megatecs.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black/40 hover:text-[#E60000] transition-colors"
              >
                MegaTecs
              </a>
            </p>
          </div>

          {/* Payment Icons Placeholder */}
          <div className="flex items-center gap-4 grayscale opacity-30">
            <div className="h-6 w-10 bg-black/10 rounded-sm" />
            <div className="h-6 w-10 bg-black/10 rounded-sm" />
            <div className="h-6 w-10 bg-black/10 rounded-sm" />
            <div className="h-6 w-10 bg-black/10 rounded-sm" />
            <div className="h-6 w-10 bg-black/10 rounded-sm" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
