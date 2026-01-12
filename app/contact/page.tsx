"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon as MailIcon,
  Location01Icon as LocationIcon,
  CustomerService01Icon as ServiceIcon,
  ArrowRight01Icon as ArrowIcon,
} from "@hugeicons/core-free-icons";

// Dynamically import Map to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/common/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-3xl">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center">
          <HugeiconsIcon
            icon={LocationIcon}
            size={32}
            className="text-red-600 animate-pulse"
            strokeWidth={2}
          />
        </div>
        <p className="text-sm text-gray-500 font-medium">Loading map...</p>
      </div>
    </div>
  ),
});

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-black mt-20">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/Hero/m-landing-9.jpeg"
            alt="Contact M-11"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/20" />

        <div className="relative z-10 text-center space-y-6 px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-4 py-2 bg-red-600/20 backdrop-blur-sm border border-red-600/30 text-red-400 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider inline-block mb-6">
              Contact Us
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
              Let&apos;s Start a
              <br />
              <span className="text-red-500 italic">Conversation</span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            We&apos;re here to help. Reach out to us anytime.
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-16 md:py-24 lg:py-32 px-4 md:px-8 overflow-hidden">
        <div className="mx-auto max-w-8xl px-2 md:px-10 lg:px-20">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            {/* Left Side: Info & Branding */}
            <div className="flex-1 space-y-12 md:space-y-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-black leading-tight translate-x-[-4px]">
                  GET IN <span className="text-red-600">TOUCH.</span>
                </h2>
                <p className="text-gray-600 text-base md:text-lg lg:text-xl font-medium max-w-[480px] leading-relaxed">
                  Have a question about our collections or need help with an
                  order? Our team is here to ensure your M-11 experience is
                  seamless.
                </p>
              </motion.div>

              {/* Info Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 md:gap-y-12 gap-x-8">
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
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-red-50 rounded-full flex items-center justify-center">
                      <HugeiconsIcon
                        icon={item.icon}
                        size={22}
                        className="text-red-600"
                        strokeWidth={2}
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-500">
                        {item.label}
                      </span>
                      <p className="text-sm md:text-base font-bold text-black">
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
              className="flex-1 w-full bg-gray-50/50 p-8 md:p-10 lg:p-14 rounded-3xl md:rounded-[40px] shadow-sm border border-gray-100"
            >
              <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-black pl-1">
                      NAME
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="w-full bg-white border border-gray-200 px-5 md:px-6 py-4 md:py-5 rounded-2xl shadow-sm focus:ring-2 focus:ring-red-500/10 focus:border-red-600/50 outline-none transition-all font-medium text-sm md:text-base placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-black pl-1">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="w-full bg-white border border-gray-200 px-5 md:px-6 py-4 md:py-5 rounded-2xl shadow-sm focus:ring-2 focus:ring-red-500/10 focus:border-red-600/50 outline-none transition-all font-medium text-sm md:text-base placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-black pl-1">
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Order Inquiry"
                    required
                    className="w-full bg-white border border-gray-200 px-5 md:px-6 py-4 md:py-5 rounded-2xl shadow-sm focus:ring-2 focus:ring-red-500/10 focus:border-red-600/50 outline-none transition-all font-medium text-sm md:text-base placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-black pl-1">
                    MESSAGE
                  </label>
                  <textarea
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what's on your mind..."
                    required
                    className="w-full bg-white border border-gray-200 px-5 md:px-6 py-4 md:py-5 rounded-2xl shadow-sm focus:ring-2 focus:ring-red-500/10 focus:border-red-600/50 outline-none transition-all font-medium text-sm md:text-base resize-none placeholder:text-gray-400"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01, backgroundColor: "#dc2626" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs md:text-sm py-5 md:py-6 rounded-full shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  SEND MESSAGE
                  <HugeiconsIcon icon={ArrowIcon} size={16} strokeWidth={2.5} />
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section (Optional) */}
      <section className="py-16 md:py-24 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-8xl mx-auto px-4 md:px-10 lg:px-20">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider inline-block mb-4">
                Find Us
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
                Visit Our <span className="text-red-600 italic">Store</span>
              </h2>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden border border-gray-200 shadow-sm"
          >
            <Map center={[23.8103, 90.4125]} zoom={13} />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
