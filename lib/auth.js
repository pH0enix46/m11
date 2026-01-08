import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectDB from "./mongodb";
import User from "@/models/User";

export async function generateToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export async function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    console.log("[GET_CURRENT_USER] Starting...");
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    console.log("[GET_CURRENT_USER] Token exists:", !!token);
    if (!token) {
      console.log("[GET_CURRENT_USER] No token found in cookies");
      return null;
    }

    const decoded = await verifyToken(token);
    console.log("[GET_CURRENT_USER] Token decoded:", !!decoded);
    if (!decoded) {
      console.log("[GET_CURRENT_USER] Token verification failed");
      return null;
    }

    console.log("[GET_CURRENT_USER] Connecting to DB...");
    await connectDB();
    console.log("[GET_CURRENT_USER] DB connected, fetching user:", decoded.id);
    const user = await User.findById(decoded.id).select("-password");
    console.log("[GET_CURRENT_USER] User found:", !!user);
    return user;
  } catch (error) {
    console.error("[GET_CURRENT_USER] Error:", error.message);
    return null;
  }
}

export async function requireAuth() {
  console.log("[REQUIRE_AUTH] Starting authentication check...");
  try {
    const user = await getCurrentUser();
    console.log(
      "[REQUIRE_AUTH] getCurrentUser result:",
      user ? "User found" : "No user"
    );

    if (!user) {
      console.log("[REQUIRE_AUTH] Authentication failed - no user");
      return Response.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    console.log("[REQUIRE_AUTH] Authentication successful for user:", user._id);
    return user;
  } catch (error) {
    console.error("[REQUIRE_AUTH] Error during auth:", error);
    return Response.json(
      { success: false, message: "Authentication error", error: error.message },
      { status: 500 }
    );
  }
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { success: false, message: "Authentication required" },
      { status: 401 }
    );
  }

  if (user.role !== "admin") {
    return Response.json(
      { success: false, message: "Admin access required" },
      { status: 403 }
    );
  }

  return user;
}
