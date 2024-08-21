"use client";

import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const SideBar = () => {
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://dummyjson.com/products/category-list",
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const [price, setPrice] = useState(100);

  const handlePriceChange = (value: number[]) => {
    setPrice(value[0]); // Update the state with the new slider value
  };

  function capitalizeFirstLetter(string: string) {
    return string[0].toUpperCase() + string.slice(1);
  }

  return (
    <div>
      <div className="rounded-lg border-[1px] p-4 shadow-md">
        {/* Categories */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Categories</h2>
          <div className="mt-4 flex flex-col gap-3">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox id={category} />
                <Label htmlFor={category} className="text-sm font-medium">
                  {capitalizeFirstLetter(category)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Price</h2>
          <Slider
            defaultValue={[price]}
            max={1000}
            step={1}
            onValueChange={handlePriceChange}
            className="mt-4"
          />

          <div className="mt-2 text-center">
            <span className="text-sm font-semibold text-b900">${price}.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
