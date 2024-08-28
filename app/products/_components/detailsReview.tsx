
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

type Reviews = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

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
  reviews = [],
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
  reviews: Reviews[];
}) => {
  const [selectedTab, setSelectedTab] = useState("details");

  return (
    <div className="my-4 flex w-full flex-col items-start md:my-20 lg:flex-row lg:items-center">
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="flex w-full flex-col lg:w-auto lg:flex-row"
        orientation="vertical"
      >
        <TabsList className="flex flex-row bg-transparent pt-4 lg:min-w-80 lg:flex-col lg:bg-transparent lg:pt-20">
          <TabsTrigger
            value="details"
            className="flex items-center gap-2 text-[14px] data-[state=active]:w-full data-[state=inactive]:w-full data-[state=active]:bg-n100 md:text-[16px] lg:text-left"
          >
            <BsThreeDots />
            Details
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="flex items-center gap-2 text-[14px] data-[state=active]:w-full data-[state=inactive]:w-full data-[state=active]:bg-n100 md:text-[16px] lg:text-left"
          >
            <MdOutlineReviews />
            Reviews
          </TabsTrigger>
        </TabsList>
        <div className="flex-grow pl-4 lg:pl-5">
          <TabsContent
            value="details"
            className="flex flex-col gap-y-4 text-justify"
          >
            <h2 className="text-xl font-semibold md:text-2xl">Details</h2>
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
          <TabsContent value="reviews" className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold md:text-2xl">Reviews</h2>
            <div className="flex items-center gap-3">
              <FaStar size={20} className="text-yellow-500" /> {rating}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-auto border-[1px] border-b900 bg-transparent text-b900 hover:bg-transparent hover:text-b900">
                  Write a review
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 h-[400px] w-full max-w-md lg:mx-0">
                <DialogHeader>
                  <DialogTitle>Write Review</DialogTitle>
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

            <div className="mx-auto max-w-full p-4 md:max-w-2xl">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review.reviewerName}
                    className="mb-6 flex flex-col gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{review.reviewerName}</h4>
                        <div className="flex items-center gap-1">
                          <FaStar size={20} className="text-yellow-500" />
                          {review.rating}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <p className="text-sm text-gray-500">
                          {new Date(review.date).toDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          ({review.reviewerEmail})
                        </p>
                      </div>
                      <p className="mt-2 text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default DetailsReview;
