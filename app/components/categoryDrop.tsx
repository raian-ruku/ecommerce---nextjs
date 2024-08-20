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

const CategoryDrop = async () => {
  const response = await fetch("https://fakestoreapi.com/products/categories");
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
      <DropdownMenuContent>
        {categories.map((cat: string) => (
          <DropdownMenuItem key={cat} className="text-sm text-n300">
            {cat}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoryDrop;