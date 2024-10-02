"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaStar, FaEdit, FaTrashAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const ShippingAddress = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState<
    Omit<Address, "shipping_id" | "user_id" | "is_default">
  >({
    shipping_street: "",
    shipping_city: "",
    shipping_state: "",
    shipping_zip: "",
    shipping_country: "",
  });

  useEffect(() => {
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
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API}/shipping-addresses/${selectedAddress?.shipping_id}`
        : `${process.env.NEXT_PUBLIC_API}/shipping-addresses`;
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(
          isEditing
            ? { ...newAddress, id: selectedAddress?.shipping_id }
            : newAddress,
        ),
      });

      if (!response.ok) throw new Error("Failed to save address");

      toast.success(
        isEditing ? "Address updated successfully" : "New address added",
      );
      fetchAddresses();
      setIsEditing(false);
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

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setNewAddress({
      shipping_street: address.shipping_street,
      shipping_city: address.shipping_city,
      shipping_state: address.shipping_state,
      shipping_zip: address.shipping_zip,
      shipping_country: address.shipping_country,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/shipping-addresses/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!response.ok) throw new Error("Failed to delete address");
      toast.success("Address deleted successfully");
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/shipping-addresses/${id}/set-default`,
        {
          method: "PUT",
          credentials: "include",
        },
      );
      if (!response.ok) throw new Error("Failed to set default address");
      toast.success("Default address updated");
      fetchAddresses();
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Failed to set default address");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Shipping Addresses</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setIsEditing(false);
                setNewAddress({
                  shipping_street: "",
                  shipping_city: "",
                  shipping_state: "",
                  shipping_zip: "",
                  shipping_country: "",
                });
              }}
            >
              <FaPlus className="mr-2 text-[14px]" />
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Address" : "Add New Address"}
              </DialogTitle>
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
                {isEditing ? "Update Address" : "Add Address"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {addresses.map((address) => (
          <Card key={address.shipping_id}>
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
              <p>{address.shipping_country}</p>
              <div className="mt-4 flex gap-2">
                <div className="flex flex-row items-center justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(address)}
                    className="transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white"
                  >
                    <FaEdit className="mr-2 text-[14px]" />
                    Edit
                  </Button>
                </div>
                <div className="flex flex-row items-center justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(address.shipping_id)}
                    className="transition-colors duration-300 ease-in-out hover:bg-red-600 hover:text-white"
                  >
                    <FaTrashAlt className="mr-2 text-[12px]" />
                    Delete
                  </Button>
                </div>
                <div className="flex flex-row items-center justify-center">
                  {!address.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.shipping_id)}
                      className="transition-colors duration-300 ease-in-out hover:bg-yellow-600 hover:text-white"
                    >
                      <FaStar className="mr-2 text-[12px]" />
                      Set as Default
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShippingAddress;
