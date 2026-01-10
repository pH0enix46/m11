"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { getAllOrdersAction } from "@/lib/actions";
import { IOrder } from "@/lib/types";
import { useEffect } from "react";
import {
  Search01Icon,
  FilterHorizontalIcon,
  EyeIcon,
} from "@hugeicons/core-free-icons";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrdersAction();
      if (res.success) {
        setOrders(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof o.user === "object" &&
        o.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
          Orders
        </h1>
        <p className="text-neutral-500 mt-1">
          Manage and track customer orders
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
              <HugeiconsIcon icon={Search01Icon} size={20} />
            </div>
            <input
              type="text"
              placeholder="Search by Order ID or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl py-2.5 pl-12 pr-4 text-neutral-900 dark:text-white placeholder-neutral-500 focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          <button className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 rounded-full text-neutral-600 dark:text-neutral-300 font-medium flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer">
            <HugeiconsIcon icon={FilterHorizontalIcon} size={20} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 text-sm font-medium">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {loading
                ? [...Array(5)].map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-24" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-20" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-32" />
                          <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-40" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-16" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-neutral-100 dark:bg-neutral-800 rounded-full w-16" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-neutral-100 dark:bg-neutral-800 rounded-full w-20" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 text-transparent">
                          Actions
                        </div>
                      </td>
                    </tr>
                  ))
                : filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 text-neutral-500 text-sm">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {typeof order.user === "object"
                              ? order.user.name
                              : `UID: ${order.user}`}
                          </p>
                          <p className="text-neutral-500">
                            {typeof order.user === "object"
                              ? order.user.email
                              : order.shippingAddress.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                            order.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="inline-flex p-2 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors cursor-pointer"
                        >
                          <HugeiconsIcon icon={EyeIcon} size={20} />
                        </Link>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {!loading && filteredOrders.length === 0 && (
          <div className="p-12 text-center text-neutral-500">
            No orders found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
