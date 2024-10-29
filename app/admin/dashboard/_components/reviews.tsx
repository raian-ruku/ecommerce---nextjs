"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CiSearch } from "react-icons/ci";
import { Input } from "@nextui-org/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "sonner";

interface Review {
  review_id: number;
  reviewer: string;
  product: string;
  review: string;
  review_rating: number;
  creation_date: string;
}

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/reviews?page=${currentPage}&limit=10&search=${search}`,
      );
      const data = await response.json();
      if (data.success) {
        setReviews(data.data);
        setTotalPages(data.totalPages);
      } else {
        toast.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("An error occurred while fetching reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage, search]);

  const handleDelete = async (reviewId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/reviews/${reviewId}`,
        {
          method: "DELETE",
        },
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Review deleted successfully");
        fetchReviews();
      } else {
        toast.error("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("An error occurred while deleting the review");
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <main className="flex h-screen w-full flex-col p-6">
      <div className="mb-6 flex h-fit w-full flex-row justify-between">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <Input
          startContent={<CiSearch size={30} className="pr-2" />}
          className="h-full w-64 rounded-md"
          placeholder="Search reviews"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SL.</TableHead>
            <TableHead>Reviewer</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Review</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : reviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No reviews found
              </TableCell>
            </TableRow>
          ) : (
            reviews.map((review, index) => (
              <TableRow key={review.review_id}>
                <TableCell className="text-right">
                  {(currentPage - 1) * 10 + index + 1}
                </TableCell>
                <TableCell>{review.reviewer}</TableCell>
                <TableCell>{review.product}</TableCell>
                <TableCell>{review.review}</TableCell>
                <TableCell className="text-right">
                  {review.review_rating}
                </TableCell>
                <TableCell>
                  {new Date(review.creation_date).toLocaleTimeString("en-BD")}{" "}
                  {new Date(review.creation_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        <MdDeleteForever size={20} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete the review.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(review.review_id)}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handlePageChange(currentPage - 1);
              }}
              className={`cursor-pointer select-none border-none hover:bg-transparent ${
                currentPage > 1
                  ? "hover:text-blue-700"
                  : "text-n300 hover:text-red-100"
              }`}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pageNumber);
                    }}
                    isActive={pageNumber === currentPage}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            } else if (
              pageNumber === currentPage - 2 ||
              pageNumber === currentPage + 2
            ) {
              return <PaginationEllipsis key={pageNumber} />;
            }
            return null;
          })}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) handlePageChange(currentPage + 1);
              }}
              className={`cursor-pointer select-none border-none hover:bg-transparent ${
                currentPage < totalPages
                  ? "hover:text-blue-700"
                  : "text-n300 hover:text-red-100"
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
};

export default ReviewsPage;
