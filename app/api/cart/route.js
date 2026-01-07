import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { requireAuth } from "@/lib/auth";

// GET user cart
export async function GET(request) {
  try {
    const user = await requireAuth(request);
    if (user instanceof Response) return user;

    await connectDB();

    let cart = await Cart.findOne({ user: user._id }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({ user: user._id, items: [] });
    }

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
