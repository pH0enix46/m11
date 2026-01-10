"use client";

import { useState, useRef } from "react";
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
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { createProductAction, updateProductAction } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

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
      category: "Classic",
      images: [""],
      features: [],
      sizes: [],
      isActive: true,
      quantity: 0,
      badge: "",
    }
  );
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      if (res.success) {
        toast.success(
          isNew
            ? "Product created successfully"
            : "Product updated successfully",
          { id: loadingToast }
        );
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
      const loadingToast = toast.loading("Uploading image to Supabase...");

      try {
        const extension = file.name.split(".").pop();
        const nameSlug = formData.name
          ? formData.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")
          : "product";
        const randomHash = Math.random().toString(36).substring(2, 12);
        const fileName = `${nameSlug}/${randomHash}.${extension}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from("m11_products")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: true,
            contentType: file.type,
          });

        if (error) throw error;

        // Get Public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("m11_products").getPublicUrl(data.path);

        // console.log("After Fetch: ", publicUrl);

        setImages([...images, publicUrl]);
        console.log("After Set: ", images);

        setFormData({
          ...formData,
          images: [...(formData.images || []), publicUrl],
        });

        // console.log("After Set: ", publicUrl);
        console.log(formData);

        // Update form data (actual URL for DB)
        handleImageChange(activeImageIndex, publicUrl);

        // Update preview
        const newPreviews = [...previews];
        newPreviews[activeImageIndex] = publicUrl;
        setPreviews(newPreviews);

        toast.success("Image uploaded successfully!", { id: loadingToast });
      } catch (error: any) {
        console.error("FULL UPLOAD ERROR:", error);
        const message =
          error.message || error.error_description || "Upload failed";
        toast.error(`Error: ${message}`, { id: loadingToast });
      } finally {
        setUploading(null);
        e.target.value = "";
      }
    }
  };

  return (
    <div className="max-w-8xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/products"
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
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
          <p className="text-neutral-500 text-sm">
            {isNew
              ? "Create a new product to add to your catalog"
              : `Editing: ${formData.name}`}
          </p>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <HugeiconsIcon
                  icon={Tag01Icon}
                  size={20}
                  className="text-red-500"
                />
                Basic Information
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    placeholder="e.g. Classic Leather Jacket"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
                    placeholder="Describe your product..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as IProduct["category"],
                        })
                      }
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                    >
                      <option value="Classic">Classic</option>
                      <option value="Premium">Premium</option>
                      <option value="Sport">Sport</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Badge (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.badge || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, badge: e.target.value })
                      }
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                      placeholder="e.g. Best Seller"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
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
                  className="text-sm font-medium text-red-600 hover:text-red-700 cursor-pointer"
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
                      className="w-16 h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0 overflow-hidden border border-neutral-200 dark:border-neutral-700 relative hover:ring-2 hover:ring-red-500/20 transition-all cursor-pointer group/img"
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
                          unoptimized={
                            !!previews[index] &&
                            previews[index].startsWith("blob:")
                          }
                          className="object-cover group-hover/img:scale-110 transition-transform"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <HugeiconsIcon icon={ImageAdd02Icon} size={24} />
                        </div>
                      )}
                    </button>
                    <div className="flex-1 flex gap-2">
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
                          className="p-3 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all cursor-pointer"
                        >
                          <HugeiconsIcon icon={Delete02Icon} size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <HugeiconsIcon
                  icon={Money03Icon}
                  size={20}
                  className="text-red-500"
                />
                Pricing
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Base Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                      $
                    </span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-3 pl-8 pr-4 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Discount Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.discountPrice || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountPrice: parseFloat(e.target.value),
                        })
                      }
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-3 pl-8 pr-4 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <HugeiconsIcon
                  icon={LeftToRightListNumberIcon}
                  size={20}
                  className="text-red-500"
                />
                Inventory & Variants
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    Active Status
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, isActive: !formData.isActive })
                    }
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      formData.isActive
                        ? "bg-green-500"
                        : "bg-neutral-300 dark:bg-neutral-700"
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
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    placeholder="e.g. 20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Sizes (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.sizes?.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sizes: e.target.value.split(",").map((s) => s.trim()),
                      })
                    }
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    placeholder="S, M, L, XL"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-full shadow-lg shadow-red-600/20 hover:shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
        </div>
      </form>
    </div>
  );
}
