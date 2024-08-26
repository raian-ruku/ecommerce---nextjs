"use client";

import { Footer } from "@/app/components/footer";
import { Newsletter } from "@/app/components/newsletter";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import CustomTop from "@/app/components/customTop";
import SideBar from "../../_components/sideBar";
import StockBadge from "@/app/components/stockBadge";
import PaginationComponent from "@/app/components/paginationComponent";
import { useCart } from "@/context/cartContext";
import { Button } from "@/components/ui/button";
import { BsCartPlus } from "react-icons/bs";
import { toast } from "sonner";

interface ProductDetails {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  brand: string;
  availabilityStatus: "In Stock" | "Out of Stock" | "Low Stock";
}

const ProductByCategoryPage = ({
  params,
}: {
  params: { category: string };
}) => {
  const { addToCart } = useCart();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [products, setProducts] = useState<ProductDetails[]>([]);
  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      const skip = (page - 1) * productsPerPage;
      const response = await fetch(
        `https://dummyjson.com/products/category/${params.category}?sortBy=price&order=asc&limit=${productsPerPage}&skip=${skip}`,
      );
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(Math.ceil(data.total / productsPerPage));
    };

    fetchProducts();
  }, [page, params.category]);

  const handleAddToCart = (productId: number) => {
    const product = products.find((prod) => prod.id === productId);
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1, // Default quantity
        image: product.thumbnail,
      });
      toast.success(`${product.title} added to cart`);
    } else toast.error("Item was not added to cart");
  };

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
                  <Button
                    className="bg-transparent hover:bg-transparent"
                    disabled={
                      prod.availabilityStatus === "Out of Stock" ? true : false
                    }
                    onClick={() => handleAddToCart(prod.id)}
                  >
                    <BsCartPlus
                      size={20}
                      className="text-b900 hover:bg-transparent"
                    />
                  </Button>
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

export default ProductByCategoryPage;
