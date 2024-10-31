"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@nextui-org/input";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineReviews } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { toast } from "sonner";

type Reviews = {
  review_id: number;
  review_rating: number;
  review_comment: string;
  user_name?: string;
  creation_date: string;
};

interface DetailsReviewProps {
  productId: number;
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
  onReviewSubmit: () => void;
}

const DetailsReview: React.FC<DetailsReviewProps> = ({
  productId,
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
  reviews: initialReviews,
  onReviewSubmit,
}) => {
  const [selectedTab, setSelectedTab] = useState("details");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reviews, setReviews] = useState<Reviews[]>(initialReviews);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/check-auth`,
          {
            credentials: "include",
          },
        );
        const data = await response.json();
        setIsLoggedIn(data.isAuthenticated);
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please log in to submit a review");
      return;
    }

    if (!productId) {
      toast.error("Product ID is missing");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          product_id: productId,
          review_rating: newReview.rating,
          review_comment: newReview.comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const data = await response.json();
      setReviews([...reviews, data.review]);
      setNewReview({ rating: 0, comment: "" });
      setIsReviewDialogOpen(false);
      toast.success("Review submitted successfully");
      onReviewSubmit();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  const StarRating = ({
    rating,
    onRatingChange,
  }: {
    rating: number;
    onRatingChange: (rating: number) => void;
  }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`cursor-pointer ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
            onClick={() => onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

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
            <p>Brand: {brand ? brand : "Not mentioned"}</p>
            <p>Weight: {weight ? weight : "Not mentioned"}</p>
            <p>Height: {height ? height : "Not mentioned"}</p>
            <p>Width: {width ? width : "Not mentioned"}</p>

            <p>Depth: {depth ? depth : "Not mentioned"}</p>
            <p>Warranty Policy: {warranty ? warranty : "Not mentioned"}</p>
            <p>
              Return Policy: {returnPolicy ? returnPolicy : "Not mentioned"}
            </p>
            <p>Minimum order quantity: {minimum ? minimum : "Not mentioned"}</p>
            <p>Shipping Information: {shipping ? shipping : "Not mentioned"}</p>
          </TabsContent>
          <TabsContent value="reviews" className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold md:text-2xl">Reviews</h2>
            <div className="flex items-center gap-3">
              <FaStar size={20} className="text-yellow-500" />{" "}
              {Number(rating).toFixed(2)}
            </div>
            <Dialog
              open={isReviewDialogOpen}
              onOpenChange={setIsReviewDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  className="w-auto border-[1px] border-b900 bg-transparent text-b900 hover:bg-transparent hover:text-b900"
                  onClick={() => {
                    if (!isLoggedIn) {
                      toast.error("Please log in to write a review");
                    }
                  }}
                >
                  Write a review
                </Button>
              </DialogTrigger>
              {isLoggedIn && (
                <DialogContent className="mx-4 h-[400px] w-full max-w-md lg:mx-0">
                  <DialogHeader>
                    <DialogTitle>Write Review</DialogTitle>
                    <hr />
                  </DialogHeader>
                  <form
                    onSubmit={handleReviewSubmit}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="rating">Rating</Label>
                      <StarRating
                        rating={newReview.rating}
                        onRatingChange={(rating) =>
                          setNewReview({ ...newReview, rating })
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="review">Review</Label>
                      <Textarea
                        name="review"
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            comment: e.target.value,
                          })
                        }
                        className="h-auto resize-none rounded-md"
                      />
                    </div>
                    <DialogFooter>
                      <Button className="mt-5 w-full bg-b900" type="submit">
                        Submit Your Review
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              )}
            </Dialog>

            <div className="mx-auto max-w-full p-4 md:max-w-2xl">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review?.review_id}
                    className="mb-6 flex flex-col gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        {review?.user_name && (
                          <h4 className="font-semibold">{review.user_name}</h4>
                        )}
                        <div className="flex items-center justify-center gap-1">
                          <FaStar size={20} className="text-yellow-500" />
                          {review?.review_rating}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <p className="text-sm text-gray-500">
                          {new Date(review?.creation_date).toDateString()}
                        </p>
                      </div>
                      <p className="mt-2 text-gray-700">
                        {review?.review_comment}
                      </p>
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
