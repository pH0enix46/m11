import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { requireAuth } from "@/lib/auth";

export async function PUT(request) {
  try {
    const user = await requireAuth();
    if (user instanceof Response) return user;

    await connectDB();

    const { productId, selectedSize, quantity } = await request.json();

    if (quantity < 1) {
      return NextResponse.json(
        { success: false, message: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.selectedSize === selectedSize
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Item not found in cart" },
        { status: 404 }
      );
    }

    cart.items[itemIndex].quantity = quantity;

    await cart.save();
    await cart.populate("items.product");

    return NextResponse.json({
      success: true,
      message: "Cart updated",
      data: cart,
    });
  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
