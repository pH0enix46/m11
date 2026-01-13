/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IProduct } from "@/lib/types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ImageAdd02Icon,
  LeftToRightListNumberIcon,
  Tag01Icon,
  Money03Icon,
  Tick02Icon,
  ArrowLeft02Icon,
  Delete02Icon,
  ShoppingBag01Icon, // Added this icon from your snippet
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { createProductAction, updateProductAction } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion"; // Added for your design

interface ProductFormProps {
  initialData?: IProduct;
  isNew?: boolean;
}

export default function ProductForm({
  initialData,
  isNew = false,
}: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [previews, setPreviews] = useState<string[]>(initialData?.images || []);
  const [uploading, setUploading] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<IProduct>>(
    initialData || {
      name: "",
      slug: "",
      description: "",
      price: 0,
      discountPrice: 0,
      category: "Grand",
      images: [""],
      features: [],
      sizes: [],
      isActive: true,
      quantity: 0,
      badge: "",
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading(
      isNew ? "Creating product..." : "Updating product..."
    );
    try {
      let res;
      if (isNew) {
        res = await createProductAction(formData);
      } else {
        res = await updateProductAction(initialData!._id, formData);
      }

      console.log(res, "res from submit");
      if (res.success) {
        toast.success(
          isNew
            ? "Product created successfully"
            : "Product updated successfully",
          { id: loadingToast }
        );
        setFormData({
          name: "",
          slug: "",
          description: "",
          price: 0,
          discountPrice: 0,
          category: "Grand",
          images: [""],
          features: [],
          sizes: [],
          isActive: true,
          quantity: 0,
          badge: "",
        });
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to save product", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Save product error:", error);
      toast.error("An error occurred while saving the product", {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const removeImageField = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });

    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...(formData.images || []), ""] });
    setPreviews([...previews, ""]);
  };

  const triggerFileSelect = (index: number) => {
    setActiveImageIndex(index);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeImageIndex !== null) {
      setUploading(activeImageIndex);
      const loadingToast = toast.loading("Uploading image...");

      try {
        const extension = file.name.split(".").pop();
        const nameSlug = formData.name
          ? formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
          : "product";
        const randomHash = Math.random().toString(36).substring(2, 12);
        const fileName = `${nameSlug}/${randomHash}.${extension}`;

        const { data, error } = await supabase.storage
          .from("m11_products")
          .upload(fileName, file, { cacheControl: "3600", upsert: true });

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from("m11_products").getPublicUrl(data.path);

        handleImageChange(activeImageIndex, publicUrl);
        const newPreviews = [...previews];
        newPreviews[activeImageIndex] = publicUrl;
        setPreviews(newPreviews);

        toast.success("Uploaded!", { id: loadingToast });
      } catch (error: any) {
        toast.error("Upload failed", { id: loadingToast });
      } finally {
        setUploading(null);
        e.target.value = "";
      }
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <HugeiconsIcon
            icon={ArrowLeft02Icon}
            size={24}
            className="text-neutral-500"
          />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {isNew ? "Add New Product" : "Edit Product"}
          </h1>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start"
      >
        {/* Left Side: Main Form Fields (2 Cols) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <HugeiconsIcon
                icon={Tag01Icon}
                size={20}
                className="text-red-500"
              />
              Basic Info
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-all"
                  placeholder="e.g. Classic Leather Jacket"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-all resize-none"
                  placeholder="Describe your product..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-all"
                  >
                    <option value="Grand Series">Grand Series</option>
                    <option value="Simple Series">Simple Series</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Badge</label>
                  <input
                    type="text"
                    value={formData.badge || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, badge: e.target.value })
                    }
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-all"
                    placeholder="e.g. Best Seller"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <HugeiconsIcon
                  icon={ImageAdd02Icon}
                  size={20}
                  className="text-red-500"
                />
                Media
              </h2>
              <button
                type="button"
                onClick={addImageField}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                + Add URL
              </button>
            </div>
            <div className="space-y-4">
              {formData.images?.map((url, index) => (
                <div key={index} className="flex gap-4">
                  <button
                    type="button"
                    disabled={uploading !== null}
                    onClick={() => triggerFileSelect(index)}
                    className="w-16 h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0 overflow-hidden border border-neutral-200 dark:border-neutral-700 relative hover:ring-2 hover:ring-red-500/20 transition-all"
                  >
                    {uploading === index ? (
                      <div className="w-full h-full flex items-center justify-center bg-neutral-900/50">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    ) : previews[index] || url ? (
                      <Image
                        src={previews[index] || url}
                        alt="Preview"
                        fill
                        className="object-cover"
                        sizes="64px"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        <HugeiconsIcon icon={ImageAdd02Icon} size={24} />
                      </div>
                    )}
                  </button>
                  <input
                    type="text"
                    value={url}
                    readOnly
                    className="flex-1 bg-neutral-50/50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 outline-none text-neutral-500 cursor-not-allowed italic text-sm"
                    placeholder="Automatic path generation..."
                  />
                  {formData.images && formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="p-3 text-neutral-400 hover:text-red-600 rounded-xl transition-all"
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle: Settings (1 Col) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <HugeiconsIcon
                icon={Money03Icon}
                size={20}
                className="text-red-500"
              />
              Pricing
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Base Price (৳)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-3 px-4 outline-none focus:border-red-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Discount Price (৳)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.discountPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-3 px-4 outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <HugeiconsIcon
                icon={LeftToRightListNumberIcon}
                size={20}
                className="text-red-500"
              />
              Inventory
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                <span className="font-medium">Active Status</span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, isActive: !formData.isActive })
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    formData.isActive ? "bg-green-500" : "bg-neutral-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      formData.isActive ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Sizes</label>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        sizes: [...(formData.sizes || []), ""],
                      });
                    }}
                    className="text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    + Add Size
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.sizes && formData.sizes.length > 0 ? (
                    formData.sizes.map((size, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={size}
                          onChange={(e) => {
                            const newSizes = [...(formData.sizes || [])];
                            newSizes[index] = e.target.value;
                            setFormData({ ...formData, sizes: newSizes });
                          }}
                          placeholder="e.g. S, M, L, XL"
                          className="flex-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2 outline-none focus:border-red-500 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newSizes = [...(formData.sizes || [])];
                            newSizes.splice(index, 1);
                            setFormData({ ...formData, sizes: newSizes });
                          }}
                          className="p-2 text-neutral-400 hover:text-red-600 rounded-xl transition-all"
                        >
                          <HugeiconsIcon icon={Delete02Icon} size={18} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, sizes: [""] });
                      }}
                      className="w-full py-3 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-400 hover:text-red-600 hover:border-red-300 transition-all"
                    >
                      Click to add first size
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-full shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Saving...</span>
            ) : (
              <>
                <HugeiconsIcon icon={Tick02Icon} size={20} />
                Save Product
              </>
            )}
          </button>
        </div>

        {/* Right Side: LIVE PREVIEW (1 Col) - STICKY */}
        <div className="xl:block hidden sticky top-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">
            Live Preview
          </h2>
          <div className="pointer-events-none opacity-90 scale-95 origin-top">
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group flex flex-col h-full bg-white dark:bg-neutral-900 rounded-3xl p-2"
            >
              <div className="flex flex-col h-full">
                <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl shrink-0">
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    {formData.badge && (
                      <span className="bg-[#E2FF3B] text-black text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest rounded-full">
                        {formData.badge}
                      </span>
                    )}
                    {(formData.discountPrice ?? 0) > 0 && (
                      <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest rounded-full">
                        Sale
                      </span>
                    )}
                  </div>

                  {formData.images?.[0] ? (
                    <Image
                      src={formData.images[0]}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-neutral-400">
                      No Image
                    </div>
                  )}

                  {formData.images?.[1] && (
                    <Image
                      src={formData.images[1]}
                      alt="Preview 2"
                      fill
                      className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-opacity"
                      unoptimized
                    />
                  )}

                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                    <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl text-black">
                      <HugeiconsIcon icon={ShoppingBag01Icon} size={24} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col grow space-y-2 p-2">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white min-h-[48px] line-clamp-2">
                      {formData.name || "Product Name Display"}
                    </h3>
                    <div className="text-right shrink-0">
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        ৳{formData.discountPrice || formData.price || 0}
                      </p>
                      {(formData.discountPrice ?? 0) > 0 && (
                        <p className="text-xs text-gray-400 line-through">
                          ৳{formData.price}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mt-auto">
                    {formData.category || "Category"}
                  </p>
                </div>
                {formData.sizes && formData.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.sizes
                      .filter((size) => size.trim() !== "")
                      .map((size, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-medium rounded-md border border-neutral-200 dark:border-neutral-700"
                        >
                          {size}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          <p className="text-[10px] text-center text-neutral-400 mt-4 italic">
            * This is how it will look in the storefront.
          </p>
        </div>
      </form>
    </div>
  );
}
