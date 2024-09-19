import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationComponentProps) {
  const maxVisiblePages = 5;
  const halfVisiblePages = Math.floor(maxVisiblePages / 2);

  let startPage = Math.max(currentPage - halfVisiblePages, 1);
  let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(endPage - maxVisiblePages + 1, 1);
  }

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <Pagination className="my-4 flex justify-center gap-1">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={`cursor-pointer select-none border-none hover:bg-transparent ${
              currentPage > 1
                ? "hover:text-blue-700"
                : "text-n300 hover:text-red-100"
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
          />
        </PaginationItem>
        {startPage > 1 && (
          <>
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(1);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>
            {startPage > 2 && <PaginationEllipsis />}
          </>
        )}
        {pageNumbers.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(pageNumber);
              }}
              className={
                pageNumber === currentPage
                  ? "cursor-pointer select-none rounded-md bg-neutral-200 p-1 text-b900"
                  : "cursor-pointer select-none text-n300/50"
              }
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(totalPages);
                }}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext
            className={`cursor-pointer select-none border-none hover:bg-transparent ${
              currentPage < totalPages
                ? "hover:text-blue-700"
                : "text-n300 hover:text-red-100"
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
