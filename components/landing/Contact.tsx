"use client";

import React from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon as MailIcon,
  Location01Icon as LocationIcon,
  CustomerService01Icon as ServiceIcon,
  ArrowRight01Icon as ArrowIcon,
} from "@hugeicons/core-free-icons";

const Contact = () => {
  return (
    <section className="bg-white py-32 px-4 md:px-8 overflow-hidden">
      <div className="mx-auto max-w-8xl px-2 md:px-10 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-start">
          {/* Left Side: Info & Branding */}
          <div className="flex-1 space-y-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-6xl md:text-7xl font-bold tracking-tighter text-black leading-tight translate-x-[-4px]">
                GET IN <span className="text-[#E60000]">TOUCH.</span>
              </h2>
              <p className="text-[#707070] text-lg md:text-xl font-medium max-w-[480px] leading-relaxed">
                Have a question about our collections or need help with an
                order? Our team is here to ensure your M-11 experience is
                seamless.
              </p>
            </motion.div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8">
              {[
                {
                  icon: MailIcon,
                  label: "EMAIL US",
                  value: "m11elevenbd@gmail.com",
                  delay: 0.2,
                },
                {
                  icon: ServiceIcon,
                  label: "SUPPORT",
                  value: "01972792106",
                  delay: 0.3,
                },
                {
                  icon: LocationIcon,
                  label: "VISIT US",
                  value: "Dhaka, Bangladesh",
                  delay: 0.4,
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: item.delay, duration: 0.6 }}
                  className="space-y-4"
                >
                  <div className="w-12 h-12 bg-[#FEECEC] rounded-full flex items-center justify-center">
                    <HugeiconsIcon
                      icon={item.icon}
                      size={20}
                      className="text-[#E60000]"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#909090]">
                      {item.label}
                    </span>
                    <p className="text-[15px] font-bold text-black">
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full bg-[#F9FAFB] p-10 md:p-14 rounded-[40px] shadow-sm border border-black/5"
          >
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-black pl-1">
                    NAME
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-white border border-black/10 px-6 py-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-red-500/10 focus:border-red-600/50 outline-none transition-all font-medium text-[15px] placeholder:text-black/30"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-black pl-1">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-white border border-black/10 px-6 py-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-red-500/10 focus:border-red-600/50 outline-none transition-all font-medium text-[15px] placeholder:text-black/30"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-extrabold uppercase tracking-widest text-black pl-1">
                  SUBJECT
                </label>
                <input
                  type="text"
                  placeholder="Order Inquiry"
                  className="w-full bg-white border border-black/10 px-6 py-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-red-500/10 focus:border-red-600/50 outline-none transition-all font-medium text-[15px] placeholder:text-black/30"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-extrabold uppercase tracking-widest text-black pl-1">
                  MESSAGE
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us what's on your mind..."
                  className="w-full bg-white border border-black/10 px-6 py-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-red-500/10 focus:border-red-600/50 outline-none transition-all font-medium text-[15px] resize-none placeholder:text-black/30"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01, backgroundColor: "#D00000" }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#E60000] text-white font-bold uppercase tracking-[0.2em] text-[12px] py-6 rounded-full shadow transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                SEND MESSAGE
                <HugeiconsIcon icon={ArrowIcon} size={16} />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
