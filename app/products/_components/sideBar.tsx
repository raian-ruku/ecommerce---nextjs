"use client";

import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { useRouter, useSearchParams } from "next/navigation";

interface Category {
  category_id: number;
  category_name: string;
}

interface SideBarProps {
  onFiltersChange: (category: string | null, price: [number, number]) => void;
}

export default function SideBar({ onFiltersChange }: SideBarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/category-list`,
        );
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();

    // Initialize filters from URL params
    const categoryParam = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (minPrice && maxPrice) {
      setPriceRange([Number(minPrice), Number(maxPrice)]);
    }
  }, [searchParams]);

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory((prevCategory) =>
      prevCategory === categoryName ? null : categoryName,
    );
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setPriceRange([value, Math.max(value, priceRange[1])]);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setPriceRange([Math.min(priceRange[0], value), value]);
  };

  const applyFilters = () => {
    onFiltersChange(selectedCategory, priceRange as [number, number]);
  };

  return (
    <div className="rounded-lg border-[1px] p-4 shadow-md">
      <div className="mb-6">
        <h2 className="mb-4 text-lg font-semibold">Categories</h2>
        <div className="flex flex-col gap-3">
          {categories.map((category) => (
            <div
              key={category.category_id}
              className="flex items-center space-x-2"
            >
              <Checkbox
                id={`category-${category.category_id}`}
                checked={selectedCategory === category.category_name}
                onCheckedChange={() =>
                  handleCategoryChange(category.category_name)
                }
              />
              <Label
                htmlFor={`category-${category.category_id}`}
                className="text-sm font-medium"
              >
                {category.category_name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-4 text-lg font-semibold">Price Range</h2>
        <div className="relative pb-6 pt-6">
          <SliderPrimitive.Root
            className="relative flex w-full touch-none select-none items-center"
            value={priceRange}
            max={1000}
            step={1}
            onValueChange={handlePriceChange}
          >
            <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-200">
              <SliderPrimitive.Range className="absolute h-full bg-slate-900" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-slate-900 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
            <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-slate-900 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
          </SliderPrimitive.Root>
          <div className="absolute left-0 top-0 -mt-6">
            <div className="relative">
              <div className="absolute left-0 top-full mt-2 -translate-x-1/2 transform">
                <div className="rounded-md bg-slate-900 px-2 py-1 text-xs text-white">
                  ${priceRange[0]}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 -mt-6">
            <div className="relative">
              <div className="absolute right-0 top-full mt-2 translate-x-1/2 transform">
                <div className="rounded-md bg-slate-900 px-2 py-1 text-xs text-white">
                  ${priceRange[1]}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium">$</span>
            <Input
              type="number"
              value={priceRange[0]}
              onChange={handleMinPriceChange}
              className="w-20 text-sm"
            />
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium">$</span>
            <Input
              type="number"
              value={priceRange[1]}
              onChange={handleMaxPriceChange}
              className="w-20 text-sm"
            />
          </div>
        </div>
      </div>

      <Button onClick={applyFilters} className="w-full bg-slate-900 text-white">
        Apply Filters
      </Button>
    </div>
  );
}
