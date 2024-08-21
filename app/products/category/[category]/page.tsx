import { Footer } from "@/app/components/footer";
import { Newsletter } from "@/app/components/newsletter";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import CustomTop from "@/app/components/customTop";
import SideBar from "../../_components/sideBar";
import StockBadge from "@/app/components/stockBadge";

interface ProductDetails {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  availabilityStatus: "In Stock" | "Out of Stock";
}

const ProductByCategoryPage = async ({
  params,
}: {
  params: { category: string };
}) => {
  const response = await fetch(
    `https://dummyjson.com/products/category/${params.category}?sortBy=price&order=asc`,
  );
  const data = await response.json();
  const products: ProductDetails[] = data.products;

  return (
    <main className="flex w-full flex-col items-center justify-center">
      <CustomTop text="Products" bread="Products" classname="bg-n100" />
      <div className="my-20 flex w-container justify-between">
        <SideBar />
        <div className="grid grid-cols-3 justify-between gap-2">
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
                  <div className="h-[100px] w-[256px] text-b900">
                    {prod.title}
                  </div>
                </Link>
                <div className="flex w-auto items-center gap-4">
                  <StockBadge status={prod.availabilityStatus} />${prod.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Newsletter />
      <Footer />
    </main>
  );
};

export default ProductByCategoryPage;
