import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAuth } from "@/lib/auth";

// GET single order
export async function GET(request, { params }) {
  try {
    const user = await requireAuth(request);
    if (user instanceof Response) return user;

    await connectDB();

    const order = await Order.findOne({
      _id: params.id,
      user: user._id,
    }).populate("items.product", "name images");

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
