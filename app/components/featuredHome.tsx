import React from "react";

import StockBadge from "./stockBadge";

type Tshirts = {
  id: number;
  name: string;
};

const FeaturedHome = ({ className }: { className?: string }) => {
  const tshirts: Tshirts[] = [
    { id: 1, name: "Featured Collection 1" },
    { id: 2, name: "Featured Collection 2" },
    { id: 3, name: "Featured Collection 3" },
    { id: 4, name: "Featured Collection 4" },
  ];

  return (
    <div
      className={`flex w-full flex-row justify-between gap-x-6 ${className}`}
    >
      {tshirts.map((tshirt) => {
        let price = (Math.random() * 70 + 30).toFixed(2);

        return (
          <div className="flex flex-col gap-y-5" key={tshirt.id}>
            <div className="bg-n100 h-80 w-64"></div>
            <div className="text-b900">{tshirt.name}</div>
            <div className="flex w-auto items-center gap-4">
              <StockBadge />${price}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeaturedHome;
