"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/constants/products";
import { useAuth } from "./AuthContext";

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, selectedSize: string) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  updateQuantity: (
    productId: string,
    selectedSize: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize cart from localStorage OR Database
  useEffect(() => {
    const initCart = async () => {
      if (user) {
        // Fetch from DB if user is logged in
        try {
          const response = await fetch("/api/cart");
          if (!response.ok) {
            console.error(`Cart API returned ${response.status}`);
            return;
          }
          const data = await response.json();
          if (data.success && data.data && data.data.items) {
            const dbItems = data.data.items.map(
              (item: {
                product: Product;
                quantity: number;
                selectedSize: string;
                price: number;
              }) => ({
                ...item.product,
                quantity: item.quantity,
                selectedSize: item.selectedSize,
                price: item.price,
              })
            );
            setCartItems(dbItems);
          }
        } catch (error) {
          console.error("Failed to fetch cart from DB", error);
        }
      } else {
        // Fetch from localStorage if guest
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart));
          } catch (e) {
            console.error("Failed to parse cart from localStorage", e);
          }
        }
      }
      setIsInitialized(true);
    };

    initCart();
  }, [user]);

  // Save cart to localStorage (only for guests or as a backup)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  const syncCart = async () => {
    if (!user) return;
    try {
      const response = await fetch("/api/cart");
      const data = await response.json();
      if (data.success) {
        const dbItems = data.data.items.map(
          (item: {
            product: Product;
            quantity: number;
            selectedSize: string;
            price: number;
          }) => ({
            ...item.product,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            price: item.price,
          })
        );
        setCartItems(dbItems);
      }
    } catch (error) {
      console.error("Sync cart failed", error);
    }
  };

  const addToCart = async (product: Product, selectedSize: string) => {
    const productId = (product._id || product.id) as string;

    // If user is not logged in, prompt them to login
    if (!user) {
      alert("Please login to add items to your cart");
      window.location.href = "/login";
      return;
    }

    // Optimistic update
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) =>
          (item._id || item.id) === productId &&
          item.selectedSize === selectedSize
      );

      if (existingItem) {
        return prevItems.map((item) =>
          (item._id || item.id) === productId &&
          item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { ...product, quantity: 1, selectedSize }];
    });

    setIsCartOpen(true);

    // Sync with DB if logged in
    if (user) {
      try {
        const response = await fetch("/api/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, selectedSize, quantity: 1 }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.requiresAuth) {
            alert("Please login to add items to your cart");
            window.location.href = "/login";
          } else {
            console.error("Failed to add to cart:", data.message);
            // Revert optimistic update on error
            setCartItems((prevItems) =>
              prevItems.filter(
                (item) =>
                  !(
                    (item._id || item.id) === productId &&
                    item.selectedSize === selectedSize
                  )
              )
            );
          }
        }
      } catch (error) {
        console.error("Failed to add to cart in DB", error);
        // Revert optimistic update on error
        setCartItems((prevItems) =>
          prevItems.filter(
            (item) =>
              !(
                (item._id || item.id) === productId &&
                item.selectedSize === selectedSize
              )
          )
        );
      }
    }
  };

  const removeFromCart = async (productId: string, selectedSize: string) => {
    // Optimistic update
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            (item._id || item.id) === productId &&
            item.selectedSize === selectedSize
          )
      )
    );

    // Sync with DB if logged in
    if (user) {
      try {
        await fetch("/api/cart/remove", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, selectedSize }),
        });
      } catch (error) {
        console.error("Failed to remove from cart in DB", error);
      }
    }
  };

  const updateQuantity = async (
    productId: string,
    selectedSize: string,
    quantity: number
  ) => {
    if (quantity < 1) return;

    // Optimistic update
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        (item._id || item.id) === productId &&
        item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    );

    // Sync with DB if logged in
    if (user) {
      try {
        await fetch("/api/cart/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, selectedSize, quantity }),
        });
      } catch (error) {
        console.error("Failed to update cart in DB", error);
      }
    }
  };

  const clearCart = () => {
    setCartItems([]);
    // Note: We might want a clear cart API too, but usually it's handled by individual removals or order placement
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.discountPrice || item.price) * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
        isCartOpen,
        setIsCartOpen,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
