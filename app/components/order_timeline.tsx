import React from "react";
import {
  CheckCircle2,
  CheckCircle,
  Circle,
  Clock,
  PackageCheck,
  Truck,
} from "lucide-react";

interface OrderStatusTimelineProps {
  currentStatus: number;
}

export default function OrderStatusTimeline(
  { currentStatus }: OrderStatusTimelineProps = { currentStatus: 0 },
) {
  const statuses = [
    { name: "Pending", icon: Clock, color: "text-yellow-500" },
    { name: "Processing", icon: PackageCheck, color: "text-orange-500" },
    { name: "Shipped", icon: Truck, color: "text-lime-500" },
    { name: "Completed", icon: CheckCircle, color: "text-green-500" },
  ];

  return (
    <div className="w-full p-4">
      <div className="flex justify-between">
        {statuses.map((status, index) => {
          const Icon = status.icon;
          const isActive = index <= currentStatus;
          const isCompleted = index < currentStatus;
          const isLast = index === statuses.length - 1;

          return (
            <div
              key={status.name}
              className="flex flex-1 flex-col items-center"
            >
              <div className="flex w-full items-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 py-3 transition duration-500 ease-in-out ${
                    isActive
                      ? `${status.color} border-${status.color.split("-").slice(1).join("-")}`
                      : ""
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className={`h-8 w-8 ${status.color}`} />
                  ) : (
                    <Icon
                      className={`h-8 w-8 ${isActive ? status.color : "text-gray-400"}`}
                    />
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`flex-auto border-t-2 transition duration-500 ease-in-out ${isCompleted ? `border-${status.color.split("-").slice(1).join("-")}` : "border-gray-300"}`}
                  />
                )}
              </div>
              <div
                className={`text-center ${isActive ? `${status.color} font-medium` : "text-gray-400"}`}
              >
                <span className="text-sm">{status.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
