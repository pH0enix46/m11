import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";

// GET all products (admin view - includes inactive)
export async function GET(request) {
  try {
    const admin = await requireAdmin(request);
    if (admin instanceof Response) return admin;

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .sort("-createdAt")
      .limit(limit)
      .skip(skip);

    const total = await Product.countDocuments();

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin get products error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
// CREATE product
export async function POST(request) {
  try {
    const admin = await requireAdmin(request);
    if (admin instanceof Response) return admin;
    await connectDB();

    const data = await request.json();

    const product = await Product.create({
      ...data,
      createdBy: admin._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
// UPDATE product
export async function PUT(request) {
  try {
    const admin = await requireAdmin(request);
    if (admin instanceof Response) return admin;

    await connectDB();

    const { id, ...updates } = await request.json();

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
// DELETE product
export async function DELETE(request) {
  try {
    const admin = await requireAdmin(request);
    if (admin instanceof Response) return admin;

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
