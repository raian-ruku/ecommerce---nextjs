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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      <div className="w-full px-4 sm:px-6 lg:px-0">
        <div className="mx-auto max-w-7xl">
          <div className="my-8 sm:my-12 lg:mx-auto lg:my-20 lg:w-container">
            <div className="mb-4 lg:hidden">
              <Button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-full bg-b900 text-white"
              >
                {isSidebarOpen ? "Close Filters" : "Open Filters"}
              </Button>
            </div>
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <div
                className={`lg:w-1/4 ${isSidebarOpen ? "block" : "hidden lg:block"}`}
              >
                <SideBar />
              </div>
              <div className="mt-4 lg:mt-0 lg:w-3/4 lg:pl-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((prod) => (
                    <div key={prod.id}>
                      <div className="flex flex-col gap-y-3 rounded-md border-[1px] border-n100 p-4 shadow-md">
                        <div className="relative aspect-square w-full">
                          <Image
                            className="object-cover transition-transform duration-200 ease-in-out hover:scale-105"
                            src={prod.thumbnail}
                            alt={prod.title}
                            layout="fill"
                            unoptimized
                          />
                        </div>
                        <Link href={`/products/${prod.id}`}>
                          <div className="line-clamp-2 h-12 text-sm text-b900 hover:underline hover:underline-offset-2 sm:text-base">
                            {prod.title}
                          </div>
                        </Link>
                        <div className="h-6 text-xs text-b900 sm:text-sm">
                          {prod.brand}
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-shrink-0">
                            <StockBadge status={prod.availabilityStatus} />
                          </div>
                          <div className="text-sm font-semibold sm:text-base">
                            ${prod.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-8 w-full">
        <PaginationComponent
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
      <Newsletter />
      <Footer />
    </main>
  );
};

export default ProductPage;
