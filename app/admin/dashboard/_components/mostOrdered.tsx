"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

export const description = "A donut chart showing top ordered products";

interface ProductData {
  product_name: string;
  order_count: number;
  total_price: number;
  revenue: number;
}

const COLORS = [
  "hsl(var(--chart-2))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-1))",
];

const chartConfig = {
  order_count: {
    label: "Orders",
  },
} satisfies ChartConfig;

export function MostOrdered() {
  const [chartData, setChartData] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/admin/top-orders`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch top products");
        }
        const data = await response.json();
        setChartData(data.data);
      } catch (err) {
        console.error("Error fetching top products:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const totalOrders = chartData.reduce(
    (sum, product) => sum + product.order_count,
    0,
  );
  const totalRevenue = chartData.reduce(
    (sum, product) => sum + Number(product.revenue),
    0,
  );

  return (
    <Card className="flex w-full flex-col">
      <CardHeader className="pb-0">
        <CardTitle>Top Ordered Products</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 pb-0">
        <div className="w-1/2">
          <ChartContainer
            config={chartConfig}
            className="aspect-square h-[300px]"
          >
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded bg-white p-2 shadow">
                        <p className="font-bold">{data.product_name}</p>
                        <p>Orders: {data.order_count}</p>
                        <p>Total Price: ${data.total_price}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={chartData}
                dataKey="order_count"
                nameKey="product_name"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index} `}
                    fill={COLORS[index % COLORS.length]}
                    className="transition-colors duration-500 ease-in-out hover:fill-green-500"
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
        <div className="flex w-1/2 flex-col justify-center pl-4">
          {chartData.map((product, index) => (
            <div key={index} className="mb-2 flex items-center">
              <div
                className="mr-2 h-4 w-4"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="flex-1">{product.product_name}</span>
              <span className="mr-2 w-20 text-left font-bold">
                {product.order_count > 1 ? (
                  <p>{product.order_count} orders</p>
                ) : (
                  <p>{product.order_count} order</p>
                )}
              </span>
              <span className="w-20 text-justify font-bold">
                ${product.total_price}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total Orders: {totalOrders} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total Revenue: ${totalRevenue.toFixed(2)}
        </div>
      </CardFooter>
    </Card>
  );
}
