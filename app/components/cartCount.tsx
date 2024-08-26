"use client";

import { useEffect, useState } from "react";
import { CiShoppingCart } from "react-icons/ci";

const CartCount = () => {
  const [totalItems, setTotalItems] = useState<number>(0);

  const updateTotalItems = () => {
    const savedTotalItems = localStorage.getItem("totalItemCount");
    setTotalItems(savedTotalItems ? parseInt(savedTotalItems, 10) : 0);
  };

  useEffect(() => {
    // Initial load
    updateTotalItems();

    // Listen for custom cart update events
    const handleCartUpdate = () => {
      updateTotalItems();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  return (
    <div className="relative">
      <CiShoppingCart size={30} className="text-neutral-500" />
      {totalItems > 0 && (
        <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 py-1 text-[8px] text-white">
          {totalItems}
        </span>
      )}
    </div>
  );
};

export default CartCount;
