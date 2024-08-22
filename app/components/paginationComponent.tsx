import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const PaginationComponent: React.FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };
  const isPreviousActive = currentPage > 1;
  const isNextActive = currentPage < totalPages;

  return (
    <Pagination className="my-4 flex justify-center gap-1">
      <PaginationPrevious
        className={`cursor-pointer select-none border-none hover:bg-transparent ${isPreviousActive ? "hover:text-blue-700" : "text-n300 hover:text-red-100"}`}
        onClick={() => handlePageChange(currentPage - 1)}
      ></PaginationPrevious>
      <PaginationContent>
        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationItem
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={
              i + 1 === currentPage
                ? "cursor-pointer select-none rounded-md bg-neutral-200 p-1 text-b900"
                : "cursor-pointer select-none text-n300/50"
            }
          >
            {i + 1}
          </PaginationItem>
        ))}
      </PaginationContent>
      <PaginationNext
        className={`cursor-pointer select-none border-none hover:bg-transparent ${isNextActive ? "hover:text-blue-700" : "text-n300 hover:text-red-100"}`}
        onClick={() => handlePageChange(currentPage + 1)}
        isActive={isNextActive}
      ></PaginationNext>
    </Pagination>
  );
};

export default PaginationComponent;
