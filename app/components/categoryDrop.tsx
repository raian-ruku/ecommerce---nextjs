import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LiaAngleDownSolid } from "react-icons/lia";
import Link from "next/link";

const CategoryDrop = async () => {
  const response = await fetch("https://dummyjson.com/products/category-list");
  const categories = await response.json();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="link"
          className="text-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          Categories <LiaAngleDownSolid className="pl-2" size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="grid grid-cols-3 capitalize">
        {categories.map((cat: string) => (
          <Link href={`/products/category/${cat}`} key={cat}>
            <DropdownMenuItem className="cursor-pointer text-sm text-n300">
              {cat}
            </DropdownMenuItem>
          </Link>
        ))}
        <Link href="/products">
          <DropdownMenuItem className="text-sm text-n300">
            Show All Products
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoryDrop;
