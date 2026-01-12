"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { updateProfileAction } from "@/lib/actions";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Mail01Icon,
  SmartPhone01Icon,
  LockPasswordIcon,
  ArrowLeft01Icon,
  Tick01Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SettingsPage = () => {
  const { user, login, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
    confirmPassword: "",
  });

  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-black/5 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      setIsLoading(false);
      return;
    }

    const payload: {
      name: string;
      email: string;
      phone: string;
      password?: string;
    } = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    const response = await updateProfileAction(payload);

    if (response.success && response.user) {
      login(response.user);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setFormData({ ...formData, password: "", confirmPassword: "" });
    } else {
      setMessage({ type: "error", text: response.message });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-36 pb-24 px-4 md:px-8">
      <div className="max-w-8xl mx-auto space-y-12">
        {/* Back Button */}
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-red-600/60 hover:text-black transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-black/5 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
          </div>
          Back to Account
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-black uppercase leading-none">
            Settings
          </h1>
          <p className="text-sm md:text-base font-bold text-black/60 max-w-xl">
            Take full control of your M-11 experience. Update your account
            profile, manage security, and set your preferences.
          </p>
        </div>

        {/* Form Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-8 bg-white rounded-[48px] p-8 md:p-16 border border-black/5 shadow-sm space-y-12"
          >
            {message.text && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-6 rounded-3xl flex items-center gap-4 ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    message.type === "success" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <HugeiconsIcon
                    icon={
                      message.type === "success" ? Tick01Icon : ArrowLeft01Icon
                    }
                    size={20}
                  />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                  {message.text}
                </p>
              </motion.div>
            )}

            <div className="space-y-12">
              {/* Personal Details */}
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-black">
                    Personal Information
                  </h2>
                  <p className="text-xs text-black/40 font-bold uppercase tracking-widest">
                    Update your basic details
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600/80">
                      Full Name
                    </label>
                    <div className="relative group">
                      <HugeiconsIcon
                        icon={UserIcon}
                        size={18}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-red-600 transition-colors"
                      />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-[#F9FAFB] border border-black/5 rounded-3xl py-5 pl-14 pr-6 outline-none focus:border-red-600/30 focus:bg-white transition-all font-black text-black placeholder:text-black/10 text-sm shadow-inner"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600/80">
                      Email Address
                    </label>
                    <div className="relative group">
                      <HugeiconsIcon
                        icon={Mail01Icon}
                        size={18}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-red-600 transition-colors"
                      />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-[#F9FAFB] border border-black/5 rounded-3xl py-5 pl-14 pr-6 outline-none focus:border-red-600/30 focus:bg-white transition-all font-black text-black placeholder:text-black/10 text-sm shadow-inner"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600/80">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <HugeiconsIcon
                        icon={SmartPhone01Icon}
                        size={18}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-red-600 transition-colors"
                      />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full bg-[#F9FAFB] border border-black/5 rounded-3xl py-5 pl-14 pr-6 outline-none focus:border-red-600/30 focus:bg-white transition-all font-black text-black placeholder:text-black/10 text-sm shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="space-y-8 pt-6 border-t border-black/5">
                <div className="space-y-2">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-black">
                    Security
                  </h2>
                  <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">
                    Leave fields blank to keep current password
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600/80">
                      New Password
                    </label>
                    <div className="relative group">
                      <HugeiconsIcon
                        icon={LockPasswordIcon}
                        size={18}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-red-600 transition-colors"
                      />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        placeholder="••••••••"
                        className="w-full bg-[#F9FAFB] border border-black/5 rounded-3xl py-5 pl-14 pr-6 outline-none focus:border-red-600/30 focus:bg-white transition-all font-black text-black placeholder:text-black/20 text-sm shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600/80">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <HugeiconsIcon
                        icon={LockPasswordIcon}
                        size={18}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-red-600 transition-colors"
                      />
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        className="w-full bg-[#F9FAFB] border border-black/5 rounded-3xl py-5 pl-14 pr-6 outline-none focus:border-red-600/30 focus:bg-white transition-all font-black text-black placeholder:text-black/20 text-sm shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white p-7 rounded-[32px] font-black uppercase tracking-[0.3em] hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 active:scale-95 shadow-xl shadow-black/10 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <HugeiconsIcon icon={Tick01Icon} size={24} />
                    Update Profile
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-red-600 rounded-[48px] p-10 text-white space-y-6">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">
                M-11 Privacy
                <br />
                Promise
              </h3>
              <p className="text-sm font-bold opacity-80 leading-relaxed">
                Your data security is our top priority. We use industry-standard
                encryption to protect your personal information and never share
                your data with third parties.
              </p>
            </div>

            <div className="bg-white rounded-[40px] p-10 border border-black/5 shadow-sm space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-black">
                <HugeiconsIcon icon={Settings02Icon} size={24} />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-black uppercase italic tracking-tighter text-black">
                  Need Help?
                </h4>
                <p className="text-sm font-bold text-black/60 leading-relaxed">
                  If you&apos;re having trouble updating your account, please
                  contact our 24/7 support team.
                </p>
              </div>
              <Link
                href="/contact"
                className="w-full cursor-pointer px-6 py-4 rounded-full border border-black font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-all text-black shadow"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
