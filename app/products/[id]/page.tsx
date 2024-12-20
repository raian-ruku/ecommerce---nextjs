"use client";

import Image from "next/image";
import { IoShareSocialOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
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
import { MdContentCopy } from "react-icons/md";
import { CopyToClipboard } from "react-copy-to-clipboard";
import WishlistButton from "../_components/wishlistButton";

interface Reviews {
  review_id: number;
  review_rating: number;
  review_comment: string;
  creation_date: string;
  user_name: string;
}

type Dimensions = {
  height: number;
  width: number;
  depth: number;
};

interface Image {
  image_id: number;
  image_data: string;
}

interface ProductDetails {
  product_id: number;
  product_title: string;
  product_price: number;
  product_description: string;
  images: Image[];
  product_rating: number;
  product_brand: string;
  product_weight: number;
  dimension: Dimensions[];
  review: Reviews[];
  product_warranty: string;
  product_shipping: string;
  product_return: string;
  product_minimum: number;
  category_name: string;
  product_thumbnail: string;
  product_stock: number;
}

export default function ProductbyID({ params }: { params: { id: number } }) {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/products/${params.id}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.data && data.data[0]) {
        const productData = data.data[0];
        console.log("Full Product Data:", productData);
        setProduct(productData);
      } else {
        throw new Error("Product data not found in the response");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error("Error fetching product:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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

  const getAvailabilityStatus = (
    product_stock: number,
    product_minimum: number,
  ) => {
    if (product_stock === 0) return "Out of Stock";
    if (product_stock >= product_minimum) return "In Stock";
    if (product_stock < product_minimum) return "Low Stock";
    return "Unknown";
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.product_id,
        title: product.product_title,
        price: product.product_price,
        quantity: quantity,
        image: product.product_thumbnail,
        minimumOrderQuantity: product.product_minimum,
      });
      toast.success(`${product.product_title} added to cart (${quantity})`, {
        dismissible: true,
        closeButton: true,
      });
    } else toast.error("Item was not added to cart");
  };

  const handleReviewSubmit = () => {
    fetchProduct(); // Refresh the product data after a review is submitted
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No product found</div>;

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <main className="flex w-full flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16">
      <CustomTop classname="bg-n100 w-container" />
      <div className="mx-auto flex w-container max-w-6xl flex-col pt-5">
        <div className="my-6 flex w-container flex-col sm:my-10 lg:flex-row lg:justify-between lg:space-x-8">
          <div className="mb-8 w-container lg:mb-0 lg:w-[400px]">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
                dragFree: true,
              }}
            >
              {product && product.images.length > 0 ? (
                <CarouselContent>
                  {product.images.map((image) => (
                    <CarouselItem key={image.image_id}>
                      <div className="relative aspect-square w-full">
                        <Image
                          className="rounded-lg border-[1px] border-n100 object-contain shadow-sm"
                          src={image.image_data}
                          alt={`Image ${count + 1} of ${product.product_title}`}
                          layout="fill"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              ) : (
                <div>No images available</div>
              )}
              {count > 1 && (
                <div className="py-2 text-center text-sm text-neutral-200">
                  Image {current} of {count}
                </div>
              )}
              {count > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
          </div>

          <div className="flex w-full flex-col justify-between lg:w-[500px]">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="mb-2 text-xl text-b900 sm:mb-0 sm:text-2xl">
                {product.product_title}
              </h2>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="cursor-pointer">
                    <IoShareSocialOutline size={25} className="text-b900" />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex flex-row items-center gap-3">
                    <p>Share this product</p>

                    <CopyToClipboard text={`${currentUrl}`}>
                      <button>
                        <MdContentCopy size={15} />
                      </button>
                    </CopyToClipboard>
                  </div>

                  <p className="mt-2 break-all text-sm">{currentUrl}</p>
                </HoverCardContent>
              </HoverCard>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:space-x-5">
              <div className="mb-2 flex items-center sm:mb-0">
                <FaStar size={20} className="mr-1 text-yellow-500" />
                <span>{Number(product.product_rating).toFixed(2)}</span>
              </div>
              <div className="flex-shrink-0">
                <StockBadge
                  status={getAvailabilityStatus(
                    product.product_stock,
                    product.product_minimum,
                  )}
                />
              </div>
            </div>

            <div className="mb-4 text-lg font-semibold">
              ${product.product_price}
            </div>

            {(product.category_name === "mens-shirts" ||
              product.category_name === "womens-dresses" ||
              product.category_name === "tops") && (
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
                {quantity < product.product_minimum ? (
                  <p className="mt-2 text-xs text-red-500 sm:mt-0">
                    Minimum order quantity is {product.product_minimum}**
                  </p>
                ) : (
                  product.product_stock < product.product_minimum && (
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
                            {product.product_stock}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                )}
              </div>
              {product.product_minimum > 1 && (
                <span
                  className="mt-2 inline-block cursor-pointer text-xs hover:underline"
                  onClick={() => setQuantity(product.product_minimum)}
                >
                  Set to minimum
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <Button
                className="mb-4 flex w-full items-center justify-center space-x-2 bg-b900 transition-colors duration-300 ease-in-out disabled:bg-red-900 sm:mb-0 sm:w-auto"
                disabled={
                  product.product_stock < product.product_minimum ||
                  quantity < product.product_minimum ||
                  getAvailabilityStatus(
                    product.product_stock,
                    product.product_minimum,
                  ) === "Out of Stock"
                }
                onClick={handleAddToCart}
              >
                <span>Add to cart</span>
                <CiShoppingCart size={25} />
              </Button>
              <WishlistButton productId={product.product_id} />
            </div>
          </div>
        </div>
        <DetailsReview
          productId={product.product_id}
          details={product.product_description}
          rating={product.product_rating}
          brand={product.product_brand}
          weight={product.product_weight}
          height={product.dimension[0].height}
          width={product.dimension[0].width}
          depth={product.dimension[0].depth}
          warranty={product.product_warranty}
          shipping={product.product_shipping}
          returnPolicy={product.product_return}
          minimum={product.product_minimum}
          reviews={product.review}
          onReviewSubmit={handleReviewSubmit}
        />
        <div className="mb-20">
          <div className="mb-6 sm:mb-10">
            <h2 className="mb-2 text-xl font-bold text-b900 sm:text-2xl">
              You might also like
            </h2>
            <h4 className="text-sm text-n300">SIMILAR PRODUCTS</h4>
          </div>
          <SimilarProducts
            category={product.category_name}
            excludeId={product.product_id}
          />
        </div>
      </div>
      <Newsletter />
      <Footer className="" />
    </main>
  );
}
