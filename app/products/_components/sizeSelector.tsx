"use client";

import React, { useState } from "react";

type Size = {
  id: number;
  size: string;
};

const SizeSelector = () => {
  const [selectedSize, setSelectedSize] = useState("");
  const sizes: Size[] = [
    { id: 1, size: "S" },
    { id: 2, size: "M" },
    { id: 3, size: "L" },
    { id: 4, size: "XL" },
    { id: 5, size: "XXL" },
  ];

  return (
    <div className="flex flex-row items-center gap-x-2">
      {sizes.map((size) => (
        <button
          key={size.id}
          className={`flex h-10 w-10 items-center justify-center gap-x-4 rounded-md border-[1px] ${
            selectedSize === size.size
              ? "border-b900 text-b900"
              : "border-n300 text-n300"
          }`}
          onClick={() => setSelectedSize(size.size)}
        >
          {size.size}
        </button>
      ))}
    </div>
  );
};

export default SizeSelector;
