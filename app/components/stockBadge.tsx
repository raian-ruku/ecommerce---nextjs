// components/stockBadge.tsx
import { Badge } from "@/components/ui/badge";

type StockBadgeProps = {
  status: "In Stock" | "Out of Stock";
};

const StockBadge = ({ status }: StockBadgeProps) => {
  const isInStock = status === "In Stock";

  return (
    <Badge variant={isInStock ? "outline" : "destructive"} className="">
      {status.toUpperCase()}
    </Badge>
  );
};

export default StockBadge;
