// components/stockBadge.tsx
import { Badge } from "@/components/ui/badge";

type StockBadgeProps = {
  status: "In Stock" | "Out of Stock";
};

const StockBadge = ({ status }: StockBadgeProps) => {
  const isInStock = status === "In Stock";
  const displayStatus = status ? status.toUpperCase() : "UNKNOWN";

  return (
    <Badge variant={isInStock ? "outline" : "destructive"} className="">
      {displayStatus}
    </Badge>
  );
};

export default StockBadge;
