"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductsPage from "./products";

interface OrderItem {
  product_id: number;
  price: number;
  product_title: string;
  product_thumbnail: string;
}

interface Order {
  order_date: string;
  order_status: number;
  order_id: number;
  shipping_street: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_country: string;
  items: OrderItem[];
}

const PendingCard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/admin/pending-orders`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch pending orders");
        }
        const data = await response.json();

        // Group items by order_id
        const groupedOrders = data.data.reduce(
          (acc: Record<number, Order>, item: any) => {
            if (!acc[item.order_id]) {
              acc[item.order_id] = {
                ...item,
                items: [],
              };
            }
            acc[item.order_id].items.push({
              product_id: item.product_id,
              price: item.price,
              product_title: item.product_title,
              product_thumbnail: item.product_thumbnail,
            });
            return acc;
          },
          {},
        );

        setOrders(Object.values(groupedOrders));
      } catch (err) {
        console.error("Error fetching pending orders:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingOrders();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return (
          <Badge
            className="border-yellow-500 text-yellow-500"
            variant="outline"
          >
            Pending
          </Badge>
        );
      case 1:
        return (
          <Badge
            className="border-orange-500 text-orange-500"
            variant="outline"
          >
            Processing
          </Badge>
        );

      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card className="h-[400px] w-full">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>
          Pending and Processing Orders{" "}
          <Link href="/admin/dashboard/orders" target="_blank">
            <Button className="" variant="link">
              View All
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="items-center bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Order Number
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Shipping Address
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Items
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {order.order_id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(order.order_date).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {getStatusBadge(order.order_status)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {order.shipping_street}, {order.shipping_city},{" "}
                    {order.shipping_state} {order.shipping_zip},{" "}
                    {order.shipping_country}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap space-x-2 overflow-x-auto">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Image
                            src={item.product_thumbnail}
                            alt={item.product_title}
                            width={50}
                            height={50}
                            className="rounded-md"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.product_title}</p>
                            <p className="text-sm text-muted-foreground">
                              ${item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PendingCard;
