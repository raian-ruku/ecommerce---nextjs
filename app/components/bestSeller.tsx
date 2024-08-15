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

type Tshirts = {
  id: number;
  title: string;
  price: number;
  image: string;
};

const BestSeller = async ({ className }: { className?: string }) => {
  const response = await fetch("https://fakestoreapi.com/products?limit=10");
  const tshirts: Tshirts[] = await response.json();
  return (
    <Carousel opts={{ align: "start", loop: true }}>
      <div
        className={`flex w-container flex-row justify-between gap-x-6 ${className}`}
      >
        <CarouselContent className="w-container">
          {tshirts.map((tshirt) => {
            return (
              <CarouselItem key={tshirt.id} className="basis-1/4">
                <div className="flex flex-col gap-y-5">
                  <Image
                    className="h-[256px] w-[256px] justify-self-center"
                    src={tshirt.image}
                    alt={tshirt.title}
                    unoptimized
                    height={256}
                    width={256}
                  />
                  <Link href={`/products/${tshirt.id}`}>
                    <div className="h-[100px] w-[256px] text-b900">
                      {tshirt.title}
                    </div>
                  </Link>
                  <div className="flex w-auto items-center gap-4">
                    <StockBadge />${tshirt.price}
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
