"use client";

import { useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserCircleIcon,
  Mail01Icon,
  LockKeyIcon,
  Camera01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "react-hot-toast";
import { useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@gmail.com",
    avatar: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Saving profile changes...");
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Profile updated successfully", { id: loadingToast });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const loadingToast = toast.loading("Uploading avatar to Supabase...");
      try {
        const extension = file.name.split(".").pop();
        const nameSlug = profile.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        const randomHash = Math.random().toString(36).substring(2, 12);
        const fileName = `${nameSlug}/${randomHash}.${extension}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from("m11_profiles")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: true,
            contentType: file.type,
          });

        if (error) throw error;

        // Get Public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("m11_profiles").getPublicUrl(data.path);

        setProfile({ ...profile, avatar: publicUrl });
        setPreviewUrl(publicUrl);
        toast.success("Avatar uploaded successfully!", { id: loadingToast });
      } catch (error: any) {
        console.error("FULL UPLOAD ERROR:", error);
        const message =
          error.message || error.error_description || "Upload failed";
        toast.error(`Error: ${message}`, { id: loadingToast });
      } finally {
        e.target.value = "";
      }
    }
  };

  return (
    <div className="max-w-8xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="text-neutral-500 mt-1">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm text-center">
            <div className="relative inline-block mb-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div className="w-24 h-24 rounded-full bg-linear-to-tr from-red-500 to-orange-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden relative shadow-inner">
                {previewUrl || profile.avatar ? (
                  <Image
                    src={previewUrl || profile.avatar}
                    alt="Profile"
                    fill
                    unoptimized={!!previewUrl}
                    className="object-cover"
                  />
                ) : (
                  profile.name[0]
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2.5 bg-white dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 shadow-lg transition-all cursor-pointer group"
                title="Change Avatar"
              >
                <HugeiconsIcon
                  icon={Camera01Icon}
                  size={16}
                  className="text-neutral-600 dark:text-neutral-400 group-hover:text-red-500 transition-colors"
                />
              </button>
            </div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              {profile.name}
            </h2>
            <p className="text-sm text-neutral-500">{profile.email}</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form
            onSubmit={handleSave}
            className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6"
          >
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-4">
              General Information
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                    <HugeiconsIcon icon={UserCircleIcon} size={20} />
                  </div>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                    <HugeiconsIcon icon={Mail01Icon} size={20} />
                  </div>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-neutral-500 cursor-not-allowed"
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Avatar Path (Automatically Generated)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                    <HugeiconsIcon icon={Camera01Icon} size={20} />
                  </div>
                  <input
                    type="text"
                    value={profile.avatar}
                    readOnly
                    placeholder="/profile/admin-user/x7k2b8s9p1.jpeg"
                    className="w-full bg-neutral-50/50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl py-3 pl-12 pr-4 outline-none text-neutral-500 cursor-not-allowed italic text-sm"
                  />
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-4 pt-4">
              Security
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                    <HugeiconsIcon icon={LockKeyIcon} size={20} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                    <HugeiconsIcon icon={LockKeyIcon} size={20} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-red-600/20 hover:shadow-red-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <HugeiconsIcon icon={Tick02Icon} size={20} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
