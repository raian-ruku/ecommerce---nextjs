// import GetProductbyID from "@/app/backend/getProductbyID";
"use client";
import Image from "next/image";

import { IoShareSocialOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { CiShoppingCart } from "react-icons/ci";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import StockBadge from "@/app/components/stockBadge";
import { useState } from "react";
import QuantitySelector from "@/app/components/quantitySelector";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineReviews } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LiaAngleDownSolid } from "react-icons/lia";
import BestSeller from "@/app/components/bestSeller";
import LatestHome from "@/app/components/latestHome";
import { Footer } from "@/app/components/footer";
import { Newsletter } from "@/app/components/newsletter";

interface ProductDetails {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

type Size = {
  id: number;
  size: string;
};

const ProductbyID = () => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedTab, setSelectedTab] = useState("details");
  //   const response = await fetch(`https://fakestoreapi.com/products/1`);
  //   const product: ProductDetails = await response.json();
  const sizes: Size[] = [
    { id: 1, size: "S" },
    { id: 2, size: "M" },
    { id: 3, size: "L" },
    { id: 4, size: "XL" },
    { id: 5, size: "XXL" },
  ];

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
        <div className="flex w-full justify-between pb-20 pt-4">
          <div className="h-[500px] w-[400px] bg-n300"></div>
          <div className="flex w-[500px] flex-col justify-between">
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-xl text-b900">Tshirt Name</h2>{" "}
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
              <div className="flex flex-row items-center">
                <FaStar size={20} className="text-yellow-500" /> rating
              </div>
              <StockBadge />
            </div>
            <div>Price</div>
            <div className="flex flex-col gap-3">
              SELECT SIZE
              <div className="flex flex-row items-center gap-x-2">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    className={`flex h-10 w-10 items-center justify-center gap-x-4 rounded-md border-[1px] ${
                      selectedSize === size.size
                        ? "border-b900 text-b900"
                        : "border-n300 text-n300"
                    }`}
                    onClick={() => setSelectedSize(size.size)}
                  >
                    {size.size}
                  </button>
                ))}
              </div>
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
        <div className="my-20 flex h-[700px] w-full items-center">
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="flex"
            orientation="vertical"
          >
            <TabsList className="flex min-w-80 flex-col bg-transparent pt-20">
              <TabsTrigger
                value="details"
                className="flex-row items-center gap-2 text-[16px] data-[state=active]:w-full data-[state=inactive]:w-full data-[state=active]:bg-n100"
              >
                <BsThreeDots />
                Details
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="flex-row items-center gap-2 text-left text-[16px] data-[state=active]:w-full data-[state=inactive]:w-full data-[state=active]:bg-n100"
              >
                <MdOutlineReviews />
                Reviews
              </TabsTrigger>
            </TabsList>
            <div className="flex-grow pl-5">
              <TabsContent value="details" className="flex flex-col gap-y-4">
                <h2 className="text-2xl font-semibold">Details</h2>
                <p>
                  Elevate your everyday style with our Mens Black T-Shirts, the
                  ultimate wardrobe essential for modern men. Crafted with
                  meticulous attention to detail and designed for comfort, these
                  versatile black tees are a must-have addition to your
                  collection. The classic black color never goes out of style.
                  Whether youre dressing up for a special occasion or keeping it
                  casual, these black t-shirts are the perfect choice,
                  effortlessly complementing any outfit.
                </p>
              </TabsContent>
              <TabsContent value="reviews" className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold">Reviews</h2>
                <p>Rating</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="texrder-b900 hover:bg-p border-[1px] border-b900 bg-transparent text-b900">
                      Write a review
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="h-[500px] w-[400px]">
                    <DialogHeader>
                      <DialogTitle>Write Review </DialogTitle>
                      <hr />
                    </DialogHeader>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" name="email" />
                    <Label htmlFor="name">Full Name</Label>
                    <Input name="name" />
                    <Label htmlFor="review">Review</Label>
                    <Textarea name="review" />
                    <DialogFooter>
                      <Button className="w-full bg-b900" type="submit">
                        Submit Your Review
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <div className="w-full justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center">
                        Sort By
                        <LiaAngleDownSolid className="pl-2" size={20} />
                      </div>
                    </DropdownMenuTrigger>
                  </DropdownMenu>
                  <hr />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
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
