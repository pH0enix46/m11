"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  ViewIcon,
  ViewOffSlashIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate network delay
    setTimeout(() => {
      // Manual Check as requested: admin@gmail.com / pass123456
      if (
        formData.email === "admin@gmail.com" &&
        formData.password === "pass123456"
      ) {
        router.push("/admin");
      } else {
        setError("Invalid credentials. Please contact support.");
        setLoading(false);
      }
    }, 1000);
  };

  // Shared Input Style matching normal login
  const inputStyle =
    "w-full bg-[#FAF4F4] border border-black/5 focus:border-[#E60000]/40 focus:bg-white px-14 py-4 rounded-full outline-none transition-all placeholder:text-black/20 text-black text-sm font-bold shadow-sm";

  return (
    <div className="min-h-screen bg-[#FAF4F4] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-20 h-20 mb-4">
            <Image
              src="/brand-circle.png"
              alt="M-11 Logo"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-black/40 text-center">
            Admin Access
          </h2>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-xl shadow-black/2 border border-black/5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-[#E60000] transition-colors">
                <HugeiconsIcon icon={Mail01Icon} size={20} />
              </div>
              <input
                type="email"
                name="email"
                placeholder="ADMIN EMAIL"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={inputStyle}
              />
            </div>

            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-[#E60000] transition-colors">
                <HugeiconsIcon
                  icon={showPassword ? ViewOffSlashIcon : ViewIcon}
                  size={20}
                  className="cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="PASSWORD"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={inputStyle}
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[#E60000] text-[10px] font-black text-center uppercase tracking-widest pt-2"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E60000] text-white py-4 mt-4 rounded-full hover:bg-black transition-all duration-500 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="text-sm font-black uppercase tracking-widest">
                {loading ? "Authenticating..." : "Admin Login"}
              </span>
              {!loading && (
                <div className="group-hover:translate-x-1 transition-transform">
                  <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-black/5 text-center">
            <p className="text-black/40 text-[10px] font-bold uppercase tracking-[0.2em]">
              Authorized Personnel Only
            </p>
          </div>
        </div>

        <p className="mt-12 text-center text-black/20 text-[9px] font-bold uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} M-11 FOOTWEAR. MADE FOR MAKERS.
        </p>
      </motion.div>
    </div>
  );
}
