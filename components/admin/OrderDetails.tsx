"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IOrder } from "@/lib/types";
import { updateOrderStatusAction } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  UserIcon,
  PackageIcon,
  CreditCardIcon,
  TruckIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

interface OrderDetailsProps {
  order: IOrder;
}

export default function OrderDetails({
  order: initialOrder,
}: OrderDetailsProps) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [updating, setUpdating] = useState(false);

  // Define status progression
  const statusFlow = ["pending", "processing", "shipped", "delivered"];

  const getNextStatus = (currentStatus: string) => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex === statusFlow.length - 1) {
      return null;
    }
    return statusFlow[currentIndex + 1];
  };

  const canMoveToNextStatus = (currentStatus: string) => {
    return (
      currentStatus !== "delivered" &&
      currentStatus !== "cancelled" &&
      getNextStatus(currentStatus) !== null
    );
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await updateOrderStatusAction(order._id, {
        orderStatus: newStatus,
      });

      if (res.success) {
        setOrder({
          ...order,
          orderStatus: newStatus as
            | "pending"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled",
        });
        toast.success("Order status updated successfully");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An error occurred while updating order status");
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentStatusUpdate = async (newPaymentStatus: string) => {
    setUpdating(true);
    try {
      const res = await updateOrderStatusAction(order._id, {
        paymentStatus: newPaymentStatus as "pending" | "paid" | "failed",
      });

      if (res.success) {
        setOrder({
          ...order,
          paymentStatus: newPaymentStatus as "pending" | "paid" | "failed",
        });
        toast.success("Payment status updated successfully");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update payment status");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An error occurred while updating payment status");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    setUpdating(true);
    try {
      const res = await updateOrderStatusAction(order._id, {
        orderStatus: "cancelled",
      });

      if (res.success) {
        setOrder({ ...order, orderStatus: "cancelled" });
        toast.success("Order cancelled successfully");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error("An error occurred while cancelling order");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "shipped":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "processing":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400";
    }
  };

  const nextStatus = getNextStatus(order.orderStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-all"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
              Order {order.orderNumber}
            </h1>
            <p className="text-neutral-500 mt-1">
              Placed on{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(
              order.orderStatus
            )}`}
          >
            {order.orderStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <HugeiconsIcon
                    icon={PackageIcon}
                    size={20}
                    className="text-red-600"
                  />
                </div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Order Items
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      Size: {item.selectedSize} • Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neutral-900 dark:text-white">
                      ৳{(item.price * item.quantity).toFixed(0)}
                    </p>
                    <p className="text-sm text-neutral-500">
                      ৳{item.price.toFixed(0)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <HugeiconsIcon
                    icon={UserIcon}
                    size={20}
                    className="text-blue-600"
                  />
                </div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Customer Information
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-neutral-500">Name</p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {typeof order.user === "object" ? order.user.name : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Email</p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {typeof order.user === "object" ? order.user.email : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Phone</p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {order.shippingAddress.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <HugeiconsIcon
                    icon={TruckIcon}
                    size={20}
                    className="text-purple-600"
                  />
                </div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Shipping Address
                </h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-neutral-900 dark:text-white">
                {order.shippingAddress.street}
              </p>
              <p className="text-neutral-900 dark:text-white">
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
              </p>
              <p className="text-neutral-900 dark:text-white">
                {order.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Order Summary
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Items Price</span>
                <span>৳{order.itemsPrice.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Shipping</span>
                <span>৳{order.shippingPrice.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Tax</span>
                <span>৳{order.taxPrice.toFixed(0)}</span>
              </div>
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-between font-bold text-lg text-neutral-900 dark:text-white">
                <span>Total</span>
                <span>৳{order.totalPrice.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <HugeiconsIcon
                    icon={CreditCardIcon}
                    size={20}
                    className="text-green-600"
                  />
                </div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Payment
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-neutral-500">Payment Method</p>
                <p className="font-medium text-neutral-900 dark:text-white capitalize">
                  {order.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-2">Payment Status</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePaymentStatusUpdate("pending")}
                    disabled={updating || order.paymentStatus === "pending"}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      order.paymentStatus === "pending"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30"
                        : "bg-neutral-100 text-neutral-600 hover:bg-yellow-50 dark:bg-neutral-800 dark:hover:bg-yellow-900/20"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handlePaymentStatusUpdate("paid")}
                    disabled={updating || order.paymentStatus === "paid"}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30"
                        : "bg-neutral-100 text-neutral-600 hover:bg-green-50 dark:bg-neutral-800 dark:hover:bg-green-900/20"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Paid
                  </button>
                  <button
                    onClick={() => handlePaymentStatusUpdate("failed")}
                    disabled={updating || order.paymentStatus === "failed"}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      order.paymentStatus === "failed"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30"
                        : "bg-neutral-100 text-neutral-600 hover:bg-red-50 dark:bg-neutral-800 dark:hover:bg-red-900/20"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Failed
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Status Actions */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Order Actions
              </h2>
            </div>
            <div className="p-6 space-y-3">
              {canMoveToNextStatus(order.orderStatus) && nextStatus && (
                <button
                  onClick={() => handleStatusUpdate(nextStatus)}
                  disabled={updating}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating
                    ? "Updating..."
                    : `Move to ${
                        nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)
                      }`}
                </button>
              )}

              {order.orderStatus !== "cancelled" &&
                order.orderStatus !== "delivered" && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={updating}
                    className="w-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}

              {/* Status Flow Indicator */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <p className="text-xs text-neutral-500 mb-3">Status Flow:</p>
                <div className="flex items-center justify-between text-xs">
                  {statusFlow.map((status, index) => (
                    <div key={status} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                          statusFlow.indexOf(order.orderStatus) >= index
                            ? "bg-red-600 text-white"
                            : "bg-neutral-200 dark:bg-neutral-700 text-neutral-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      {index < statusFlow.length - 1 && (
                        <div
                          className={`w-8 h-0.5 ${
                            statusFlow.indexOf(order.orderStatus) > index
                              ? "bg-red-600"
                              : "bg-neutral-200 dark:bg-neutral-700"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {statusFlow.map((status) => (
                    <span
                      key={status}
                      className={`text-[10px] capitalize ${
                        order.orderStatus === status
                          ? "text-red-600 font-medium"
                          : "text-neutral-400"
                      }`}
                    >
                      {status}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
