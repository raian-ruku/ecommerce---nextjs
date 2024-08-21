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
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  availabilityStatus: "In Stock" | "Out of Stock";
};

const BestSeller = async ({ className }: { className?: string }) => {
  const response = await fetch(
    "https://dummyjson.com/products?limit=10&sortBy=rating&order=desc",
  );
  const data = await response.json();
  const products: Products[] = data.products;

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
              <CarouselItem key={product.id} className="basis-1/4">
                <div className="flex flex-col gap-y-5">
                  <Image
                    className="h-[256px] w-[256px] justify-self-center"
                    src={product.thumbnail}
                    alt={product.title}
                    unoptimized
                    height={256}
                    width={256}
                  />
                  <Link href={`/products/${product.id}`}>
                    <div className="h-[100px] w-[256px] text-b900">
                      {product.title}
                    </div>
                  </Link>
                  <div className="flex w-auto items-center gap-4">
                    <StockBadge status={product.availabilityStatus} />$
                    {product.price}
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
