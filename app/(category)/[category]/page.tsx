"use client";

import { Footer } from "@/app/components/footer";
import { Newsletter } from "@/app/components/newsletter";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import CustomTop from "@/app/components/customTop";
import SideBar from "../../products/_components/sideBar";
import StockBadge from "@/app/components/stockBadge";
import PaginationComponent from "@/app/components/paginationComponent";
import { useCart } from "@/context/cartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductDetails {
  product_id: number;
  product_title: string;
  product_price: number;
  product_thumbnail: string;
  product_brand: string;
  product_availability: number;
}

interface ApiResponse {
  success: boolean;
  status: number;
  message: string;
  count: number;
  data: ProductDetails[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

const ProductByCategoryPage = ({
  params,
}: {
  params: { category: string };
}) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [products, setProducts] = useState<ProductDetails[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(
        `http://localhost:8000/api/v1/category/${params.category}?page=${page}&limit=${productsPerPage}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const data: ApiResponse = await response.json();
      setProducts(data.data);
      setTotalPages(data.totalPages);
    };

    fetchProducts();
  }, [page, params.category]);

  const getAvailabilityStatus = (product_availability: number) => {
    if (product_availability === 0) return "Out of Stock";
    if (product_availability === 1) return "In Stock";
    if (product_availability === 2) return "Low Stock";
    return "Unknown"; // Add a default case to handle undefined values
  };

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
                    <div key={prod.product_id}>
                      <div className="flex flex-col gap-y-3 rounded-md border-[1px] border-n100 p-4 shadow-md">
                        <div className="relative aspect-square w-full">
                          <Image
                            className="object-cover transition-transform duration-200 ease-in-out hover:scale-105"
                            src={prod.product_thumbnail}
                            alt={prod.product_title}
                            layout="fill"
                            unoptimized
                          />
                        </div>
                        <Link href={`/products/${prod.product_id}`}>
                          <div className="line-clamp-2 h-12 text-sm text-b900 hover:underline hover:underline-offset-2 sm:text-base">
                            {prod.product_title}
                          </div>
                        </Link>
                        <div className="h-6 text-xs text-b900 sm:text-sm">
                          {prod.product_brand}
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-shrink-0">
                            <StockBadge
                              status={getAvailabilityStatus(
                                prod.product_availability,
                              )}
                            />
                          </div>
                          <div className="text-sm font-semibold sm:text-base">
                            ${prod.product_price}
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

export default ProductByCategoryPage;
