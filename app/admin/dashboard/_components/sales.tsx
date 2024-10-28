"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@nextui-org/input";
import { FaPlus } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Sale {
  sales_id: number;
  order_id: number;
  price: number;
  creation_date: string;
  total_products: number;
  total_quantity: number;
}

interface CompletedOrder {
  order_id: number;
  total_price: number;
  order_date: string;
  total_products: number;
}

interface OrderItem {
  order_item_id: number;
  product_id: number;
  product_title: string;
  quantity: number;
  price: number;
}

interface SaleDetail {
  sales_id: number;
  order_id: number;
  total_amount: number;
  creation_date: string;
  product_id: number;
  product_title: string;
  quantity: number;
  price: number;
}

const SalesPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<CompletedOrder | null>(
    null,
  );
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSales, setTotalSales] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedSaleDetails, setSelectedSaleDetails] = useState<SaleDetail[]>(
    [],
  );
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSales();
  }, [currentPage, searchTerm]);

  const fetchSales = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/sales?page=${currentPage}&pageSize=${itemsPerPage}&search=${searchTerm}`,
        { credentials: "include" },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch sales");
      }
      const data = await response.json();
      setSales(data.sales);
      setTotalPages(data.totalPages);
      setTotalSales(data.total);
    } catch (error) {
      console.error("Error fetching sales:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompletedOrders = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/completed-orders`,
        { credentials: "include" },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch completed orders");
      }
      const data = await response.json();
      setCompletedOrders(data.orders);
    } catch (error) {
      console.error("Error fetching completed orders:", error);
      toast.error("Failed to fetch completed orders");
    }
  };

  const fetchOrderItems = async (orderId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/order-items/${orderId}`,
        { credentials: "include" },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch order items");
      }
      const data = await response.json();
      setOrderItems(data.items);
    } catch (error) {
      console.error("Error fetching order items:", error);
      toast.error("Failed to fetch order items");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAddSale = async () => {
    if (!selectedOrder) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/add-sale`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: selectedOrder.order_id,
            totalAmount: selectedOrder.total_price,
            orderItems: orderItems,
          }),
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add sale");
      }

      toast.success("Sale added successfully");
      setIsAddDialogOpen(false);
      fetchSales();
      fetchCompletedOrders();
    } catch (error) {
      console.error("Error adding sale:", error);
      toast.error("Failed to add sale");
    }
  };

  const handleViewDetails = async (orderId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/sale/${orderId}`,
        { credentials: "include" },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch sale details");
      }
      const data = await response.json();
      setSelectedSaleDetails(data.saleDetails);
      setIsDetailsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching sale details:", error);
      toast.error("Failed to fetch sale details");
    }
  };

  return (
    <main className="flex h-screen w-full flex-col p-6">
      <div className="mb-6 flex h-fit w-full flex-row justify-between">
        <h1 className="text-2xl font-bold">Sales</h1>
        <div className="flex flex-row items-center justify-center gap-3">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  fetchCompletedOrders();
                  setIsAddDialogOpen(true);
                }}
              >
                <FaPlus className="mr-2" />
                Add New Sale
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen max-w-4xl overflow-y-scroll">
              <DialogHeader>
                <DialogTitle>Add New Sale</DialogTitle>
                <DialogDescription>
                  Select a completed order to add as a sale.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Select
                  onValueChange={(value) => {
                    const order = completedOrders.find(
                      (o) => o.order_id.toString() === value,
                    );
                    setSelectedOrder(order || null);
                    if (order) {
                      fetchOrderItems(order.order_id);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an order" />
                  </SelectTrigger>
                  <SelectContent>
                    {completedOrders.map((order) => (
                      <SelectItem
                        key={order.order_id}
                        value={order.order_id.toString()}
                      >
                        Order #{order.order_id} - ${order.total_price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedOrder && (
                  <div>
                    <h3 className="text-lg font-semibold">Order Items</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderItems.map((item) => (
                          <TableRow key={item.order_item_id}>
                            <TableCell>{item.product_title}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>${item.price}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  className="bg-green-500 transition-colors duration-200 ease-in-out hover:bg-green-600"
                  onClick={handleAddSale}
                  disabled={!selectedOrder}
                >
                  Add new sale
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Input
            startContent={<CiSearch size={30} className="pr-2" />}
            className="h-full w-64 rounded-md"
            placeholder="Search sales"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">SL.</TableHead>
            <TableHead className="text-right">Order ID</TableHead>
            <TableHead className="text-right">Total Products</TableHead>
            <TableHead className="text-right">Total Quantity</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
            <TableHead className="text-center">Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale, index) => (
            <TableRow key={sale.order_id}>
              <TableCell className="text-right">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell className="text-right">{sale.order_id}</TableCell>
              <TableCell className="text-right">
                {sale.total_products}
              </TableCell>
              <TableCell className="text-right">
                {sale.total_quantity}
              </TableCell>
              <TableCell className="text-right">${sale.price}</TableCell>
              <TableCell>
                {new Date(sale.creation_date).toLocaleTimeString("en-bd")}{" "}
                {new Date(sale.creation_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="link"
                  className="m-0 p-0"
                  size="sm"
                  onClick={() => handleViewDetails(sale.order_id)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex items-center justify-between">
        <div className="w-full">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalSales)} of {totalSales}{" "}
          sales
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNumber);
                      }}
                      isActive={pageNumber === currentPage}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return <PaginationEllipsis key={pageNumber} />;
              }
              return null;
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages)
                    handlePageChange(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sale Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedSaleDetails.length > 0 && (
              <>
                <p>Order ID: {selectedSaleDetails[0].order_id}</p>
                <p>
                  Date:{" "}
                  {new Date(
                    selectedSaleDetails[0].creation_date,
                  ).toLocaleString()}
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSaleDetails.map((item) => (
                      <TableRow key={item.product_id}>
                        <TableCell>{item.product_title}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.price}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="font-bold">
                  Total Amount: $
                  {selectedSaleDetails
                    .reduce((sum, item) => sum + Number(item.price), 0)
                    .toFixed(2)}
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default SalesPage;
