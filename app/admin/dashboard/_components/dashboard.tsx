import React from "react";
import { SalesChart } from "./salesChart";
import { CustomerChart } from "./customerChart";
import { OrdersChart } from "./ordersChart";

const DashboardPage = () => {
  return (
    <div className="h-screen w-full">
      <div className="grid h-96 grid-cols-3 gap-3">
        <SalesChart />
        <CustomerChart />
        <OrdersChart />
      </div>
    </div>
  );
};

export default DashboardPage;
