"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IOrder } from "@/lib/types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  PrinterIcon,
  DeliveryBox01Icon,
  UserCircleIcon,
  Location01Icon,
  CreditCardIcon,
  Tick02Icon,
  Cancel01Icon,
  TruckDeliveryIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { updateOrderStatusAction } from "@/lib/actions";

export default function OrderDetails({ order }: { order: IOrder }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.orderStatus);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await updateOrderStatusAction(order._id, newStatus);
      if (res.success) {
        setStatus(newStatus as IOrder["orderStatus"]);
        alert(`Order status updated to ${newStatus}`);
      } else {
        alert(res.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Update status error:", error);
      alert("An error occurred while updating the status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <HugeiconsIcon
              icon={ArrowLeft02Icon}
              size={24}
              className="text-neutral-500"
            />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
              Order #{order.orderNumber}
              <span
                className={`text-sm px-3 py-1 rounded-full border ${
                  status === "delivered"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : status === "shipped"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : status === "cancelled"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                }`}
              >
                {status.toUpperCase()}
              </span>
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              Placed on{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors border border-neutral-200 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 cursor-pointer">
            <HugeiconsIcon icon={PrinterIcon} size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <HugeiconsIcon
                  icon={DeliveryBox01Icon}
                  size={20}
                  className="text-red-500"
                />
                Order Items
              </h3>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0 relative">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-900 dark:text-white">
                      {item.name}
                    </h4>
                    <p className="text-sm text-neutral-500">
                      Size: {item.selectedSize} | Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="font-bold text-neutral-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 space-y-3">
              <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
                <span>Subtotal</span>
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
                <span>Shipping</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
                <span>Tax</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-neutral-900 dark:text-white pt-3 border-t border-neutral-200 dark:border-neutral-700">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Transactions (Mock) */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-6">
            <h3 className="font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <HugeiconsIcon
                icon={CreditCardIcon}
                size={20}
                className="text-red-500"
              />
              Payment Info
            </h3>
            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center shadow-sm">
                  <span className="font-bold text-xs uppercase">
                    {order.paymentMethod}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm text-neutral-900 dark:text-white capitalize">
                    Payment via {order.paymentMethod}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Status: {order.paymentStatus}
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                ${order.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-6 space-y-6">
            <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <HugeiconsIcon
                icon={UserCircleIcon}
                size={20}
                className="text-red-500"
              />
              Customer
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 font-bold">
                {typeof order.user === "object" ? order.user.name[0] : "U"}
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {typeof order.user === "object"
                    ? order.user.name
                    : `UID: ${order.user}`}
                </p>
                <p className="text-sm text-neutral-500">
                  {typeof order.user === "object"
                    ? order.user.email
                    : order.shippingAddress.phone}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                <HugeiconsIcon
                  icon={Location01Icon}
                  size={16}
                  className="text-neutral-400"
                />
                Shipping Address
              </h4>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {order.shippingAddress.street}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
                <br />
                {order.shippingAddress.country}
                <br />
                Phone: {order.shippingAddress.phone}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-6">
            <h3 className="font-bold text-neutral-900 dark:text-white mb-4">
              Order Actions
            </h3>
            <div className="space-y-3">
              {status === "pending" && (
                <button
                  onClick={() => updateStatus("processing")}
                  disabled={loading}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <HugeiconsIcon icon={Tick02Icon} size={20} />
                  Process Order
                </button>
              )}
              {(status === "pending" || status === "processing") && (
                <button
                  onClick={() => updateStatus("shipped")}
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <HugeiconsIcon icon={TruckDeliveryIcon} size={20} />
                  Mark as Shipped
                </button>
              )}
              {status === "shipped" && (
                <button
                  onClick={() => updateStatus("delivered")}
                  disabled={loading}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <HugeiconsIcon icon={Tick02Icon} size={20} />
                  Mark Delivered
                </button>
              )}
              {status !== "cancelled" && status !== "delivered" && (
                <button
                  onClick={() => updateStatus("cancelled")}
                  disabled={loading}
                  className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={20} />
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
