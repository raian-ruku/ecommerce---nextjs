"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const SideBar = () => {
  const categories = [
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing",
  ];
  const [price, setPrice] = useState(100);

  const handlePriceChange = (value: number[]) => {
    setPrice(value[0]); // Update the state with the new slider value
  };

  return (
    <div>
      <div className="rounded-lg border p-4 shadow-md">
        {/* Categories */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Categories</h2>
          <div className="mt-4 flex flex-col gap-3">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox id={category} />
                <Label htmlFor={category} className="text-sm font-medium">
                  {category}
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
