"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  ShoppingBag03Icon,
  DeliveryBox01Icon,
  UserCircleIcon,
  Logout03Icon,
} from "@hugeicons/core-free-icons";

const menuItems = [
  { name: "Dashboard", icon: DashboardSquare01Icon, href: "/admin" },
  { name: "Products", icon: ShoppingBag03Icon, href: "/admin/products" },
  { name: "Orders", icon: DeliveryBox01Icon, href: "/admin/orders" },
  { name: "Profile", icon: UserCircleIcon, href: "/admin/profile" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-neutral-900 text-white fixed left-0 top-0 overflow-y-auto border-r border-neutral-800 hidden md:flex flex-col">
      <div className="p-6 border-b border-neutral-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          Admin Panel
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 group cursor-pointer ${
                isActive
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <HugeiconsIcon icon={item.icon} size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <button
          onClick={() => (window.location.href = "/login")}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-full text-neutral-400 hover:bg-red-900/20 hover:text-red-500 transition-colors cursor-pointer"
        >
          <HugeiconsIcon icon={Logout03Icon} size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
