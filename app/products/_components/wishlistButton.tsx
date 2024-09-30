"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaRegHeart } from "react-icons/fa6";
import { toast } from "sonner";

interface WishlistButtonProps {
  productId: number;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/wishlist-status/${productId}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setIsInWishlist(data.inWishlist);
      } catch (error) {
        console.error("Error fetching wishlist status:", error);
        toast.error("Failed to fetch wishlist status");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistStatus();
  }, [productId]);

  const handleWishlistToggle = async () => {
    setIsLoading(true);
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
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const data = await response.json();
      setIsInWishlist(data.added);
      toast.success(data.message, {
        dismissible: true,
        closeButton: true,
      });
    } catch (error: any) {
      console.error("Error toggling wishlist:", error);
      toast.error(error.message || "Failed to update wishlist", {
        dismissible: true,
        closeButton: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleWishlistToggle}
      disabled={isLoading}
      variant={isInWishlist ? "default" : "outline"}
      size="icon"
      className={
        isInWishlist
          ? "bg-green-800 transition-all duration-300 ease-in-out hover:bg-red-300"
          : "bg-transparent transition-all duration-300 ease-in-out hover:bg-green-300"
      }
    >
      <FaRegHeart
        className={
          isInWishlist
            ? "fill-white transition-all duration-300 ease-in-out"
            : "fill-b900 transition-all duration-300 ease-in-out"
        }
      />
      <span className="sr-only">
        {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      </span>
    </Button>
  );
};

export default WishlistButton;
