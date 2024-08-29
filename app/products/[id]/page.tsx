"use client";

import Image from "next/image";
import { IoShareSocialOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { CiShoppingCart } from "react-icons/ci";
import StockBadge from "@/app/components/stockBadge";
import QuantitySelector from "@/app/components/quantitySelector";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
import CustomTop from "@/app/components/customTop";
import SimilarProducts from "@/app/components/similarProducts";
import { useCart } from "@/context/cartContext";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ... (keep all interfaces as they are)
interface Dimensions {
  height: number;
  width: number;
  depth: number;
}

interface Reviews {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}
interface ProductDetails {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  rating: number;
  availabilityStatus: "In Stock" | "Out of Stock" | "Low Stock";
  brand: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  returnPolicy: string;
  minimumOrderQuantity: number;
  reviews: Reviews[];
  category: string;
  thumbnail: string;
  stock: number;
}

const ProductbyID = ({ params }: { params: { id: number } }) => {
  // ... (keep all state and useEffect hooks as they are)
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

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

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: quantity, // Default quantity
        image: product.thumbnail,
        minimumOrderQuantity: product.minimumOrderQuantity,
      });
      toast.success(`${product.title} added to cart (${quantity})`, {
        dismissible: true,
        closeButton: true,
      });
    } else toast.error("Item was not added to cart");
  };

  if (!product) return <div>Loading...</div>;

  const currentUrl = window.location.href;

  return (
    <main className="flex w-full flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16">
      <CustomTop classname="bg-n100" />
      <div className="mx-auto flex w-full max-w-6xl flex-col pt-5">
        <div className="my-6 flex flex-col sm:my-10 lg:flex-row lg:justify-between lg:space-x-8">
          <div className="mb-8 w-full lg:mb-0 lg:w-[400px]">
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
                    <div className="relative aspect-square w-full">
                      <Image
                        className="rounded-lg border-[1px] border-n100 object-cover shadow-sm"
                        src={image}
                        alt={`Image ${index + 1} of ${product.title}`}
                        layout="fill"
                      />
                    </div>
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

          <div className="flex w-full flex-col justify-between lg:w-[500px]">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="mb-2 text-xl text-b900 sm:mb-0 sm:text-2xl">
                {product.title}
              </h2>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="cursor-pointer">
                    <IoShareSocialOutline size={25} className="text-b900" />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <p>Share this product</p>
                  <p className="mt-2 break-all text-sm">{currentUrl}</p>
                </HoverCardContent>
              </HoverCard>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:space-x-5">
              <div className="mb-2 flex items-center sm:mb-0">
                <FaStar size={20} className="mr-1 text-yellow-500" />
                <span>{product.rating}</span>
              </div>
              <div className="flex-shrink-0">
                <StockBadge status={product.availabilityStatus} />
              </div>
            </div>

            <div className="mb-4 text-lg font-semibold">${product.price}</div>

            {(product.category === "mens-shirts" ||
              product.category === "womens-dresses" ||
              product.category === "tops") && (
              <div className="mb-4">
                <h3 className="mb-2 text-base font-medium">SELECT SIZE</h3>
                <SizeSelector />
              </div>
            )}

            <div className="mb-4">
              <h3 className="mb-2 text-lg text-b900">QUANTITY</h3>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={(newQuantity) => setQuantity(newQuantity)}
                />
                {quantity < product.minimumOrderQuantity ? (
                  <p className="mt-2 text-xs text-red-500 sm:mt-0">
                    Minimum order quantity is {product.minimumOrderQuantity}**
                  </p>
                ) : (
                  product.stock < product.minimumOrderQuantity && (
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger>
                          <p className="mt-2 text-xs text-red-500 sm:mt-0">
                            Product is low on stock**
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Can&apos;t order because current stock is{" "}
                            {product.stock}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                )}
              </div>
              {product.minimumOrderQuantity > 1 && (
                <span
                  className="mt-2 inline-block cursor-pointer text-xs hover:underline"
                  onClick={() => setQuantity(product.minimumOrderQuantity)}
                >
                  Set to minimum
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <Button
                className="mb-4 flex w-full items-center justify-center space-x-2 bg-b900 transition-colors duration-300 ease-in-out disabled:bg-red-900 sm:mb-0 sm:w-auto"
                disabled={
                  product.stock < product.minimumOrderQuantity ||
                  quantity < product.minimumOrderQuantity ||
                  product.availabilityStatus === "Out of Stock"
                }
                onClick={handleAddToCart}
              >
                <span>Add to cart</span>
                <CiShoppingCart size={25} />
              </Button>
              <div className="flex w-full items-center justify-center rounded-md border-2 border-neutral-200 bg-transparent p-3 sm:w-auto">
                <FaRegHeart className="text-n300 hover:fill-red-700" />
              </div>
            </div>
          </div>
        </div>
        <DetailsReview
          details={product.description}
          rating={product.rating}
          brand={product.brand}
          weight={product.weight}
          height={product.dimensions.height}
          width={product.dimensions.width}
          depth={product.dimensions.depth}
          warranty={product.warrantyInformation}
          shipping={product.shippingInformation}
          returnPolicy={product.returnPolicy}
          minimum={product.minimumOrderQuantity}
          reviews={product.reviews}
        />
        <div className="mb-20">
          <div className="mb-6 sm:mb-10">
            <h2 className="mb-2 text-xl font-bold text-b900 sm:text-2xl">
              You might also like
            </h2>
            <h4 className="text-sm text-n300">SIMILAR PRODUCTS</h4>
          </div>
          <SimilarProducts category={product.category} excludeId={product.id} />
        </div>
      </div>
      <Newsletter />
      <Footer className="" />
    </main>
  );
};

export default ProductbyID;
