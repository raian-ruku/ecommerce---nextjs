"use client";

import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { CiSearch } from "react-icons/ci";
import { IoIosMore } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";

import { Button } from "@/components/ui/button";
import { Input } from "@nextui-org/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface OrderItem {
  product_id: number;
  product_title: string;
  quantity: number;
  price: number;
}

interface Order {
  order_id: number;
  order_date: string;
  total_price: number;
  order_status: number;
  items: string;
  item_count: number;
  shipping_street: string;
  shipping_state: string;
  shipping_city: string;
  shipping_zip: string;
  shipping_country: string;
  user_name: string;
  user_email: string;
  item_details: OrderItem[];
}

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isItemsDialogOpen, setIsItemsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");

  const fetchOrders = useCallback(async (page: number, pageSize: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/orders?page=${page}&pageSize=${pageSize}`,
        { credentials: "include" },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(pagination.currentPage, pagination.pageSize);
  }, [pagination.currentPage, pagination.pageSize, fetchOrders]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

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
      case 2:
        return (
          <Badge className="border-lime-500 text-lime-500" variant="outline">
            Shipped
          </Badge>
        );
      case 3:
        return (
          <Badge className="border-green-500 text-green-500" variant="outline">
            Completed
          </Badge>
        );
      case 4:
        return (
          <Badge className="border-red-500 text-red-500" variant="outline">
            Cancelled
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.order_id.toString().includes(searchTerm),
  );

  const handleDelete = async (orderId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/delete/${orderId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to delete order");
      }
      setOrders(orders.filter((order) => order.order_id !== orderId));
      toast.success("Order deleted successfully");
    } catch (err) {
      console.error("Error deleting order:", err);
      toast.error("Failed to delete order. Please try again.");
    }
    setIsDeleteDialogOpen(false);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.order_status.toString());
    setIsEditDialogOpen(true);
  };

  const handleStatusChange = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/status/${selectedOrder.order_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ new_status: parseInt(newStatus) }),
          credentials: "include",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update order status");
      }
      const updatedOrder = {
        ...selectedOrder,
        order_status: parseInt(newStatus),
      };
      setOrders(
        orders.map((order) =>
          order.order_id === updatedOrder.order_id ? updatedOrder : order,
        ),
      );
      setIsEditDialogOpen(false);
      toast.success("Order status updated successfully");
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("Failed to update order status. Please try again.");
    }
  };

  const handleViewItems = (order: Order) => {
    setSelectedOrder(order);
    setIsItemsDialogOpen(true);
  };

  return (
    <main className="flex h-screen w-full flex-col p-6">
      <div className="mb-6 flex h-fit w-full flex-row justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Input
          placeholder="Search orders"
          startContent={<CiSearch size={30} className="pr-2" />}
          className="h-full w-[300px] rounded-md"
        />
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">Order ID</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.order_id}>
                  <TableCell className="text-right">{order.order_id}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="m-0 p-0"
                      onClick={() => handleViewItems(order)}
                    >
                      View Items ({order.item_count})
                    </Button>
                  </TableCell>
                  <TableCell>
                    {new Date(order.order_date).toLocaleTimeString("en-BD")}{" "}
                    {new Date(order.order_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    ${order.total_price}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.order_status)}</TableCell>
                  <TableCell>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <IoIosMore size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(order)}>
                          <FiEdit className="mr-2 text-[14px]" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-red-500 data-[highlighted]:bg-red-500 data-[highlighted]:text-white"
                        >
                          <MdDeleteForever className="mr-2 text-[14px]" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex items-center justify-between">
            <div>
              Showing {(pagination.currentPage - 1) * pagination.pageSize + 1}{" "}
              to{" "}
              {Math.min(
                pagination.currentPage * pagination.pageSize,
                pagination.totalItems,
              )}{" "}
              of {pagination.totalItems} orders
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.currentPage > 1) {
                        handlePageChange(pagination.currentPage - 1);
                      }
                    }}
                    className={`cursor-pointer select-none border-none hover:bg-transparent ${
                      pagination.currentPage > 1
                        ? "hover:text-blue-700"
                        : "text-n300 hover:text-red-100"
                    }`}
                  />
                </PaginationItem>
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === pagination.totalPages ||
                    (pageNumber >= pagination.currentPage - 1 &&
                      pageNumber <= pagination.currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNumber);
                          }}
                          isActive={pageNumber === pagination.currentPage}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    pageNumber === pagination.currentPage - 2 ||
                    pageNumber === pagination.currentPage + 2
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
                      if (pagination.currentPage < pagination.totalPages) {
                        handlePageChange(pagination.currentPage + 1);
                      }
                    }}
                    className={`cursor-pointer select-none border-none hover:bg-transparent ${
                      pagination.currentPage < pagination.totalPages
                        ? "hover:text-blue-700"
                        : "text-n300 hover:text-red-100"
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-auto">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>
              Update the order status here. Click save when youre done.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="order-id" className="text-right">
                  Order ID
                </label>
                <Input
                  id="order-id"
                  value={selectedOrder.order_id.toString()}
                  className="col-span-3 disabled:font-black"
                  readOnly
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="order-date"
                  className="text-right disabled:font-black"
                >
                  Order Date
                </label>
                <Input
                  id="order-date"
                  value={`${new Date(selectedOrder.order_date).toLocaleTimeString("en-BD")} ${new Date(selectedOrder.order_date).toLocaleDateString()}`}
                  className="col-span-3"
                  readOnly
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="username"
                  className="text-right disabled:font-black"
                >
                  Ordered By
                </label>
                <Input
                  id="username"
                  value={selectedOrder.user_name}
                  className="col-span-3"
                  readOnly
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="useremail"
                  className="text-right disabled:font-black"
                >
                  User Email
                </label>
                <Input
                  id="useremail"
                  value={selectedOrder.user_email}
                  className="col-span-3"
                  readOnly
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="address"
                  className="text-right disabled:font-black"
                >
                  Shipping Address
                </label>
                <Input
                  id="address"
                  value={[
                    selectedOrder.shipping_street,
                    selectedOrder.shipping_city,
                    selectedOrder.shipping_state,
                    selectedOrder.shipping_zip,
                    selectedOrder.shipping_country,
                  ].join(", ")}
                  className="col-span-3"
                  readOnly
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="order-total"
                  className="text-right disabled:font-black"
                >
                  Total
                </label>
                <Input
                  id="order-total"
                  value={`$${selectedOrder.total_price}`}
                  className="col-span-3"
                  readOnly
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="order-status"
                  className="text-right disabled:font-black"
                >
                  Status
                </label>
                <Select
                  onValueChange={(value) => setNewStatus(value)}
                  defaultValue={selectedOrder.order_status.toString()}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="0"
                      className="text-yellow-500 transition-colors duration-200 data-[highlighted]:bg-yellow-500 data-[highlighted]:text-white"
                    >
                      Pending
                    </SelectItem>
                    <SelectItem
                      value="1"
                      className="text-orange-500 transition-colors duration-200 data-[highlighted]:bg-orange-500 data-[highlighted]:text-white"
                    >
                      Processing
                    </SelectItem>
                    <SelectItem
                      value="2"
                      className="text-lime-500 transition-colors duration-200 data-[highlighted]:bg-lime-500 data-[highlighted]:text-white"
                    >
                      Shipped
                    </SelectItem>
                    <SelectItem
                      value="3"
                      className="text-green-500 transition-colors duration-200 data-[highlighted]:bg-green-500 data-[highlighted]:text-white"
                    >
                      Completed
                    </SelectItem>
                    <SelectItem
                      value="4"
                      className="text-red-500 transition-colors duration-200 data-[highlighted]:bg-red-500 data-[highlighted]:text-white"
                    >
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleStatusChange}
              className="bg-green-500 transition-all duration-300 ease-in-out hover:bg-green-600"
            >
              Update status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) {
            setSelectedOrder(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedOrder && handleDelete(selectedOrder.order_id)
              }
              className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog
        open={isItemsDialogOpen}
        onOpenChange={(open) => {
          setIsItemsDialogOpen(open);
          if (!open) {
            setSelectedOrder(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Order Items</DialogTitle>
            <DialogDescription>
              Details of items in Order #{selectedOrder?.order_id}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder.item_details.map((item) => (
                    <TableRow key={item.product_id}>
                      <TableCell>{item.product_title}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 text-right font-bold">
                Total: ${selectedOrder.total_price}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
