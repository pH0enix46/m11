import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { requireAuth } from "@/lib/auth";

export async function POST(request) {
  try {
    const user = await requireAuth();

    // If user is not authenticated, return a friendly message
    if (user instanceof Response) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login to add items to cart",
          requiresAuth: true,
        },
        { status: 401 }
      );
    }

    await connectDB();

    const { productId, quantity = 1, selectedSize } = await request.json();
    console.log(
      `Add request: Product ${productId}, Size ${selectedSize}, User ${user._id}`
    );

    if (!selectedSize) {
      return NextResponse.json(
        { success: false, message: "Please select a size" },
        { status: 400 }
      );
    }

    // CRITICAL: Validate if productId is a valid MongoDB ObjectId
    const mongoose = (await import("mongoose")).default;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.error("INVALID PRODUCT ID RECEIVED:", productId);
      return NextResponse.json(
        { success: false, message: "Invalid Product ID format" },
        { status: 400 }
      );
    }

    // Validate product exists in DB
    const product = await Product.findById(productId);
    if (!product) {
      console.error("PRODUCT NOT FOUND IN DB:", productId);
      return NextResponse.json(
        { success: false, message: "Product not found in database" },
        { status: 404 }
      );
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      console.log("No cart found, creating one for user:", user._id);
      cart = await Cart.create({ user: user._id, items: [] });
    }

    // Check if product with same size already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.selectedSize === selectedSize
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        selectedSize,
        price: product.discountPrice || product.price,
      });
    }

    try {
      await cart.save();
      console.log("SUCCESS: Cart persisted to database for user:", user._id);
    } catch (saveError) {
      console.error("DATABASE SAVE FAILURE:", saveError);
      throw saveError;
    }

    // Explicitly populate to return full product data to frontend
    await cart.populate("items.product");

    return NextResponse.json({
      success: true,
      message: "Product added to cart",
      data: cart,
    });
  } catch (error) {
    console.error("FATAL ADD TO CART ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
