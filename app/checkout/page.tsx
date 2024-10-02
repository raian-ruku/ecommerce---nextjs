"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/cartContext";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CustomTop from "@/app/components/customTop";
import { Footer } from "@/app/components/footer";
import { useRouter } from "next/navigation";
import { TbShoppingCartCog } from "react-icons/tb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaEye, FaStar, FaEdit, FaTrashAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { toast } from "sonner";

interface Address {
  shipping_id: number;
  user_id: number;
  shipping_street: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_country: string;
  is_default: boolean;
}

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const [isClient, setIsClient] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewAddressDialogOpen, setIsViewAddressDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState<
    Omit<Address, "shipping_id" | "user_id" | "is_default">
  >({
    shipping_street: "",
    shipping_city: "",
    shipping_state: "",
    shipping_zip: "",
    shipping_country: "",
  });
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/shipping-addresses`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (!response.ok) throw new Error("Failed to fetch addresses");
      const data = await response.json();
      setAddresses(data.addresses);
      const defaultAddress = data.addresses.find(
        (addr: Address) => addr.is_default,
      );
      setSelectedAddress(defaultAddress || data.addresses[0] || null);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingAddress((prev) => ({ ...prev!, [name]: value }));
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/shipping-addresses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(newAddress),
        },
      );

      if (!response.ok) throw new Error("Failed to save address");

      toast.success("New address added");
      fetchAddresses();
      setIsDialogOpen(false);
      setNewAddress({
        shipping_street: "",
        shipping_city: "",
        shipping_state: "",
        shipping_zip: "",
        shipping_country: "",
      });
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
    }
  };

  const handleEditAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/shipping-addresses/${editingAddress?.shipping_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(editingAddress),
        },
      );

      if (!response.ok) throw new Error("Failed to update address");

      toast.success("Address updated");
      fetchAddresses();
      setIsEditDialogOpen(false);
      setEditingAddress(null);
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address");
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/shipping-addresses/${addressId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) throw new Error("Failed to delete address");

      toast.success("Address deleted");
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedAddress) {
      router.push("/successfulorder");
      setTimeout(() => {
        clearCart();
      }, 1000);
    } else {
      toast.error("Please select a shipping address");
    }
  };

  const calculateTotalPrice = () => {
    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    return totalPrice.toFixed(2);
  };

  const calculateShipping = () => {
    const totalPrice = calculateTotalPrice();
    return Number(totalPrice) > 100 ? 0 : 9.99;
  };

  const calculateTax = () => {
    const totalPrice = calculateTotalPrice();
    return (Number(totalPrice) * 0.1).toFixed(2);
  };

  const calculateFinalPrice = () => {
    const totalPrice = Number(calculateTotalPrice());
    const shipping = calculateShipping();
    const tax = Number(calculateTax());
    return (totalPrice + shipping + tax).toFixed(2);
  };

  if (!isClient) return null;

  return (
    <main className="flex flex-col items-center justify-center">
      <CustomTop classname="bg-n100" />
      <div className="mt-20 flex w-container items-start justify-between">
        <div className="w-1/2">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-b900">Shipping Address</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <FaPlus className="mr-2 text-[14px]" />
                  Add New Address
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shipping_street">Street</Label>
                      <Input
                        id="shipping_street"
                        name="shipping_street"
                        value={newAddress.shipping_street}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shipping_city">City</Label>
                      <Input
                        id="shipping_city"
                        name="shipping_city"
                        value={newAddress.shipping_city}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipping_state">State</Label>
                      <Input
                        id="shipping_state"
                        name="shipping_state"
                        value={newAddress.shipping_state}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipping_zip">Zip Code</Label>
                      <Input
                        id="shipping_zip"
                        name="shipping_zip"
                        value={newAddress.shipping_zip}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipping_country">Country</Label>
                      <Input
                        id="shipping_country"
                        name="shipping_country"
                        value={newAddress.shipping_country}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Add Address
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col gap-4">
            {addresses.map((address) => (
              <Card
                key={address.shipping_id}
                className={`cursor-pointer ${
                  selectedAddress?.shipping_id === address.shipping_id
                    ? "border-2 border-blue-500"
                    : ""
                }`}
                onClick={() => setSelectedAddress(address)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{address.shipping_city}</span>
                    {Boolean(address.is_default) && (
                      <FaStar className="h-4 w-4 text-yellow-500" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{address.shipping_street}</p>
                  <p>
                    {address.shipping_city}, {address.shipping_state}{" "}
                    {address.shipping_zip}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Dialog
                      open={isViewAddressDialogOpen}
                      onOpenChange={setIsViewAddressDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAddress(address);
                          }}
                        >
                          <FaEye className="mr-2 text-[14px]" />
                          View Full Address
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Full Address</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 space-y-2">
                          <p>
                            <strong>Street:</strong> {address.shipping_street}
                          </p>
                          <p>
                            <strong>City:</strong> {address.shipping_city}
                          </p>
                          <p>
                            <strong>State:</strong> {address.shipping_state}
                          </p>
                          <p>
                            <strong>Zip Code:</strong> {address.shipping_zip}
                          </p>
                          <p>
                            <strong>Country:</strong> {address.shipping_country}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAddress(address);
                          }}
                        >
                          <FaEdit className="mr-2 text-[14px]" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Address</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={handleEditAddressSubmit}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit_shipping_street">
                                Street
                              </Label>
                              <Input
                                id="edit_shipping_street"
                                name="shipping_street"
                                value={editingAddress?.shipping_street}
                                onChange={handleEditAddressChange}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit_shipping_city">City</Label>
                              <Input
                                id="edit_shipping_city"
                                name="shipping_city"
                                value={editingAddress?.shipping_city}
                                onChange={handleEditAddressChange}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit_shipping_state">State</Label>
                              <Input
                                id="edit_shipping_state"
                                name="shipping_state"
                                value={editingAddress?.shipping_state}
                                onChange={handleEditAddressChange}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit_shipping_zip">
                                Zip Code
                              </Label>
                              <Input
                                id="edit_shipping_zip"
                                name="shipping_zip"
                                value={editingAddress?.shipping_zip}
                                onChange={handleEditAddressChange}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit_shipping_country">
                                Country
                              </Label>
                              <Input
                                id="edit_shipping_country"
                                name="shipping_country"
                                value={editingAddress?.shipping_country}
                                onChange={handleEditAddressChange}
                                required
                              />
                            </div>
                          </div>
                          <Button type="submit" className="w-full">
                            Update Address
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      className="transition-colors duration-300 ease-in-out hover:bg-red-600 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(address.shipping_id);
                      }}
                    >
                      <FaTrashAlt className="mr-2 text-[12px]" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button
            onClick={handleSubmit}
            className="mt-5 transition-colors duration-500 ease-in-out hover:bg-green-600"
          >
            Place Order
          </Button>
        </div>
        <div className="mx-8 h-[500px] w-[1px] bg-neutral-200"></div>
        <form className="flex w-96 flex-col p-5">
          <h1 className="pb-5 text-xl font-bold text-b900">Your Order</h1>
          <div className="flex flex-row items-center justify-between gap-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <div className="relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    height={40}
                    width={40}
                    className="h-10 w-10 rounded-full bg-n100"
                  />
                  <span className="pointer-events-none absolute -right-2 -top-2 rounded-full bg-red-500 px-2 py-1 text-[8px] text-white">
                    {item.quantity}
                  </span>
                </div>
              </div>
            ))}
            <Link href="/cart">
              <Button className="bg-transparent text-b900 hover:bg-transparent">
                <TbShoppingCartCog size={20} />
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex w-full flex-col gap-5">
            <div className="flex w-full justify-between">
              <p>Subtotal</p>
              <p>${calculateTotalPrice()}</p>
            </div>
            <div className="flex w-full justify-between">
              <p>Shipping</p>
              <p>${calculateShipping()}</p>
            </div>
            <div className="flex w-full justify-between">
              <p>Tax</p>
              <p>${calculateTax()}</p>
            </div>
            <hr />
            <div className="flex w-full justify-between">
              <p>Total</p>
              <p>${calculateFinalPrice()}</p>
            </div>
          </div>
        </form>
      </div>
      <Footer className="mt-48 bg-n100" />
    </main>
  );
};

export default CheckoutPage;
