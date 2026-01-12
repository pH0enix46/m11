"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBag01Icon,
  PackageIcon,
  TruckIcon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  EyeIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { getMyOrdersAction, getCurrentUserAction } from "@/lib/actions";
import { IOrder } from "@/lib/types";
import { toast } from "react-hot-toast";

export default function UserOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getCurrentUserAction();
        if (!res.success) {
          toast.error("Please login to view your orders");
          router.push("/login");
          return;
        }
        setCheckingAuth(false);
        fetchOrders();
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getMyOrdersAction();
      if (res.success) {
        setOrders(res.data);
      } else {
        toast.error(res.message || "Failed to fetch orders");
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("An error occurred while fetching orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const statuses = [
    "All",
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus =
      selectedStatus === "All" || order.orderStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return CheckmarkCircle02Icon;
      case "shipped":
        return TruckIcon;
      case "processing":
        return PackageIcon;
      case "cancelled":
        return Cancel01Icon;
      default:
        return ShoppingBag01Icon;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "processing":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-black mt-20">
        <div className="absolute inset-0 opacity-50">
          <Image
            src="/products/one/1.jpeg"
            alt="Orders Hero"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/20" />

        <div className="relative z-10 text-center space-y-4 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight"
          >
            MY ORDERS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto"
          >
            Track and manage all your orders in one place
          </motion.p>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-24 z-30 bg-white/95 backdrop-blur-2xl border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-8xl mx-auto px-4 py-4 md:py-6 md:px-10 lg:px-20">
          <div className="flex flex-col gap-4 md:gap-5">
            {/* Search */}
            <div className="relative w-full group">
              <HugeiconsIcon
                icon={Search01Icon}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-all duration-200"
                strokeWidth={2.5}
                size={20}
              />
              <input
                type="text"
                placeholder="Search by order number or item name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-12 py-3.5 md:py-4 bg-white border border-gray-200 hover:border-gray-300 focus:border-red-600 rounded-full text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-red-600/10 transition-all duration-200 placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={16} />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-5 md:px-6 py-2.5 md:py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                    selectedStatus === status
                      ? "bg-black text-white shadow-lg shadow-black/10 scale-105"
                      : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 bg-white" />

      {/* Main Content */}
      <main className="max-w-8xl mx-auto px-4 py-16 md:px-10 lg:px-20">
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-50 rounded-3xl p-8 space-y-4"
              >
                <div className="h-6 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-32 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group bg-white border-2 border-gray-100 rounded-3xl overflow-hidden hover:border-red-200 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="p-8">
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {order.orderNumber}
                          </h3>
                          <span
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border-2 ${getStatusColor(
                              order.orderStatus
                            )}`}
                          >
                            <div className="flex items-center gap-2">
                              <HugeiconsIcon
                                icon={getStatusIcon(order.orderStatus)}
                                size={14}
                              />
                              {order.orderStatus}
                            </div>
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Placed on{" "}
                          {new Date(order.createdAt || "").toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">
                            Total
                          </p>
                          <p className="text-3xl font-bold text-gray-900">
                            ৳{order.totalPrice.toFixed(0)}
                          </p>
                        </div>
                        <Link
                          href={`/orders/${order._id}`}
                          className="bg-black hover:bg-red-600 text-white p-4 rounded-2xl transition-all duration-300 group-hover:scale-110"
                        >
                          <HugeiconsIcon icon={EyeIcon} size={20} />
                        </Link>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mt-6 space-y-4">
                      {order.items.slice(0, 2).map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl"
                        >
                          {item.image && (
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 truncate">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              Size: {item.selectedSize} • Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-gray-900">
                              ৳{(item.price * item.quantity).toFixed(0)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              ৳{item.price.toFixed(0)} each
                            </p>
                          </div>
                        </div>
                      ))}

                      {order.items.length > 2 && (
                        <p className="text-sm text-gray-500 text-center py-2">
                          + {order.items.length - 2} more item
                          {order.items.length - 2 > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>

                    {/* Order Info */}
                    <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-1">
                          Payment Method
                        </p>
                        <p className="font-bold text-gray-900 capitalize">
                          {order.paymentMethod}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-1">
                          Payment Status
                        </p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            order.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-1">
                          Delivery Address
                        </p>
                        <p className="font-medium text-gray-900 text-sm">
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
            <div className="bg-gray-50 p-12 rounded-full">
              <HugeiconsIcon
                icon={ShoppingBag01Icon}
                size={64}
                className="text-gray-300"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">
                No orders found
              </h2>
              <p className="text-gray-500">
                {searchQuery || selectedStatus !== "All"
                  ? "Try adjusting your filters"
                  : "Start shopping to create your first order"}
              </p>
            </div>
            {(searchQuery || selectedStatus !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedStatus("All");
                }}
                className="mt-4 bg-black hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all duration-300"
              >
                Clear Filters
              </button>
            )}
            {!searchQuery && selectedStatus === "All" && (
              <Link
                href="/products"
                className="mt-4 bg-black hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all duration-300 inline-block"
              >
                Start Shopping
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
