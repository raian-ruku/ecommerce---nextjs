"use client";

import { useState } from "react";

type QuantitySelectorProps = {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  minQuantity?: number;
};

const QuantitySelector = ({
  quantity,
  onQuantityChange,
  minQuantity,
}: QuantitySelectorProps) => {
  const handleDecrement = () => {
    if (quantity > (minQuantity ?? 0)) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    onQuantityChange(quantity + 1);
  };

  return (
    <div className="flex flex-col">
      <div className="flex w-32 items-center justify-between rounded-md border-2 border-neutral-300 ">
        <button
          className="px-3 py-1 text-neutral-500 disabled:text-red-500"
          onClick={handleDecrement}
          disabled={quantity <= (minQuantity ?? 0)}
        >
          -
        </button>
        <span className="text-black">{quantity}</span>
        <button
          className="px-3 py-1 text-neutral-500"
          onClick={handleIncrement}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
