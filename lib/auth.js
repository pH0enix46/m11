import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectDB from "./mongodb";
import User from "@/models/User";

export async function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export async function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return null;
    }

    await connectDB();
    const user = await User.findById(decoded.id).select("-password");
    return user;
  } catch (error) {
    return null;
  }
}

export async function requireAuth(request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { success: false, message: "Authentication required" },
      { status: 401 }
    );
  }

  return user;
}

export async function requireAdmin(request) {
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
