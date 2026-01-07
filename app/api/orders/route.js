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
    const user = await requireAuth();
    if (user instanceof Response) return user;

    await connectDB();

    const { shippingAddress, paymentMethod } = await request.json();
    console.log("Received shippingAddress:", shippingAddress);

    if (!shippingAddress) {
      return NextResponse.json(
        { success: false, message: "Shipping address is required" },
        { status: 400 }
      );
    }

    // 1. Get user cart with populated products
    const cart = await Cart.findOne({ user: user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Your cart is empty" },
        { status: 400 }
      );
    }

    // 2. Calculate final pricing
    const itemsPrice = cart.totalPrice || 0;
    const shippingPrice = itemsPrice > 5000 ? 0 : 60; // Free shipping over 5000
    const taxPrice = 0; // Tax included in price for now
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // 3. Create the order record
    console.log("Attempting to create order for user:", user._id);

    // Explicitly validate shippingAddress parts
    const missingFields = [];
    if (!shippingAddress.firstName) missingFields.push("firstName");
    if (!shippingAddress.lastName) missingFields.push("lastName");
    if (!shippingAddress.email) missingFields.push("email");
    if (!shippingAddress.phone) missingFields.push("phone");
    if (!shippingAddress.address) missingFields.push("address");
    if (!shippingAddress.city) missingFields.push("city");

    if (missingFields.length > 0) {
      console.log("Missing fields for order:", missingFields);
      return NextResponse.json(
        {
          success: false,
          message: `Missing required shipping fields: ${missingFields.join(
            ", "
          )}`,
          missingFields,
        },
        { status: 400 }
      );
    }

    let order;
    try {
      order = await Order.create({
        user: user._id,
        items: cart.items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          price: item.price,
          image: item.product.images[0] || "",
        })),
        shippingAddress: {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          email: shippingAddress.email || user.email || "no-email@example.com",
          address: shippingAddress.address,
          city: shippingAddress.city,
          phone: shippingAddress.phone,
        },
        paymentMethod: paymentMethod || "cash",
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        orderStatus: "pending",
      });
    } catch (dbError) {
      console.error("Mongoose Order Creation Error:", dbError);
      return NextResponse.json(
        {
          success: false,
          message: "Database validation failed. Please check your form data.",
          error: dbError.message,
        },
        { status: 400 }
      );
    }

    // 4. Clear the cart after successful order creation
    console.log("Order created successfully:", order.orderNumber);
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        orderNumber: order.orderNumber,
        data: order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Critical API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
