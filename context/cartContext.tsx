"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

// Define types
type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
  minimumOrderQuantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  getTotalItems: () => number;
  getItemMinQuantity: (id: number) => number;
  clearCart: () => void;
};

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart =
      typeof window !== "undefined"
        ? window.localStorage.getItem("cartItems")
        : null;
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    const totalItems = getTotalItems();
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("totalItemCount", `${totalItems}`);
    window.dispatchEvent(new CustomEvent("cartUpdated")); // Trigger the event to notify listeners
  }); //removed dependency array for testing [cartItems]

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      const updatedItems = existingItem
        ? prevItems.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          )
        : [...prevItems, item];

      return updatedItems;
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getItemMinQuantity = (id: number) => {
    const item = cartItems.find((item) => item.id === id);
    return item ? item.minimumOrderQuantity : 1;
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalItems,
        getItemMinQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
