"use client";

import { useEffect, useState } from "react";
import StockBadge from "./stockBadge";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

type Product = {
  product_id: number;
  product_title: string;
  product_price: number;
  product_thumbnail: string;
  product_brand: string;
  product_minimum: number;
  product_stock: number;
};

const SimilarProducts = ({
  className,
  category,
  excludeId,
}: {
  className?: string;
  category: string;
  excludeId: number;
}) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/similar-products/${category}/${excludeId}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch similar products");
        }
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Error fetching similar products:", error);
      }
    };

    fetchSimilarProducts();
  }, [category, excludeId]);

  const getAvailabilityStatus = (
    product_stock: number,
    product_minimum: number,
  ) => {
    if (product_stock === 0) return "Out of Stock";
    if (product_stock >= product_minimum) return "In Stock";
    if (product_stock < product_minimum) return "Low Stock";
    return "Unknown";
  };

  return (
    <Carousel opts={{ align: "start", loop: true, dragFree: true }}>
      <div
        className={`flex w-container flex-row justify-between gap-x-6 ${className}`}
      >
        <CarouselContent className="w-container">
          {products.map((product) => (
            <CarouselItem key={product.product_id} className="basis-1/4">
              <div className="flex flex-col gap-y-5">
                <Image
                  className="h-[256px] w-[256px] justify-self-center"
                  src={product.product_thumbnail}
                  alt={product.product_title}
                  unoptimized
                  height={256}
                  width={256}
                />
                <Link href={`/products/${product.product_id}`}>
                  <div className="h-[100px] w-[256px] text-b900">
                    {product.product_title}
                  </div>
                </Link>
                <div className="h-[30px] text-b900">
                  {product.product_brand}
                </div>
                <div className="flex w-auto items-center gap-4">
                  <StockBadge
                    status={getAvailabilityStatus(
                      product.product_stock,
                      product.product_minimum,
                    )}
                  />
                  ${product.product_price}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
};

export default SimilarProducts;
