import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  selectedSize: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total price before saving
CartSchema.pre("save", function () {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
});

// In development, handle model refresh
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Cart;
}

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
