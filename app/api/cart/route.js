import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { requireAuth } from "@/lib/auth";

// GET user cart
export async function GET() {
  try {
    console.log("[CART_GET] Starting cart fetch...");
    const user = await requireAuth();
    console.log(
      "[CART_GET] Auth result:",
      user instanceof Response ? "Response (auth failed)" : "User authenticated"
    );

    // If user is not authenticated, return empty cart for guest users
    if (user instanceof Response) {
      console.log("[CART_GET] No auth - returning empty cart for guest");
      return NextResponse.json({
        success: true,
        data: { items: [], totalPrice: 0 },
        guest: true,
      });
    }

    try {
      await connectDB();
    } catch (dbError) {
      console.error("[CART_DB_CONNECT_ERROR]", dbError);
      return NextResponse.json(
        { success: false, message: "Database connection failed" },
        { status: 500 }
      );
    }

    if (!user?._id) {
      return NextResponse.json(
        { success: false, message: "Invalid user session" },
        { status: 401 }
      );
    }

    let cart;
    try {
      cart = await Cart.findOne({ user: user._id }).populate("items.product");
    } catch (fetchError) {
      console.error("[CART_FETCH_ERROR]", fetchError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch cart. Schema might be out of sync.",
          error: fetchError.message,
          name: fetchError.name,
        },
        { status: 500 }
      );
    }

    if (!cart) {
      try {
        console.log("No cart found, creating one for user:", user._id);
        cart = await Cart.create({ user: user._id, items: [] });
      } catch (createError) {
        console.error("[CART_CREATE_ERROR]", createError);
        return NextResponse.json(
          {
            success: false,
            message: "Failed to initialize cart.",
            error: createError.message,
            name: createError.name,
          },
          { status: 500 }
        );
      }
    }

    // 2. Filter out orphaned items (where product no longer exists)
    try {
      const initialCount = cart.items.length;
      cart.items = cart.items.filter((item) => item.product);

      if (cart.items.length !== initialCount) {
        console.log(
          `Cleaned up ${
            initialCount - cart.items.length
          } orphaned items from cart`
        );
        await cart.save();
      }
    } catch (cleanupError) {
      console.error("[CART_CLEANUP_ERROR]", cleanupError);
      // Non-critical, but good to know
    }

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("[CART_UNHANDLED_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
