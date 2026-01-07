import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth";

// GET all orders
export async function GET(request) {
  try {
    const admin = await requireAdmin(request);
    if (admin instanceof Response) return admin;

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const query = {};
    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .sort("-createdAt")
      .limit(limit)
      .skip(skip)
      .populate("user", "name email")
      .populate("items.product", "name");

    const total = await Order.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin get orders error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// UPDATE order status
export async function PUT(request) {
  try {
    const admin = await requireAdmin(request);
    if (admin instanceof Response) return admin;

    await connectDB();

    const { orderId, orderStatus, paymentStatus, notes } = await request.json();

    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (notes) updateData.notes = notes;

    if (orderStatus === "delivered") {
      updateData.deliveredAt = new Date();
    }

    if (orderStatus === "cancelled") {
      updateData.cancelledAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true,
    }).populate("user", "name email");

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
