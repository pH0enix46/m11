"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ShoppingBag01Icon,
  PackageIcon,
  TruckIcon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  UserIcon,
  CreditCardIcon,
  LocationIcon,
} from "@hugeicons/core-free-icons";
import { getOrderByIdAction, getCurrentUserAction } from "@/lib/actions";
import { IOrder } from "@/lib/types";
import { toast } from "react-hot-toast";

export default function UserOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [orderId, setOrderId] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      const resolvedParams = await params;
      setOrderId(resolvedParams.id);

      const authRes = await getCurrentUserAction();
      if (!authRes.success) {
        toast.error("Please login to view order details");
        router.push("/login");
        return;
      }

      setCheckingAuth(false);
      fetchOrder(resolvedParams.id);
    };

    init();
  }, [params, router]);

  const fetchOrder = async (id: string) => {
    setLoading(true);
    try {
      const res = await getOrderByIdAction(id);
      if (res.success) {
        setOrder(res.data);
      } else {
        toast.error(res.message || "Failed to fetch order");
        router.push("/orders");
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
      toast.error("An error occurred");
      router.push("/orders");
    } finally {
      setLoading(false);
    }
  };

  const statusFlow = ["pending", "processing", "shipped", "delivered"];

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

  if (checkingAuth || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white mt-20">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white mt-20">
        <div className="text-center space-y-4">
          <p className="text-gray-600">Order not found</p>
          <Link
            href="/orders"
            className="inline-block bg-black text-white px-6 py-3 rounded-2xl font-bold"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white mt-20">
      <main className="max-w-7xl mx-auto px-4 py-16 md:px-10 lg:px-20">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6 group"
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">Back to Orders</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {order.orderNumber}
              </h1>
              <p className="text-gray-500">
                Placed on{" "}
                {new Date(order.createdAt || "").toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <span
              className={`self-start md:self-center px-6 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest border-2 ${getStatusColor(
                order.orderStatus
              )}`}
            >
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={getStatusIcon(order.orderStatus)}
                  size={18}
                />
                {order.orderStatus}
              </div>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-50 rounded-2xl">
                    <HugeiconsIcon
                      icon={PackageIcon}
                      size={24}
                      className="text-red-600"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order Items
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-6 p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                  >
                    {item.image && (
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 mt-1">
                        Size: {item.selectedSize} • Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-gray-900 text-xl">
                        ৳{(item.price * item.quantity).toFixed(0)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        ৳{item.price.toFixed(0)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Status Progress */}
            {order.orderStatus !== "cancelled" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border-2 border-gray-100 rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  Order Progress
                </h2>
                <div className="relative">
                  <div className="flex justify-between items-center">
                    {statusFlow.map((status, index) => {
                      const isCompleted =
                        statusFlow.indexOf(order.orderStatus) >= index;
                      const isCurrent = order.orderStatus === status;

                      return (
                        <div key={status} className="flex items-center flex-1">
                          <div className="flex flex-col items-center flex-1">
                            <div
                              className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 ${
                                isCompleted
                                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30 scale-110"
                                  : "bg-gray-200 text-gray-400"
                              } ${isCurrent ? "ring-4 ring-red-200" : ""}`}
                            >
                              <HugeiconsIcon
                                icon={getStatusIcon(status)}
                                size={28}
                              />
                            </div>
                            <p
                              className={`mt-3 text-sm font-bold uppercase tracking-wide ${
                                isCompleted ? "text-gray-900" : "text-gray-400"
                              }`}
                            >
                              {status}
                            </p>
                          </div>
                          {index < statusFlow.length - 1 && (
                            <div
                              className={`h-1 flex-1 transition-all duration-500 ${
                                statusFlow.indexOf(order.orderStatus) > index
                                  ? "bg-red-600"
                                  : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 rounded-2xl">
                    <HugeiconsIcon
                      icon={LocationIcon}
                      size={24}
                      className="text-blue-600"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Delivery Address
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-2 text-gray-700">
                  <p className="font-bold text-gray-900 text-lg">
                    {order.shippingAddress.street}
                  </p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="mt-4 font-bold">
                    Phone: {order.shippingAddress.phone}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden sticky top-24"
            >
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Summary
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    ৳{order.itemsPrice.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    ৳{order.shippingPrice.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-medium">
                    ৳{order.taxPrice.toFixed(0)}
                  </span>
                </div>
                <div className="pt-4 border-t-2 border-gray-100 flex justify-between font-bold text-2xl text-gray-900">
                  <span>Total</span>
                  <span className="text-red-600">
                    ৳{order.totalPrice.toFixed(0)}
                  </span>
                </div>
              </div>
              <div className="p-6 pt-0 space-y-4">
                <div className="p-5 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <HugeiconsIcon
                      icon={CreditCardIcon}
                      size={20}
                      className="text-gray-600"
                    />
                    <p className="text-sm text-gray-600 uppercase tracking-widest font-bold">
                      Payment Method
                    </p>
                  </div>
                  <p className="font-bold text-gray-900 capitalize text-lg">
                    {order.paymentMethod}
                  </p>
                </div>
                <div className="p-5 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={20}
                      className="text-gray-600"
                    />
                    <p className="text-sm text-gray-600 uppercase tracking-widest font-bold">
                      Payment Status
                    </p>
                  </div>
                  <span
                    className={`inline-block px-4 py-2 rounded-xl text-sm font-bold uppercase ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
