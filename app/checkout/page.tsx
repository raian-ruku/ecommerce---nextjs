"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Footer } from "../components/footer";
import CustomTop from "../components/customTop";
import { useCart } from "@/context/cartContext";
import Image from "next/image";
import Link from "next/link";

import { TbShoppingCartCog } from "react-icons/tb";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
  const { cartItems } = useCart(); // Access cart items from CartContext
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    email: "",
    name: "",
  });
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if any field is empty
    const isFormValid = Object.values(formData).every(
      (value) => value.trim() !== "",
    );

    if (isFormValid) {
      router.push("/successfulorder");
    } else {
      router.push("/unsuccessfulorder");
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
      <div className="mt-20 flex w-container items-center justify-between">
        <form className="w-1/2" onSubmit={handleSubmit}>
          <h1 className="text-xl font-bold text-b900">Shipping Address</h1>
          <div className="mt-10">
            <Label htmlFor="street" className="text-n300">
              Street Address
            </Label>
            <Input
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="border-neutral-200"
            />
          </div>
          <div className="mt-5 flex flex-col gap-5">
            <div className="flex flex-row justify-between">
              <div className="flex w-[45%] flex-col gap-y-1">
                <Label htmlFor="city" className="text-n300">
                  City
                </Label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="border-neutral-200"
                />
              </div>
              <div className="flex w-[45%] flex-col gap-y-1">
                <Label htmlFor="state" className="text-n300">
                  State
                </Label>
                <Input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="border-neutral-200"
                />
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="flex w-[45%] flex-col gap-y-1">
                <Label htmlFor="zip" className="text-n300">
                  Zip Code
                </Label>
                <Input
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className="border-neutral-200"
                />
              </div>
              <div className="flex w-[45%] flex-col gap-y-1">
                <Label htmlFor="country" className="text-n300">
                  Country
                </Label>
                <Input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="border-neutral-200"
                />
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="flex w-[45%] flex-col gap-y-1">
                <Label htmlFor="email" className="text-n300">
                  Email
                </Label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border-neutral-200"
                />
              </div>
              <div className="flex w-[45%] flex-col gap-y-1">
                <Label htmlFor="name" className="text-n300">
                  Full Name
                </Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border-neutral-200"
                />
              </div>
            </div>
          </div>
          <Button type="submit" className="mt-5">
            Place Order
          </Button>
        </form>
        <div className="mx-8 h-[500px] w-[1px] bg-neutral-200"></div>
        <form className="flex w-96 flex-col p-5">
          <h1 className="pb-5 text-xl font-bold text-b900">Your Order</h1>
          <div className="flex flex-row items-center justify-between gap-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <Image
                  src={item.image}
                  alt={item.title}
                  height={40}
                  width={40}
                  className="h-10 w-10 rounded-full bg-n100"
                />
                {/* <p className="text-sm">{item.title}</p> */}
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
