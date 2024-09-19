import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LiaAngleDownSolid } from "react-icons/lia";
import Link from "next/link";

interface Categories {
  category_id: number;
  category_name: string;
}

const CategoryDrop = async () => {
  const response = await fetch("http://localhost:8000/api/v1/category-list");
  const data = await response.json();
  const categories: Categories[] = data.data;

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
      <DropdownMenuContent className="grid grid-cols-2 gap-2 p-4 capitalize sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        {categories.map((cat) => (
          <Link href={`/${cat.category_name}`} key={cat.category_id} passHref>
            <DropdownMenuItem className="cursor-pointer text-sm text-n300 hover:bg-gray-100">
              {cat.category_name}
            </DropdownMenuItem>
          </Link>
        ))}
        <Link href="/products" passHref>
          <DropdownMenuItem className="text-sm text-n300 hover:bg-gray-100">
            Show All Products
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoryDrop;
