import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

export async function getCurrentUser() {
  try {
    console.log("[GET_CURRENT_USER] Starting...");
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
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
      return null; // Return null instead of Response for unauthenticated users
    }

    console.log("[REQUIRE_AUTH] Authentication successful for user:", user._id);
    return user;
  } catch (error) {
    console.error("[REQUIRE_AUTH] Error during auth:", error);
    // For actual errors (not just missing auth), return error Response
    return NextResponse.json(
      { success: false, message: "Authentication error", error: error.message },
      { status: 500 }
    );
  }
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Authentication required" },
      { status: 401 }
    );
  }

  if (user.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Admin access required" },
      { status: 403 }
    );
  }

  return user;
}
