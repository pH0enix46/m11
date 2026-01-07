import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { requireAuth } from "@/lib/auth";

export async function POST(request) {
  try {
    const user = await requireAuth(request);
    if (user instanceof Response) return user;

    await connectDB();

    const { productId, quantity = 1 } = await request.json();

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Check stock
    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, message: "Insufficient stock" },
        { status: 400 }
      );
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      cart = new Cart({ user: user._id, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }

    await cart.save();
    await cart.populate("items.product");

    return NextResponse.json({
      success: true,
      message: "Product added to cart",
      data: cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
