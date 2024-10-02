"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

interface OrderItem {
  order_id: number;
  product_id: number;
  product_title: string;
  product_price: number;
  product_thumbnail: string;
  quantity: number;
  order_date: string;
  price: number;
  order_status: number;
  shipping_id: number;
}

const orderStatusMap = {
  0: "Pending",
  1: "Processing",
  2: "Shipped",
  3: "Delivered",
  4: "Cancelled",
};

const PlacedOrders = () => {
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
      <div className="mt-8 text-center">You havent placed any orders yet.</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Your Orders</h1>
      <div className="space-y-6">
        {orderItems.map((item) => (
          <div
            key={item.order_id}
            className="rounded-lg bg-white p-6 shadow-md"
          >
            <div className="mb-4 flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-semibold">
                  Order #{item.order_id}
                </h2>
                <p className="text-sm text-gray-500">
                  Placed on: {new Date(item.order_date).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-2 sm:mt-0">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  {orderStatusMap[item.order_status]}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
              <Image
                src={item.product_thumbnail}
                alt={item.product_title}
                width={80}
                height={80}
                className="rounded-md object-cover"
              />
              <div className="flex-grow">
                <Link href={`/products/${item.product_id}`}>
                  <p className="font-medium hover:underline">
                    {item.product_title}
                  </p>
                </Link>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
                <p className="mt-1 font-semibold">${item.price}</p>
              </div>
              <div className="mt-4">
                <Link href={`/orders/${item.order_id}`}>
                  <button className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600">
                    View Order Details
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacedOrders;
