"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  UserIcon,
  SmartPhone01Icon,
  ViewIcon,
  ViewOffSlashIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin
      ? { phone: formData.phone, password: formData.password }
      : formData;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/");
        router.refresh();
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.log("Auth try Error:", err);
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Shared Input Style
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
            {isLogin ? "Member Login" : "Create Account"}
          </h2>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-xl shadow-black/[0.02] border border-black/5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-[#E60000] transition-colors">
                      <HugeiconsIcon icon={UserIcon} size={20} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="FULL NAME"
                      required={!isLogin}
                      value={formData.name}
                      onChange={handleInputChange}
                      className={inputStyle}
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-[#E60000] transition-colors">
                      <HugeiconsIcon icon={Mail01Icon} size={20} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="EMAIL ADDRESS"
                      required={!isLogin}
                      value={formData.email}
                      onChange={handleInputChange}
                      className={inputStyle}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-[#E60000] transition-colors">
                <HugeiconsIcon icon={SmartPhone01Icon} size={20} />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="PHONE NUMBER"
                required
                value={formData.phone}
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
                {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
              </span>
              {!loading && (
                <div className="group-hover:translate-x-1 transition-transform">
                  <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-black/5 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-black/40 hover:text-[#E60000] text-[10px] font-black uppercase tracking-[0.2em] transition-all"
            >
              {isLogin ? "New here? Create an account" : "Back to Secure Login"}
            </button>
          </div>
        </div>

        <p className="mt-12 text-center text-black/20 text-[9px] font-bold uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} M-11 FOOTWEAR. MADE FOR MAKERS.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
