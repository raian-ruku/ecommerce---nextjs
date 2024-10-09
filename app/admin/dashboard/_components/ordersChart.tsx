"use client";

import * as React from "react";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export const description =
  "A progress bar showing total orders and progress towards 1000 orders";

interface Order {
  order_id: number;
  order_date: string;
  monthly_goal: string;
}

interface ApiResponse {
  success: boolean;
  data: Order[];
}

export function OrdersChart() {
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlyGoal, setMonthlyGoal] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/admin/order-dates`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const result: ApiResponse = await response.json();
        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Invalid data received from API");
        }

        const orders = result.data;

        // Process orders data
        const now = new Date();
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);

        const totalOrdersThisMonth = orders.filter((order) => {
          const orderDate = parseISO(order.order_date);
          return orderDate >= monthStart && orderDate <= monthEnd;
        }).length;

        setTotalOrders(totalOrdersThisMonth);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchMonthlyGoal = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/admin/monthly_goal`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch monthly goal");
        }
        const result = await response.json();
        if (!result.success || !result.data) {
          throw new Error("Invalid data received from API");
        }

        setMonthlyGoal(parseInt(result.data[0].monthly_goal, 10));
      } catch (err) {
        console.error("Error fetching monthly goal:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };
    console.log(monthlyGoal);
    fetchMonthlyGoal();
  });

  const progressPercentage = Math.min((totalOrders / monthlyGoal) * 100, 100);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card className="h-fit w-full max-w-full">
      <CardHeader>
        <CardTitle>Monthly Orders Progress</CardTitle>
        <CardDescription>
          Progress towards {monthlyGoal} orders this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={progressPercentage} className="h-4" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{totalOrders} orders</span>
            <span>{progressPercentage.toFixed(1)}%</span>
          </div>
          <p className="text-center text-lg font-semibold">
            {totalOrders} / {monthlyGoal} orders
          </p>
          {totalOrders >= monthlyGoal ? (
            <p className="text-center font-semibold text-green-600">
              Goal reached! Congratulations!
            </p>
          ) : (
            <p className="pb-[13px] text-center text-muted-foreground">
              {monthlyGoal - totalOrders} more orders to reach the goal
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
