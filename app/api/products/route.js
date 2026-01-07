import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

// GET all products (with filters, pagination, search)
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const skip = (page - 1) * limit;

    // Filters
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "-createdAt";

    // Build query
    const query = { isActive: true };

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Execute query
    const products = await Product.find(query)
      .sort(sort)
      .limit(limit)
      .skip(skip);

    const total = await Product.countDocuments(query);

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
    console.error("Get products error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
