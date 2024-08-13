import StockBadge from "./stockBadge";

type Tshirts = {
  id: number;
  name: string;
};

const BestSeller = ({ className }: { className?: string }) => {
  const tshirts: Tshirts[] = [
    { id: 1, name: "Classic Monochrome Tees" },
    { id: 2, name: "Monochromatic Wardrobe" },
    { id: 3, name: "Essential Neutrals" },
    { id: 4, name: "UTRAANET Black" },
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

export default BestSeller;
