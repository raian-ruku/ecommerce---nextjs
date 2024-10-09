import React from "react";
import { SalesChart } from "./salesChart";
import { OrdersChart } from "./ordersChart";
import { MostOrdered } from "./mostOrdered";
import PendingCard from "./pendingCard";

const DashboardPage = () => {
  return (
    <div className="flex h-screen w-full flex-col gap-3">
      <PendingCard />
      <div className="grid grid-cols-2 gap-3">
        <SalesChart />
        <OrdersChart />
      </div>
      <MostOrdered />
    </div>
  );
};

export default DashboardPage;
