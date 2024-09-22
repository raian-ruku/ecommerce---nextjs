import StockBadge from "./stockBadge";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

type Products = {
  product_id: number;
  product_title: string;
  product_price: number;
  product_thumbnail: string;
  product_brand: string;
  product_availability: number;
};

const BestSeller = async ({ className }: { className?: string }) => {
  const response = await fetch(
    "http://localhost:8000/api/v1/bestseller?limit=10",
  );
  const data = await response.json();
  const products: Products[] = data.data;

  const getAvailabilityStatus = (product_availability: number) => {
    if (product_availability === 0) return "Out of Stock";
    if (product_availability === 1) return "In Stock";
    if (product_availability === 2) return "Low Stock";
    return "Unknown"; // Add a default case to handle undefined values
  };

  return (
    <Carousel
      opts={{ align: "start", loop: true, skipSnaps: true, dragFree: true }}
    >
      <div
        className={`flex w-container flex-row justify-between gap-x-6 ${className}`}
      >
        <CarouselContent className="w-container">
          {products.map((product) => {
            return (
              <CarouselItem key={product.product_id} className="basis-1/4">
                <div className="flex flex-col gap-y-5">
                  <Image
                    className="h-[256px] w-[256px] justify-self-center"
                    src={product.product_thumbnail}
                    alt={product.product_title}
                    unoptimized
                    height={256}
                    width={256}
                  />
                  <Link href={`/products/${product.product_id}`}>
                    <div className="h-[100px] w-[256px] text-b900">
                      {product.product_title}
                    </div>
                  </Link>
                  <div className="h-[30px] text-b900">
                    {product.product_brand}
                  </div>
                  <div className="flex w-auto items-center gap-4">
                    <StockBadge
                      status={getAvailabilityStatus(
                        product.product_availability,
                      )}
                    />
                    ${product.product_price}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
};

export default BestSeller;
