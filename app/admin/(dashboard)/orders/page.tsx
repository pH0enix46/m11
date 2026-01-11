"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { getAllOrdersAction } from "@/lib/actions";
import { IOrder } from "@/lib/types";
import {
  Search01Icon,
  EyeIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "react-hot-toast";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Build query string based on filters
      const queryParams = new URLSearchParams();
      if (selectedStatus !== "All") {
        queryParams.append("status", selectedStatus);
      }

      const res = await getAllOrdersAction(queryParams.toString());

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

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof o.user === "object" &&
        o.user.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof o.user === "object" &&
        o.user.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  const statuses = [
    "All",
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

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
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex flex-col lg:flex-row gap-5">
          {/* Enhanced Search */}
          <div className="relative flex-1 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-red-500 transition-colors">
              <HugeiconsIcon icon={Search01Icon} size={20} />
            </div>
            <input
              type="text"
              placeholder="Search by Order ID or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-800 border-2 border-transparent focus:border-red-500/10 focus:bg-white dark:focus:bg-neutral-900 rounded-2xl py-3 pl-12 pr-12 text-neutral-900 dark:text-white placeholder-neutral-500 transition-all outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-all cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Status Tabs */}
            <div className="flex bg-neutral-50 dark:bg-neutral-800 p-1 rounded-2xl border border-neutral-100 dark:border-neutral-700 overflow-x-auto no-scrollbar">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap capitalize ${
                    selectedStatus === s
                      ? "bg-white dark:bg-neutral-700 text-red-600 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
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
                      <td className="px-6 py-4 font-bold text-neutral-900 dark:text-white">
                        ৳{order.totalPrice.toFixed(0)}
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
