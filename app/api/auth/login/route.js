import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";

export const runtime = "nodejs"; // 🔥 FIX

export async function POST(request) {
  try {
    // await connectDB();

    // const { phone, password } = await request.json();

    // if (!phone || !password) {
    //   return NextResponse.json(
    //     { success: false, message: "Please provide phone number and password" },
    //     { status: 400 }
    //   );
    // }

    // const user = await User.findOne({ phone }).select("+password");

    // if (!user) {
    //   return NextResponse.json(
    //     { success: false, message: "Invalid credentials" },
    //     { status: 401 }
    //   );
    // }

    // if (!user.isActive) {
    //   return NextResponse.json(
    //     { success: false, message: "Account is deactivated" },
    //     { status: 401 }
    //   );
    // }

    // const isPasswordValid = await user.comparePassword(password);

    // if (!isPasswordValid) {
    //   return NextResponse.json(
    //     { success: false, message: "Invalid credentials" },
    //     { status: 401 }
    //   );
    // }

    // const token = await generateToken(user._id);

    // const response = NextResponse.json(
    //   {
    //     success: true,
    //     message: "Login successful",
    //     user: {
    //       id: user._id,
    //       name: user.name,
    //       email: user.email,
    //       phone: user.phone,
    //       role: user.role,
    //     },
    //   },
    //   { status: 200 }
    // );

    // response.cookies.set("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 7 * 24 * 60 * 60,
    //   path: "/",
    // });

    // return response;
    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: "1",
          name: "Test User",
          email: "test@example.com",
          phone: "1234567890",
          role: "user",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
