"use client";

import { mockOrders, mockProducts } from "@/lib/mockData";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DollarCircleIcon,
  ShoppingBag03Icon,
  DeliveryBox01Icon,
} from "@hugeicons/core-free-icons";
import { motion } from "motion/react";
import Image from "next/image";

const stats = [
  {
    name: "Total Revenue",
    value: `$${mockOrders
      .reduce((acc, order) => acc + order.totalPrice, 0)
      .toFixed(2)}`,
    icon: DollarCircleIcon,
    color: "from-green-500 to-emerald-600",
    change: "+12.5%",
    trend: "up",
  },
  {
    name: "Total Orders",
    value: mockOrders.length.toString(),
    icon: DeliveryBox01Icon,
    color: "from-blue-500 to-indigo-600",
    change: "+5.2%",
    trend: "up",
  },
  {
    name: "Active Products",
    value: mockProducts.length.toString(),
    icon: ShoppingBag03Icon,
    color: "from-orange-500 to-red-600",
    change: "0%",
    trend: "neutral",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-neutral-500 mt-1">
          Overview of your store&apos;s performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}
              >
                <HugeiconsIcon icon={stat.icon} size={24} />
              </div>
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.trend === "up"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-neutral-500 text-sm font-medium">
              {stat.name}
            </h3>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Recent Orders
            </h3>
            <button className="text-sm text-red-600 hover:text-red-500 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {mockOrders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-neutral-800 flex items-center justify-center text-lg">
                    📦
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900 dark:text-white">
                      {order.orderNumber}
                    </h4>
                    <p className="text-sm text-neutral-500">
                      {order.items.length} items • ${order.totalPrice}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                    order.orderStatus === "delivered"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : order.orderStatus === "cancelled"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Top Products
            </h3>
            <button className="text-sm text-red-600 hover:text-red-500 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {mockProducts.slice(0, 5).map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white dark:bg-neutral-800 overflow-hidden relative">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900 dark:text-white">
                      {product.name}
                    </h4>
                    <p className="text-sm text-neutral-500">
                      {product.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-neutral-900 dark:text-white">
                    ${product.price}
                  </p>
                  <p className="text-xs text-neutral-500">In Stock</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
