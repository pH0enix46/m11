"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/context/CartContext";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  DeliveryTruck01Icon,
  CreditCardIcon,
  ShoppingBag01Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { placeOrderAction } from "@/lib/actions";

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isOrdered, setIsOrdered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await placeOrderAction({
        shippingAddress: formData,
        paymentMethod: "cash",
      });

      if (data.success) {
        setIsOrdered(true);
        setTimeout(() => {
          clearCart();
          router.push("/");
        }, 5000);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Connection error. Please check your internet.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !isOrdered) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="relative w-48 h-48 mx-auto mb-8">
            <HugeiconsIcon
              icon={ShoppingBag01Icon}
              size={120}
              className="text-gray-100 absolute inset-0 m-auto"
            />
          </div>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
            Your cart is empty
          </h2>
          <p className="text-gray-500 max-w-sm mx-auto">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:bg-red-600 transition-all shadow-xl shadow-black/10"
          >
            Explore Collection
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Overlay for Success */}
      <AnimatePresence>
        {isOrdered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-200 bg-white flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="space-y-8 max-w-md"
            >
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-200">
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={48}
                  className="text-white"
                />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-black text-black uppercase tracking-tight">
                  Order Confirmed!
                </h1>
                <p className="text-gray-600 font-medium leading-relaxed">
                  Thank you for your purchase, {formData.firstName}. We&apos;re
                  preparing your artisanal footwear for delivery.
                </p>
              </div>
              <div className="pt-8 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                Redirecting to home page...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-8xl mx-auto px-4 md:px-10 lg:px-20 py-16 md:py-32 md:mt-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left: Checkout Form */}
          <div className="flex-1 space-y-12">
            <header className="space-y-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                Back to shopping
              </Link>
              <h1 className="text-5xl md:text-6xl font-black text-black uppercase tracking-tighter">
                Checkout
              </h1>
            </header>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Contact Info */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-black">
                    1
                  </div>
                  <h2 className="text-lg font-black uppercase tracking-tight text-black">
                    Contact Information
                  </h2>
                </div>
                <div className="space-y-4">
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 focus:border-black focus:bg-white rounded-2xl outline-none transition-all font-medium text-black placeholder:text-gray-400"
                  />
                  <input
                    required
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 focus:border-black focus:bg-white rounded-2xl outline-none transition-all font-medium text-black placeholder:text-gray-400"
                  />
                </div>
              </section>

              {/* Shipping Info */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-black">
                    2
                  </div>
                  <h2 className="text-lg font-black uppercase tracking-tight text-black">
                    Shipping Details
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 focus:border-black focus:bg-white rounded-2xl outline-none transition-all font-medium text-black placeholder:text-gray-400"
                  />
                  <input
                    required
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 focus:border-black focus:bg-white rounded-2xl outline-none transition-all font-medium text-black placeholder:text-gray-400"
                  />
                </div>
                <input
                  required
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 focus:border-black focus:bg-white rounded-2xl outline-none transition-all font-medium text-black placeholder:text-gray-400"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 focus:border-black focus:bg-white rounded-2xl outline-none transition-all font-medium text-black placeholder:text-gray-400"
                  />
                  <input
                    required
                    type="text"
                    name="state"
                    placeholder="State / Province"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 focus:border-black focus:bg-white rounded-2xl outline-none transition-all font-medium text-black placeholder:text-gray-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    type="text"
                    name="zipCode"
                    placeholder="Postal / Zip Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 focus:border-black focus:bg-white rounded-2xl outline-none transition-all font-medium text-black placeholder:text-gray-400"
                  />
                  <input
                    required
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 focus:border-black focus:bg-white rounded-2xl outline-none transition-all font-medium text-black placeholder:text-gray-400"
                  />
                </div>
              </section>

              {/* Payment Info */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-black">
                    3
                  </div>
                  <h2 className="text-lg font-black uppercase tracking-tight text-black">
                    Payment Method
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-6 border-2 border-black rounded-2xl bg-white flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-4">
                      <HugeiconsIcon
                        icon={CreditCardIcon}
                        size={24}
                        className="text-black"
                      />
                      <span className="font-bold text-sm uppercase tracking-widest text-black">
                        Cash on Delivery
                      </span>
                    </div>
                    <div className="w-6 h-6 rounded-full border-4 border-black bg-white" />
                  </div>
                </div>
              </section>

              {error && (
                <p className="text-red-600 text-sm font-black uppercase tracking-widest text-center">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-20 bg-black text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-lg hover:bg-red-600 transition-all shadow-2xl shadow-black/10 active:scale-[0.98] mt-8 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : `Place Order ৳${totalPrice}`}
              </button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-[450px]">
            <div className="sticky top-40 bg-gray-50 rounded-[40px] p-8 md:p-10 space-y-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-black uppercase tracking-tight text-black border-b border-gray-200 pb-6">
                Order Summary
              </h2>

              <div className="space-y-6 max-h-[400px] overflow-y-auto! pr-2 scroll-smooth!">
                {cartItems.map((item) => (
                  <div
                    key={`${item._id || item.id}-${item.selectedSize}`}
                    className="flex gap-4"
                  >
                    <div className="relative w-24 h-24 rounded-2xl overflow-y-auto overflow-x-hidden scroll-smooth! bg-white border border-gray-200 shrink-0">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center gap-1">
                      <h3 className="text-sm font-bold text-black line-clamp-1">
                        {item.name}
                      </h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                          Size {item.selectedSize} × {item.quantity}
                        </span>
                        <span className="text-base font-black text-black">
                          ৳{(item.discountPrice || item.price) * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-black">৳{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-green-600 font-black">Free</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-gray-100 mt-2">
                  <span className="text-lg font-black uppercase tracking-tight text-black">
                    Total
                  </span>
                  <span className="text-4xl font-black text-black">
                    ৳{totalPrice}
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl flex items-center gap-4 border border-gray-100 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <HugeiconsIcon
                    icon={DeliveryTruck01Icon}
                    size={24}
                    className="text-green-600"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Estimated delivery
                  </p>
                  <p className="text-sm font-bold text-black">
                    2-3 Business Days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
