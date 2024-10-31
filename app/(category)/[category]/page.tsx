"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CustomTop from "../../components/customTop";
import SideBar from "../../products/_components/sideBar";
import StockBadge from "../../components/stockBadge";
import { Footer } from "../../components/footer";
import { Newsletter } from "../../components/newsletter";
import PaginationComponent from "../../components/paginationComponent";
import { Button } from "@/components/ui/button";

interface ProductDetails {
  product_id: number;
  product_title: string;
  product_price: number;
  product_thumbnail: string;
  product_brand: string;
  product_stock: number;
  product_minimum: number;
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

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/category/${params.category}?page=${page}&limit=${productsPerPage}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const data: ApiResponse = await response.json();
      setProducts(data.data);
      setTotalPages(data.totalPages);
    };
    const currentPage = searchParams.get("page") || "1";
    setPage(parseInt(currentPage, 10));
    fetchProducts();
  }, [searchParams, page, params.category]);

  const handleFiltersChange = (
    category: string | null,
    price: [number, number],
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    params.set("minPrice", price[0].toString());
    params.set("maxPrice", price[1].toString());
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    // Update the URL and also the page state
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    setPage(newPage); // Update page state
    router.push(`?${params.toString()}`);
  };

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
                className={`lg:w-1/4 ${
                  isSidebarOpen ? "block" : "hidden lg:block"
                }`}
              >
                <SideBar onFiltersChange={handleFiltersChange} />
              </div>
              <div className="mt-4 lg:mt-0 lg:w-3/4 lg:pl-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((prod) => (
                    <div key={prod.product_id}>
                      <Link href={`/products/${prod.product_id}`}>
                        <div className="flex flex-col gap-y-3 rounded-md border-[1px] border-n100 p-4 shadow-md transition-all duration-200 ease-in-out hover:scale-[1.01] hover:bg-[#fffefc] hover:shadow-lg">
                          <div className="relative aspect-square w-full">
                            <Image
                              className="object-cover transition-transform duration-200 ease-in-out hover:scale-105"
                              src={prod.product_thumbnail}
                              alt={prod.product_title}
                              layout="fill"
                              unoptimized
                            />
                          </div>
                          <div className="line-clamp-2 h-12 text-sm text-b900 hover:underline hover:underline-offset-2 sm:text-base">
                            {prod.product_title}
                          </div>
                          <div className="h-6 text-xs text-b900 sm:text-sm">
                            {prod.product_brand}
                          </div>
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex-shrink-0">
                              <StockBadge
                                status={getAvailabilityStatus(
                                  prod.product_stock,
                                  prod.product_minimum,
                                )}
                              />
                            </div>
                            <div className="text-sm font-semibold sm:text-base">
                              ${prod.product_price}
                            </div>
                          </div>
                        </div>
                      </Link>
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
          onPageChange={handlePageChange}
        />
      </div>
      <Newsletter />
      <Footer />
    </main>
  );
};

export default ProductByCategoryPage;
