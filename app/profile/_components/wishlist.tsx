"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { MdDeleteForever } from "react-icons/md";

interface WishListItems {
  product_id: number;
  product_title: string;
  product_price: number;
  product_thumbnail: string;
}
const WishList = () => {
  const [wishlistItems, setWishlistItems] = useState<WishListItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/wishlist`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setWishlistItems(data.data);
      } catch (error) {
        console.error("Error fetching wishlist items:", error);
        toast.error("Failed to fetch wishlist items");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistItems();
  }, []);

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/add-to-wishlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item.product_id !== productId),
      );
      toast.success("Item removed from wishlist");
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      toast.error("Failed to remove item from wishlist");
    }
  };

  if (isLoading) {
    return <div className="mt-8 text-center">Loading wishlist...</div>;
  }

  if (wishlistItems.length === 0) {
    return <div className="mt-8 text-center">Your wishlist is empty.</div>;
  }
  return (
    <div>
      <div className="space-y-2">
        {wishlistItems.length === 0 ? (
          <p>Your wishlist is empty.</p>
        ) : (
          wishlistItems.map((item) => (
            <div
              key={item.product_id}
              className="flex flex-col items-start justify-between space-y-2 border-b pb-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0"
            >
              <div className="flex items-center space-x-4">
                <Image
                  src={item.product_thumbnail}
                  alt=""
                  height={40}
                  width={40}
                  className="h-10 w-10 rounded-md bg-n100 object-cover"
                />
                <div>
                  <Link href={`/products/${item.product_id}`}>
                    <p className="font-medium hover:underline">
                      {item.product_title}
                    </p>
                  </Link>
                  <p className="mt-1 text-sm text-gray-500">
                    ${item.product_price}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-red-600 bg-transparent text-red-600 transition-colors duration-300 ease-in-out hover:bg-red-600 hover:text-white"
                  onClick={() => handleRemoveFromWishlist(item.product_id)}
                >
                  <MdDeleteForever size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WishList;
