import { Badge } from "@/components/ui/badge";

type StockBadgeProps = {
  status: "In Stock" | "Out of Stock" | "Low Stock";
};

const StockBadge = ({ status }: StockBadgeProps) => {
  const badgeClassNames = {
    "In Stock": "bg-green-500 text-white",
    "Low Stock": "bg-yellow-500 text-white",
    "Out of Stock": "bg-red-500 text-white",
  };

  const currentClass = badgeClassNames[status] || "bg-gray-500 text-white";
  return (
    <Badge className={`uppercase ${currentClass} pointer-events-none`}>
      {status}
    </Badge>
  );
};

export default StockBadge;
