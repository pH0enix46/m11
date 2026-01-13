"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Delete02Icon,
  Add01Icon,
  Remove01Icon,
  ShoppingBag01Icon,
} from "@hugeicons/core-free-icons";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";

const CartSidebar = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    totalPrice,
  } = useCart();

  console.log("Cart Items ", cartItems);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-white z-101 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HugeiconsIcon
                  icon={ShoppingBag01Icon}
                  size={24}
                  className="text-black"
                />
                <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">
                  Your Cart
                </h2>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full">
                  {cartItems.length}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={24}
                  className="text-gray-400"
                />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-6 bg-gray-50 rounded-full">
                    <HugeiconsIcon
                      icon={ShoppingBag01Icon}
                      size={48}
                      className="text-gray-200"
                    />
                  </div>
                  <p className="text-gray-500 font-medium">
                    Your cart is empty
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-red-600 font-bold uppercase tracking-widest text-sm hover:underline cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={`${item._id || item.id}-${item.selectedSize}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 group"
                  >
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors">
                            {item.name}
                          </h3>
                          <button
                            onClick={() =>
                              removeFromCart(
                                (item._id || item.id)!,
                                item.selectedSize
                              )
                            }
                            className="text-gray-300 hover:text-red-600 transition-colors p-1 cursor-pointer"
                          >
                            <HugeiconsIcon icon={Delete02Icon} size={18} />
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                          Size: {item.selectedSize}
                        </p>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                          <button
                            onClick={() =>
                              updateQuantity(
                                (item._id || item.id)!,
                                item.selectedSize,
                                item.quantity - 1
                              )
                            }
                            className="p-1 hover:bg-white rounded-md transition-all text-gray-600 cursor-pointer"
                          >
                            <HugeiconsIcon icon={Remove01Icon} size={14} />
                          </button>
                          <span className="text-xs font-black min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                (item._id || item.id)!,
                                item.selectedSize,
                                item.quantity + 1
                              )
                            }
                            className="p-1 hover:bg-white rounded-md transition-all text-gray-600 cursor-pointer"
                          >
                            <HugeiconsIcon icon={Add01Icon} size={14} />
                          </button>
                        </div>
                        <p className="text-sm font-black text-gray-900">
                          ৳{(item.discountPrice || item.price) * item.quantity}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
                <div className="flex justify-between items-center px-2">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                    Subtotal
                  </span>
                  <span className="text-2xl font-black text-gray-900">
                    ৳{totalPrice}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full h-16 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-red-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10 active:scale-[0.98] cursor-pointer"
                >
                  Checkout Now
                </Link>
                <Link
                  href="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors cursor-pointer"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
