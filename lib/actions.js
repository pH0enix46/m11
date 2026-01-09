"use server";

import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

// Auth Actions
export async function loginAction(payload) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Login failed" };
    }

    const cookieStore = await cookies();
    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return {
      success: true,
      message: "Login successful",
      user: {
        id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Server error", error: error.message };
  }
}

export async function registerAction(payload) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Registration failed" };
    }

    const cookieStore = await cookies();
    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return {
      success: true,
      message: "Registration successful",
      user: {
        id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
      },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "Server error", error: error.message };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return { success: true, message: "Logged out successfully" };
}

export async function getCurrentUserAction() {
  try {
    const token = await getAuthToken();
    if (!token) return { success: false, message: "Not logged in" };

    const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch profile",
      };
    }

    return {
      success: true,
      user: {
        id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
      },
    };
  } catch (error) {
    console.error("Get user profile error:", error);
    return { success: false, message: "Server error" };
  }
}

// Cart Actions
export async function getCartAction() {
  try {
    const token = await getAuthToken();
    if (!token) return { success: true, data: { items: [], totalPrice: 0 } };

    const response = await fetch(`${BACKEND_URL}/api/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message };

    return { success: true, data: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function addToCartAction(payload) {
  try {
    const token = await getAuthToken();
    if (!token)
      return { success: false, message: "Unauthorized", requiresAuth: true };

    const response = await fetch(`${BACKEND_URL}/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message };

    return { success: true, data: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function removeFromCartAction(payload) {
  try {
    const token = await getAuthToken();
    if (!token) return { success: false, message: "Unauthorized" };

    const response = await fetch(
      `${BACKEND_URL}/api/cart/${payload.productId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message };

    return { success: true, data: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updateCartQuantityAction(payload) {
  try {
    const token = await getAuthToken();
    if (!token) return { success: false, message: "Unauthorized" };

    const response = await fetch(
      `${BACKEND_URL}/api/cart/${payload.productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantity: payload.quantity,
          selectedSize: payload.selectedSize,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message };

    return { success: true, data: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function syncCartAction(payload) {
  try {
    const token = await getAuthToken();
    if (!token) return { success: false, message: "Unauthorized" };

    const response = await fetch(`${BACKEND_URL}/api/cart/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message };

    return { success: true, data: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Order Actions
export async function getMyOrdersAction(queryString = "") {
  try {
    const token = await getAuthToken();
    if (!token) return { success: false, message: "Unauthorized" };

    const response = await fetch(
      `${BACKEND_URL}/api/orders/myorders${
        queryString ? `?${queryString}` : ""
      }`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message };

    return { success: true, data: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function placeOrderAction(payload) {
  try {
    const token = await getAuthToken();
    if (!token) return { success: false, message: "Unauthorized" };

    const response = await fetch(`${BACKEND_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message };

    return { success: true, message: "Order placed successfully", data: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function getOrderByIdAction(id) {
  try {
    const token = await getAuthToken();
    if (!token) return { success: false, message: "Unauthorized" };

    const response = await fetch(`${BACKEND_URL}/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message };

    return { success: true, data: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Product Actions
export async function getProductsAction(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.category && params.category !== "All")
      query.append("category", params.category);
    if (params.search) query.append("search", params.search);
    if (params.limit) query.append("limit", params.limit);

    const queryString = query.toString();
    const response = await fetch(
      `${BACKEND_URL}/api/products${queryString ? `?${queryString}` : ""}`
    );
    const data = await response.json();

    if (!response.ok) return { success: false, message: data.message };
    return { success: true, data: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function getProductBySlugAction(slug) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/products/slug/${slug}`);
    const data = await response.json();

    if (!response.ok) return { success: false, message: data.message };
    return { success: true, data: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
