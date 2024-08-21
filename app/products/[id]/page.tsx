// import GetProductbyID from "@/app/backend/getProductbyID";
"use client";

import Image from "next/image";
import { Metadata } from "next";

import { IoShareSocialOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { CiShoppingCart } from "react-icons/ci";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import StockBadge from "@/app/components/stockBadge";

import QuantitySelector from "@/app/components/quantitySelector";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import LatestHome from "@/app/components/latestHome";
import { Footer } from "@/app/components/footer";
import { Newsletter } from "@/app/components/newsletter";
import SizeSelector from "../_components/sizeSelector";
import DetailsReview from "../_components/detailsReview";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import CustomTop from "@/app/components/customTop";
type Props = {
  params: { id: number };
};

// export async function generateMetadata({ params }: Props) {
//   const id: number = params.id;
//   const product: ProductDetails = await fetch(
//     `https://dummyjson.com/products/${id}`,
//   ).then((response) => response.json());
//   return {
//     title: product.title,
//   };
// }

interface ProductDetails {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  rating: number;
  availabilityStatus: "In Stock" | "Out of Stock";
}

const ProductbyID = ({ params }: { params: { id: number } }) => {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(
        `https://dummyjson.com/products/${params.id}`,
      );
      const data: ProductDetails = await response.json();
      setProduct(data);
    };

    fetchProduct();
  }, [params.id]);

  useEffect(() => {
    if (!api || !product) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api, product]);

  if (!product) return <div>Loading...</div>;

  return (
    <main className="flex w-full flex-col items-center justify-center">
      <CustomTop classname="bg-n100" />
      <div className="flex w-container flex-col justify-center pt-5">
        <div className="my-20 flex w-full justify-between">
          <div className="w-[400px]">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,

                dragFree: true,
              }}
            >
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <Image
                      className="h-[500px] w-[400px] rounded-lg border-[1px] border-n100 shadow-sm"
                      src={image}
                      alt={`Image ${index + 1} of ${product.title}`}
                      height={500}
                      width={400}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {count > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
            {count > 1 && (
              <div className="py-2 text-center text-sm text-neutral-200">
                Image {current} of {count}
              </div>
            )}
          </div>

          <div className="flex w-[500px] flex-col justify-between">
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-xl text-b900">{product.title}</h2>{" "}
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div>
                    <IoShareSocialOutline size={25} className="text-b900" />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent>Share this product</HoverCardContent>
              </HoverCard>
            </div>
            <div className="flex flex-row items-center gap-5">
              <div className="flex flex-row gap-4">
                <FaStar size={20} className="text-yellow-500" />{" "}
                {product.rating}
              </div>
              <StockBadge status={product.availabilityStatus} />
            </div>
            <div>${product.price}</div>

            <div className="flex flex-col gap-3">
              SELECT SIZE
              <SizeSelector />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg text-b900">QUANTITY</h3>
              <QuantitySelector />
            </div>
            <div className="flex flex-row items-center gap-4">
              <Button className="flex w-[300px] gap-4 bg-b900">
                Add to cart <CiShoppingCart size={25} className="" />
              </Button>
              <div className="flex items-center justify-center rounded-md border-2 border-neutral-200 bg-transparent p-[11px]">
                <FaRegHeart className="text-n300 hover:fill-red-700" />
              </div>
            </div>
          </div>
        </div>
        <DetailsReview details={product.description} rating={product.rating} />
        <div className="mb-20">
          <div className="mb-20 flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-b900">
              You might also like
            </h2>
            <h4 className="text-n300">SIMILAR PRODUCTS</h4>
          </div>
          <LatestHome />
        </div>
      </div>
      <Newsletter />
      <Footer className="" />
    </main>
  );
};

export default ProductbyID;
