"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CiSearch } from "react-icons/ci";
import { Input } from "@nextui-org/input";
import { RxAvatar } from "react-icons/rx";
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
import { MdDeleteForever } from "react-icons/md";
import Image from "next/image";

interface Customer {
  user_id: number;
  user_name: string;
  user_email: string;
  user_image: string;
  creation_date: string;
}

interface ShippingAddress {
  shipping_id: number;
  shipping_street: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_country: string;
}

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>(
    [],
  );
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, searchTerm]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/customers?page=${currentPage}&pageSize=${itemsPerPage}&search=${searchTerm}`,
        { credentials: "include" },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      const data = await response.json();
      setCustomers(data.customers);
      setTotalPages(data.totalPages);
      setTotalCustomers(data.total);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchShippingAddresses = async (userId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/customer/${userId}/shipping-addresses`,
        { credentials: "include" },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch shipping addresses");
      }
      const data = await response.json();
      setShippingAddresses(data.addresses);
    } catch (error) {
      console.error("Error fetching shipping addresses:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleOpenAddressDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    fetchShippingAddresses(customer.user_id);
    setIsAddressDialogOpen(true);
  };

  return (
    <main className="flex h-screen w-full flex-col p-6">
      <div className="mb-6 flex h-fit w-full flex-row justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Input
          startContent={<CiSearch size={30} className="pr-2" />}
          className="h-full w-64 rounded-md"
          placeholder="Search customers"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SL.</TableHead>
            <TableHead className="w-[100px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Shipping Address</TableHead>
            <TableHead>Member Since</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.user_id}>
              <TableCell>{customer.user_id}</TableCell>
              <TableCell>
                {customer.user_image ? (
                  <Image
                    src={customer.user_image}
                    alt={customer.user_name}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                ) : (
                  <Image
                    src={`https://ui-avatars.com/api/avatar?name=${encodeURIComponent(customer.user_name)}&rounded=true&background=random`}
                    alt={customer.user_name}
                    width={25}
                    height={25}
                    className="rounded-md"
                  />
                )}
              </TableCell>
              <TableCell>{customer.user_name}</TableCell>
              <TableCell>{customer.user_email}</TableCell>
              <TableCell>
                <Button
                  variant="link"
                  className="m-0 flex items-center justify-center p-0"
                  onClick={() => handleOpenAddressDialog(customer)}
                >
                  View
                </Button>
              </TableCell>
              <TableCell className="flex flex-col">
                {new Date(customer.creation_date).toLocaleTimeString()}{" "}
                {new Date(customer.creation_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <MdDeleteForever className="mr-2 text-[14px]" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex items-center justify-between">
        <div className="w-full">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalCustomers)} of{" "}
          {totalCustomers} customers
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
                className={`cursor-pointer select-none border-none hover:bg-transparent ${
                  currentPage > 1
                    ? "hover:text-blue-700"
                    : "text-n300 hover:text-red-100"
                }`}
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
                className={`cursor-pointer select-none border-none hover:bg-transparent ${
                  currentPage < totalPages
                    ? "hover:text-blue-700"
                    : "text-n300 hover:text-red-100"
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Shipping Addresses for {selectedCustomer?.user_name}
            </DialogTitle>
          </DialogHeader>
          {shippingAddresses.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {shippingAddresses.map((address) => (
                <div
                  key={address.shipping_id}
                  className="mb-4 rounded-md border p-4"
                >
                  <p>{address.shipping_street}</p>

                  <p>
                    {address.shipping_city}, {address.shipping_state}{" "}
                    {address.shipping_zip}
                  </p>
                  <p>{address.shipping_country}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No shipping addresses found for this customer.</p>
          )}
          <DialogFooter>
            <Button onClick={() => setIsAddressDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default CustomersPage;
