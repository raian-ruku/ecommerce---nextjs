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

type Products = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  brand: string;
  availabilityStatus: "In Stock" | "Out of Stock" | "Low Stock";
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
  const [products, setProducts] = useState<Products[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://dummyjson.com/products/category/${category}?sortBy=rating&order=desc`,
      );
      const data = await response.json();
      const filteredProducts = data.products.filter(
        (product: Products) => product.id !== excludeId,
      );
      setProducts(filteredProducts);
    };

    fetchData();
  }, [category, excludeId]);

  return (
    <Carousel opts={{ align: "start", loop: true, dragFree: true }}>
      <div
        className={`flex w-container flex-row justify-between gap-x-6 ${className}`}
      >
        <CarouselContent className="w-container">
          {products.map((product) => {
            return (
              <CarouselItem key={product.id} className="basis-1/4">
                <div className="flex flex-col gap-y-5">
                  <Image
                    className="h-[256px] w-[256px] justify-self-center"
                    src={product.thumbnail}
                    alt={product.title}
                    unoptimized
                    height={256}
                    width={256}
                  />
                  <Link href={`/products/${product.id}`}>
                    <div className="h-[100px] w-[256px] text-b900">
                      {product.title}
                    </div>
                  </Link>
                  <div className="h-[30px] text-b900">{product.brand}</div>
                  <div className="flex w-auto items-center gap-4">
                    <StockBadge status={product.availabilityStatus} />$
                    {product.price}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
};

export default SimilarProducts;
