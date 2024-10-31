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
  product_minimum: number;
  product_stock: number;
};

const FeaturedHome = async ({ className }: { className?: string }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/latesthome`);
  const data = await response.json();
  const products: Products[] = data.data;

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
                        product.product_stock,
                        product.product_minimum,
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

export default FeaturedHome;
