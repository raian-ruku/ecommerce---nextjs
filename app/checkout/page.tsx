import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { Footer } from "../components/footer";
import CustomTop from "../components/customTop";

const CheckoutPage = () => {
  const items = [1, 2, 3];
  return (
    <main className="flex flex-col items-center justify-center">
      <CustomTop  classname="bg-n100" />
      <div className="mt-20 flex w-container items-center justify-between">
        <form className="w-1/2">
          <h1 className="text-xl font-bold text-b900">Shipping Address</h1>
          <div className="mt-10">
            <Label htmlFor="street" className="text-n300">
              Street Address
            </Label>
            <Input name="street" className="border-neutral-200" />
          </div>
          <div className="mt-5 flex flex-col gap-5">
            <div className="flex flex-row justify-between">
              <div className="flex w-[45%] flex-col gap-y-1">
                <Label htmlFor="city" className="text-n300">
                  City
                </Label>
                <Input name="city" className="border-neutral-200" />
              </div>
              <div className="flex w-[45%] flex-col gap-y-1">
                <Label htmlFor="city" className="text-n300">
                  State
                </Label>
                <Input name="state" className="border-neutral-200" />
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="flex w-[45%] flex-col gap-y-1">
                <Label htmlFor="zip" className="text-n300">
                  Zip Code
                </Label>
                <Input name="zip" className="border-neutral-200" />
              </div>
              <div className="flex w-[45%] flex-col gap-y-1">
                <Label htmlFor="con" className="text-n300">
                  Country
                </Label>
                <Input name="con" className="border-neutral-200" />
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="flex w-[45%] flex-col gap-y-1">
                <Label htmlFor="email" className="text-n300">
                  Email
                </Label>
                <Input name="email" className="border-neutral-200" />
              </div>
              <div className="flex w-[45%] flex-col gap-y-1">
                <Label htmlFor="name" className="text-n300">
                  Full Name
                </Label>
                <Input name="name" className="border-neutral-200" />
              </div>
            </div>
          </div>
        </form>
        <div className="mx-8 h-[500px] w-[1px] bg-neutral-200"></div>
        <form className="flex w-96 flex-col p-5">
          <h1 className="pb-5 text-xl font-bold text-b900">Your Order</h1>
          <div className="flex flex-row items-center justify-between gap-2">
            {items.map((item) => (
              <div key={item} className="h-10 w-10 rounded-full bg-n100"></div>
            ))}
            <Button className="border-[1px] border-n300 bg-transparent text-b900 hover:border-n300 hover:bg-transparent">
              Edit Cart
            </Button>
          </div>
          <div className="mt-10 flex w-full flex-col gap-5">
            <div className="flex w-full justify-between">
              <p>Subtotal</p>
              <p>$Price</p>
            </div>
            <div className="flex w-full justify-between">
              <p>Shipping</p>
              <p>$Price</p>
            </div>
            <div className="flex w-full justify-between">
              <p>Tax</p>
              <p>$Price</p>
            </div>
            <hr />
            <div className="flex w-full justify-between">
              <p>Total</p>
              <p>$Price</p>
            </div>
            <Button className="mt-5">Place Order</Button>
          </div>
        </form>
      </div>
      <Footer className="mt-48 bg-n100" />
    </main>
  );
};

export default CheckoutPage;
