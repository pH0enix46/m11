import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide product name"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Please provide product slug"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: ["Classic", "Premium", "Sport"],
    },
    images: {
      type: [String],
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: [],
    },
    badge: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
ProductSchema.index({ name: "text", description: "text" });

// In development, handle model refresh
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Product;
}

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
