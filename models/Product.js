import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide product name"],
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
    comparePrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: [
        "Electronics",
        "Clothing",
        "Books",
        "Home",
        "Sports",
        "Beauty",
        "Toys",
        "Other",
      ],
    },
    brand: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
ProductSchema.index({ name: "text", description: "text", tags: "text" });

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
