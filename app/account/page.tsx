"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  SmartPhone01Icon,
  Settings02Icon,
  ShoppingBag02Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AccountPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-36 pb-24 px-4 md:px-8">
      <div className="max-w-8xl mx-auto space-y-12">
        {/* Profile Header */}
        <section className="bg-white rounded-[48px] p-8 md:p-16 shadow-sm border border-black/5 flex flex-col md:flex-row items-center gap-10">
          <div className="w-28 h-28 md:w-40 md:h-40 rounded-full bg-linear-to-br from-red-600 to-red-800 flex items-center justify-center text-white border-4 border-white shadow-2xl text-4xl md:text-6xl font-black">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center md:text-left space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-red-600">
              Welcome back
            </p>
            <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter text-black uppercase leading-none">
              {user.name}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-3">
              <div className="flex items-center gap-2 text-sm font-black text-black/60">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={18}
                  className="text-black/40"
                />
                {user.email}
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 text-sm font-black text-black/60">
                  <HugeiconsIcon
                    icon={SmartPhone01Icon}
                    size={18}
                    className="text-black/40"
                  />
                  {user.phone}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            href="/orders"
            className="group bg-white rounded-[40px] p-10 border border-black/5 hover:border-red-600/20 hover:bg-neutral-50 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all transform group-hover:rotate-6">
                  <HugeiconsIcon icon={ShoppingBag02Icon} size={32} />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-black">
                    My Orders
                  </h3>
                  <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] mt-2 group-hover:text-red-600 transition-colors">
                    Track & manage orders
                  </p>
                </div>
              </div>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={32}
                className="text-black/10 group-hover:text-black transition-all group-hover:translate-x-2"
              />
            </div>
          </Link>

          <Link
            href="/account/settings"
            className="group bg-white rounded-[40px] p-10 border border-black/5 hover:border-red-600/20 hover:bg-neutral-50 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all transform group-hover:-rotate-6">
                  <HugeiconsIcon icon={Settings02Icon} size={32} />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-black">
                    Settings
                  </h3>
                  <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] mt-2 group-hover:text-red-600 transition-colors">
                    Security & preferences
                  </p>
                </div>
              </div>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={32}
                className="text-black/10 group-hover:text-black transition-all group-hover:translate-x-2"
              />
            </div>
          </Link>
        </div>

        {/* Info Cards */}
        <section className="bg-white rounded-[48px] p-8 md:p-16 border border-black/5 shadow-sm space-y-12">
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-black border-b border-black/5 pb-6">
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600/60">
                Full Name
              </label>
              <p className="text-xl font-black text-black uppercase">
                {user.name}
              </p>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600/60">
                Email Address
              </label>
              <p className="text-xl font-black text-black">{user.email}</p>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600/60">
                Phone Number
              </label>
              <p className="text-xl font-black text-black">
                {user.phone || "Not provided"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AccountPage;
