"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Notification03Icon } from "@hugeicons/core-free-icons";

export default function AdminHeader() {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-neutral-100 dark:bg-neutral-900/80 dark:border-neutral-800 sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 rounded-lg">
          <HugeiconsIcon icon={Menu01Icon} size={24} />
        </button>
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 hidden md:block">
          Welcome back, Admin
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer">
          <HugeiconsIcon icon={Notification03Icon} size={24} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-neutral-900"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-neutral-200 dark:border-neutral-800">
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Admin User
            </p>
            <p className="text-xs text-neutral-500">admin@gmail.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
