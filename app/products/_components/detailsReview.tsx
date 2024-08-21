"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@nextui-org/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import { LiaAngleDownSolid } from "react-icons/lia";
import { MdOutlineReviews } from "react-icons/md";
import { FaStar } from "react-icons/fa";

const DetailsReview = ({
  details,
  rating,
  brand,
  weight,
  height,
  width,
  depth,
  warranty,
  shipping,
  returnPolicy,
  minimum,
}: {
  details: string;
  rating: number;
  brand: string;
  weight: number;
  height: number;
  width: number;
  depth: number;
  warranty: string;
  shipping: string;
  returnPolicy: string;
  minimum: number;
}) => {
  const [selectedTab, setSelectedTab] = useState("details");
  return (
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
          <TabsContent
            value="details"
            className="flex flex-col gap-y-4 text-justify"
          >
            <h2 className="text-2xl font-semibold">Details</h2>
            <p className="font-bold">{details}</p>
            <p>Brand: {brand}</p>
            <p>Weight: {weight}</p>
            <p>Height: {height}</p>
            <p>Width: {width}</p>
            <p>Depth: {depth}</p>
            <p>Warranty Policy: {warranty}</p>
            <p>Return Policy: {returnPolicy}</p>
            <p>Minimum order quantity: {minimum}</p>
            <p>Shipping Information: {shipping}</p>
          </TabsContent>
          <TabsContent value="reviews" className="flex w-auto flex-col gap-4">
            <h2 className="text-2xl font-semibold">Reviews</h2>
            <div className="flex gap-3">
              <FaStar size={20} className="text-yellow-500" /> {rating}{" "}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="border-[1px] border-b900 bg-transparent text-b900 hover:bg-transparent hover:text-b900">
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
                <Textarea
                  name="review"
                  className="rounded-md border-[1px] border-neutral-200"
                />
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
  );
};

export default DetailsReview;
