"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";
import { LuPackagePlus } from "react-icons/lu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";

interface Product {
  product_id: number;
  product_title: string;
  product_sku: string;
  product_thumbnail: string;
  creation_date: string;
  category_name: string;
  purchase_price: number;
  product_price: number;
  product_stock: number;
}

interface ProductsResponse {
  success: boolean;
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/all-products?page=${currentPage}&pageSize=${itemsPerPage}&search=${searchTerm}`,
        {
          credentials: "include", // This ensures cookies are sent with the request
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data: ProductsResponse = await response.json();
      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setTotalProducts(data.total);
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  return (
    <main className="flex h-screen w-full flex-col p-6">
      <div className="mb-6 flex h-fit w-full flex-row items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex flex-row items-center justify-center gap-3">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <LuPackagePlus className="mr-2" />
            Add Product
          </Button>
          <Input
            placeholder="Search products"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-64"
          />
          <CiSearch size={20} className="text-gray-400" />
        </div>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Pur. Price</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Uploaded at</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.product_id}>
                  <TableCell>
                    <Image
                      src={product.product_thumbnail}
                      alt={product.product_title}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                  </TableCell>
                  <TableCell>{product.product_title}</TableCell>
                  <TableCell>{product.product_sku}</TableCell>
                  <TableCell>${product.purchase_price}</TableCell>
                  <TableCell>${product.product_price}</TableCell>
                  <TableCell>{product.product_stock}</TableCell>
                  <TableCell>{product.category_name}</TableCell>
                  <TableCell>
                    {new Date(product.creation_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex items-center justify-between">
            <div>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalProducts)} of{" "}
              {totalProducts} products
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNumber);
                          }}
                          isActive={pageNumber === currentPage}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return <PaginationEllipsis key={pageNumber} />;
                  }
                  return null;
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        handlePageChange(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </main>
  );
};

export default ProductsPage;
