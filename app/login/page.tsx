"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  UserIcon,
  ViewIcon,
  ViewOffSlashIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { loginAction, registerAction } from "@/lib/actions";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";

interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: string;
}

const AuthPage = () => {
  const { login: authLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    identifier: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData({ ...formData, phone: value || "" });
  };

  const validateForm = () => {
    if (!isLogin) {
      // Registration validation
      if (!formData.name.trim()) {
        setError("Please enter your full name");
        return false;
      }
      if (!formData.email.trim()) {
        setError("Please enter your email address");
        return false;
      }
      if (!formData.phone) {
        setError("Please enter your phone number");
        return false;
      }
      if (!isValidPhoneNumber(formData.phone)) {
        setError("Please enter a valid phone number");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
    } else {
      // Login validation
      if (!formData.identifier.trim()) {
        setError("Please enter your phone number or email");
        return false;
      }
      if (!formData.password) {
        setError("Please enter your password");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    let payload;
    if (isLogin) {
      const isEmail = formData.identifier.includes("@");
      payload = isEmail
        ? { email: formData.identifier, password: formData.password }
        : { phone: formData.identifier, password: formData.password };
    } else {
      // For registration, extract only the phone number without country code for Bangladesh
      let phoneNumber = formData.phone;

      // If it starts with +880, remove it and add 0
      if (phoneNumber.startsWith("+880")) {
        phoneNumber = "0" + phoneNumber.substring(4);
      }

      payload = {
        name: formData.name,
        email: formData.email,
        phone: phoneNumber,
        password: formData.password,
      };
    }

    try {
      const data = isLogin
        ? await loginAction(payload)
        : await registerAction(payload);

      if (data.success) {
        authLogin(data.user as User);
        if (data.user?.role === "admin" || data.user?.role === "Admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch {
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

        <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-xl shadow-black/2 border border-black/5">
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
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-[#E60000] transition-colors z-10">
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
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-[#E60000] transition-colors z-10">
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

                  {/* Phone Input for Registration */}
                  <div className="relative group phone-input-wrapper">
                    <PhoneInput
                      international
                      defaultCountry="BD"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      placeholder="PHONE NUMBER"
                      className="phone-input-custom"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Phone/Email Input */}
            {isLogin && (
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-[#E60000] transition-colors z-10">
                  <HugeiconsIcon icon={Mail01Icon} size={20} />
                </div>
                <input
                  type="text"
                  name="identifier"
                  placeholder="PHONE NUMBER OR EMAIL"
                  required
                  value={formData.identifier}
                  onChange={handleInputChange}
                  className={inputStyle}
                />
              </div>
            )}

            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-[#E60000] transition-colors z-10">
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
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  password: "",
                  identifier: "",
                });
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

      {/* Custom Styles for Phone Input */}
      <style jsx global>{`
        .phone-input-wrapper {
          position: relative;
        }

        .phone-input-custom {
          width: 100%;
        }

        .phone-input-custom .PhoneInputInput {
          width: 100%;
          background: #faf4f4;
          border: 1px solid rgba(0, 0, 0, 0.05);
          padding: 16px 56px;
          border-radius: 9999px;
          outline: none;
          transition: all 0.3s;
          color: black;
          font-size: 14px;
          font-weight: 700;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .phone-input-custom .PhoneInputInput::placeholder {
          color: rgba(0, 0, 0, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .phone-input-custom .PhoneInputInput:focus {
          background: white;
          border-color: rgba(230, 0, 0, 0.4);
        }

        .phone-input-custom .PhoneInputCountry {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          padding: 0;
          margin: 0;
        }

        .phone-input-custom .PhoneInputCountryIcon {
          width: 24px;
          height: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }

        .phone-input-custom .PhoneInputCountrySelectArrow {
          color: rgba(0, 0, 0, 0.3);
          opacity: 1;
          width: 8px;
          height: 8px;
          margin-left: 4px;
        }

        .phone-input-custom
          .PhoneInputCountrySelect:focus
          + .PhoneInputCountryIcon
          + .PhoneInputCountrySelectArrow {
          color: #e60000;
        }

        .phone-input-custom .PhoneInputCountrySelect {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 60px;
          z-index: 1;
          border: 0;
          opacity: 0;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
