import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";

export async function POST(request) {
  try {
    await connectDB();

    const { name, phone, password, email } = await request.json();

    // Validation
    if (!name || !phone || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide all required fields" },
        { status: 400 }
      );
    }

    // Validate phone format
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid phone number" },
        { status: 400 }
      );
    }

    // Check if user exists with this phone
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists with this phone number",
        },
        { status: 400 }
      );
    }

    // Create user
    const user = await User.create({
      name,
      phone,
      password,
      email, // optional
    });

    // Generate token
    const token = await generateToken(user._id);

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
