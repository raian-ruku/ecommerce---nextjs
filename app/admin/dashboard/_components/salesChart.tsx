"use client";

import * as React from "react";
import { Bar, BarChart, XAxis, LabelList } from "recharts";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive bar chart showing daily sales";

interface Order {
  order_id: number;
  order_date: string;
  total_price: string; // Changed to string as it might come as a string from the API
}

interface ApiResponse {
  success: boolean;
  data: Order[];
}

interface ChartDataPoint {
  date: string;
  sales: number;
}

const chartConfig = {
  views: {
    label: "Sales",
  },
  sales: {
    label: "",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function SalesChart() {
  const [chartData, setChartData] = React.useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [totalSales, setTotalSales] = React.useState(0);

  React.useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/admin/order-sales`,
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

        const dailySales = eachDayOfInterval({
          start: monthStart,
          end: monthEnd,
        }).reduce(
          (acc, date) => {
            acc[format(date, "yyyy-MM-dd")] = 0;
            return acc;
          },
          {} as Record<string, number>,
        );

        let totalSalesSum = 0;
        orders.forEach((order) => {
          const orderDate = format(parseISO(order.order_date), "yyyy-MM-dd");
          const orderTotal = parseFloat(order.total_price);
          if (!isNaN(orderTotal) && orderDate in dailySales) {
            dailySales[orderDate] += orderTotal;
            totalSalesSum += orderTotal;
          }
        });

        const formattedData: ChartDataPoint[] = Object.entries(dailySales).map(
          ([date, sales]) => ({
            date,
            sales: Number(sales.toFixed(2)), // Ensure sales is a number with 2 decimal places
          }),
        );

        setChartData(formattedData);
        setTotalSales(Number(totalSalesSum.toFixed(2))); // Ensure totalSales is a number with 2 decimal places
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-5 sm:py-6">
          <CardTitle>Total Sales</CardTitle>
          <CardDescription>This month</CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t text-left even:border-l data-[active=true]:bg-muted/50">
            <span className="text-xs text-muted-foreground">
              {chartConfig.sales.label}
            </span>
            <span className="px-5 text-lg font-bold leading-none sm:text-3xl">
              {formatCurrency(totalSales)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[150px] w-full pt-3"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="sales"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  formatter={(value) => formatCurrency(Number(value))}
                />
              }
            />
            <Bar
              dataKey="sales"
              fill={`var(--color-sales)`}
              className="transition-colors duration-100 ease-in-out hover:fill-green-500"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
