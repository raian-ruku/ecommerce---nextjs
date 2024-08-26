"use client";
import Link from "next/link";
import CustomTop from "../components/customTop";
import SideBar from "./_components/sideBar";
import StockBadge from "../components/stockBadge";
import Image from "next/image";
import { Footer } from "../components/footer";
import { Newsletter } from "../components/newsletter";
import PaginationComponent from "../components/paginationComponent";
import React, { useState, useEffect } from "react";
import { useCart } from "@/context/cartContext";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

interface ProductDetails {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  brand: string;
  availabilityStatus: "In Stock" | "Out of Stock" | "Low Stock";
}

const ProductPage = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [products, setProducts] = useState<ProductDetails[]>([]);
  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      const skip = (page - 1) * productsPerPage;
      const response = await fetch(
        `https://dummyjson.com/products?sortBy=price&order=asc&limit=${productsPerPage}&skip=${skip}`,
      );
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(Math.ceil(data.total / productsPerPage));
    };

    fetchProducts();
  }, [page]);

  return (
    <main className="flex w-full flex-col items-center justify-center">
      <CustomTop classname="bg-n100" />
      <div className="my-20 flex w-container justify-between">
        <SideBar />
        <div className="grid grid-cols-3 justify-between gap-2 gap-y-4">
          {products.map((prod) => (
            <div key={prod.id}>
              <div className="flex flex-col gap-y-5 rounded-md border-[1px] border-n100 p-4 shadow-md">
                <Image
                  className="h-[256px] w-[256px] justify-self-center"
                  src={prod.thumbnail}
                  alt={prod.title}
                  unoptimized
                  height={256}
                  width={256}
                />
                <Link href={`/products/${prod.id}`}>
                  <div className="h-[50px] w-[256px] text-b900 hover:underline hover:underline-offset-2">
                    {prod.title}
                  </div>
                </Link>
                <div className="h-[30px] text-b900">{prod.brand}</div>
                <div className="flex w-auto items-center gap-4">
                  <StockBadge status={prod.availabilityStatus} />${prod.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <PaginationComponent
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
      <Newsletter />
      <Footer />
    </main>
  );
};

export default ProductPage;
