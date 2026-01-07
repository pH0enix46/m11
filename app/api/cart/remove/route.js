import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { requireAuth } from "@/lib/auth";

export async function DELETE(request) {
  try {
    const user = await requireAuth(request);
    if (user instanceof Response) return user;

    await connectDB();

    const { productId } = await request.json();

    const cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.product");

    return NextResponse.json({
      success: true,
      message: "Product removed from cart",
      data: cart,
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
