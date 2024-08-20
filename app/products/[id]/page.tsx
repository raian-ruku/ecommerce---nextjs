// import GetProductbyID from "@/app/backend/getProductbyID";

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

type Props = {
  params: { id: number };
};

export async function generateMetadata({ params }: Props) {
  const id: number = params.id;
  const product: ProductDetails = await fetch(
    `https://fakestoreapi.com/products/${id}`,
  ).then((response) => response.json());
  return {
    title: product.title,
  };
}

interface Rating {
  rate: number;
  count: number;
}

interface ProductDetails {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  rating: Rating;
}

const ProductbyID = async ({ params }: { params: { id: number } }) => {
  const response = await fetch(
    `https://fakestoreapi.com/products/${params.id}`,
  );
  const product: ProductDetails = await response.json();

  return (
    <main className="flex w-full flex-col items-center justify-center">
      <div className="flex w-container flex-col justify-center pt-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Products</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>This Product</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="my-20 flex w-full justify-between">
          <Image
            className="h-[500px] w-[400px] bg-n300"
            src={product.image}
            alt={product.title}
            height={500}
            width={400}
          />
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
                {product.rating.rate}
              </div>
              <StockBadge />
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
        <DetailsReview
          details={product.description}
          rating={product.rating.rate}
          count={product.rating.count}
        />
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
