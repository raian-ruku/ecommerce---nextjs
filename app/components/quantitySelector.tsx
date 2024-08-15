"use client";

import { useState } from "react";

const QuantitySelector = () => {
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="flex flex-col">
      <div className="flex w-32 items-center justify-between rounded-md border-2 border-neutral-300">
        <button
          className="px-3 py-1 text-neutral-500"
          onClick={handleDecrement}
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
