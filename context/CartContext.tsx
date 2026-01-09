"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/constants/products";
import { useAuth } from "./AuthContext";
import {
  getCartAction,
  addToCartAction,
  removeFromCartAction,
  updateCartQuantityAction,
  syncCartAction,
} from "@/lib/actions";

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
      const savedCart = localStorage.getItem("cart");
      let localItems = [];
      if (savedCart) {
        try {
          localItems = JSON.parse(savedCart);
        } catch (e) {
          console.error("Failed to parse cart from localStorage", e);
        }
      }

      if (user) {
        // If there's a local cart, sync it with the DB first
        if (localItems.length > 0) {
          try {
            const data = await syncCartAction({
              items: localItems.map((item: CartItem) => ({
                product: item._id || item.id,
                quantity: item.quantity,
                selectedSize: item.selectedSize,
                price: item.discountPrice || item.price,
              })),
            });

            if (data.success) {
              localStorage.removeItem("cart"); // Clear local cart after sync
            }
          } catch (error) {
            console.error("Cart sync failed", error);
          }
        }

        // Fetch final cart from DB
        try {
          const data = await getCartAction();
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
        // Guest user: use local items
        setCartItems(localItems);
      }
      setIsInitialized(true);
    };

    initCart();
  }, [user]);

  // Save cart to localStorage (Only for guests)
  useEffect(() => {
    if (isInitialized && !user) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized, user]);

  const syncCart = async () => {
    if (!user) return;
    try {
      const data = await getCartAction();
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
        const data = await addToCartAction({
          product: productId,
          selectedSize,
          quantity: 1,
          price: product.discountPrice || product.price,
        });

        if (!data.success) {
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
        await removeFromCartAction({ productId, selectedSize });
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
        await updateCartQuantityAction({ productId, selectedSize, quantity });
      } catch (error) {
        console.error("Failed to update cart in DB", error);
      }
    }
  };

  const clearCart = () => {
    setCartItems([]);
    if (!user) {
      localStorage.removeItem("cart");
    }
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
