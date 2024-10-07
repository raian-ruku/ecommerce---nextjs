"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrderItem {
  order_id: number;
  product_id: number;
  product_title: string;
  product_thumbnail: string;
  quantity: number;
  order_date: string;
  price: number;
  order_status: number;
  shipping_street: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_country: string;
  total_price: number;
  shipping_cost: number;
  tax: number;
}

const orderStatusMap: { [key: number]: string } = {
  0: "Pending",
  1: "Processing",
  2: "Shipped",
  3: "Delivered",
  4: "Cancelled",
};

export default function PlacedOrders() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/user/all-orders`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setOrderItems(data.data);
      } catch (error) {
        console.error("Error fetching order items:", error);
        toast.error("Failed to fetch order items");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderItems();
  }, []);

  if (isLoading) {
    return <div className="mt-8 text-center">Loading orders...</div>;
  }

  if (orderItems.length === 0) {
    return (
      <div className="mt-8 text-center">
        You haven&apos;t placed any orders yet.
      </div>
    );
  }

  // Group order items by order_id
  const groupedOrders = orderItems.reduce(
    (acc, item) => {
      if (!acc[item.order_id]) {
        acc[item.order_id] = [];
      }
      acc[item.order_id].push(item);
      return acc;
    },
    {} as { [key: number]: OrderItem[] },
  );

  const formatPrice = (price: number) => {
    return (Math.round(price * 100) / 100).toFixed(2);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="mb-6 text-2xl font-bold">Your Orders</h1>
      <div className="space-y-6">
        {Object.entries(groupedOrders).map(([orderId, items]) => {
          const orderTotal = items.reduce(
            (total, item) => Number(item.total_price) || 0,
            0,
          );
          return (
            <div key={orderId} className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex flex-col items-start justify-between sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-semibold">Order #{orderId}</h2>
                  <p className="text-sm text-gray-500">
                    Placed on:{" "}
                    {new Date(items[0].order_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    {orderStatusMap[items[0].order_status]}
                  </span>
                </div>
              </div>
              <div className="mb-4 flex flex-wrap gap-4">
                {items.slice(0, 3).map((item) => (
                  <Image
                    key={item.product_id}
                    src={item.product_thumbnail}
                    alt={item.product_title}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                ))}
                {items.length > 3 && (
                  <div className="flex h-[60px] w-[60px] items-center justify-center rounded-md bg-gray-200 text-sm font-medium">
                    +{items.length - 3}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">
                  Total: ${formatPrice(orderTotal)}
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">View Order Details</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Order #{orderId} Details</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh]">
                      <div className="space-y-4 p-4">
                        {items.map((item) => (
                          <div
                            key={item.product_id}
                            className="flex items-center space-x-4"
                          >
                            <Image
                              src={item.product_thumbnail}
                              alt={item.product_title}
                              width={50}
                              height={50}
                              className="rounded-md object-cover"
                            />
                            <div className="flex-1">
                              <Link href={`/products/${item.product_id}`}>
                                <p className="font-medium hover:underline">
                                  {item.product_title}
                                </p>
                              </Link>
                              <p className="text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                              <p className="text-sm font-semibold">
                                ${formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div>
                      <h3 className="mt-4 font-semibold">Shipping Address</h3>
                      <p className="text-sm text-gray-500">
                        {items[0].shipping_street},{items[0].shipping_city},
                        {items[0].shipping_state}-{items[0].shipping_zip},
                        {items[0].shipping_country}
                      </p>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <p> Shipping Cost: </p>
                      {items[0].shipping_cost > 0 ? (
                        <p> ${items[0].shipping_cost} </p>
                      ) : (
                        <p> Free </p>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <p> Tax: </p>
                      {items[0].tax > 0 ? (
                        <p> ${items[0].tax} </p>
                      ) : (
                        <p> Free </p>
                      )}
                    </div>
                    <div className="flex justify-between border-t pt-4">
                      <p className="font-semibold">Total:</p>
                      <p className="font-semibold">
                        ${formatPrice(orderTotal)}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
