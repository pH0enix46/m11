import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { requireAuth } from "@/lib/auth";

// GET user orders
export async function GET(request) {
  try {
    const user = await requireAuth(request);
    if (user instanceof Response) return user;

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: user._id })
      .sort("-createdAt")
      .limit(limit)
      .skip(skip)
      .populate("items.product", "name images");

    const total = await Order.countDocuments({ user: user._id });

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
    console.error("Get orders error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// CREATE order
export async function POST(request) {
  try {
    const user = await requireAuth(request);
    if (user instanceof Response) return user;

    await connectDB();

    const { shippingAddress, paymentMethod } = await request.json();

    // Get user cart
    const cart = await Cart.findOne({ user: user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    // Validate stock
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Insufficient stock for ${item.product.name}`,
          },
          { status: 400 }
        );
      }
    }

    // Calculate prices
    const itemsPrice = cart.totalPrice;
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = itemsPrice * 0.1; // 10% tax
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // Create order
    const order = await Order.create({
      user: user._id,
      items: cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        image: item.product.images[0]?.url,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        data: order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
