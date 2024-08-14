"use client";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import QuantitySelector from "../components/quantitySelector";
import { IoIosClose } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Footer } from "../components/footer";

type CartItem = {
  id: number;
  title: string;
};

const CartPage = () => {
  const cartItem: CartItem[] = [
    { id: 1, title: "Product 1" },
    { id: 2, title: "Product 2" },
  ];

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="mt-10 flex w-full items-center justify-center bg-n100">
        <div className="my-10 flex w-container flex-col gap-4">
          {" "}
          <h1 className="text-2xl">Cart</h1>{" "}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>Home</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>Cart</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>{" "}
        </div>
      </div>
      <div className="my-20 flex w-container flex-row justify-between">
        <div className="w-[600px]">
          <h1 className="text-xl">Your cart</h1>
          <hr />
          <div className="mt-10">
            {cartItem.map((item) => (
              <div
                key={item.id}
                className="flex flex-row items-center justify-between"
              >
                <div className="my-5 h-20 w-20 bg-n100"></div>
                <div className="flex-col">
                  {item.title} <p>Size</p>{" "}
                </div>
                <p>$Price</p>
                <QuantitySelector />
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-neutral-200 text-red-400">
                  <IoIosClose size={30} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <form className="flex w-96 flex-col rounded-md border-[1px] border-neutral-200 p-5">
          <h1 className="text-xl font-bold text-b900">Order Summary</h1>
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
            <Button className="mt-5">Checkout</Button>
            <p className="mb-10 flex items-center justify-center text-n300 underline">
              Continue Shopping
            </p>
          </div>
        </form>
      </div>
      <Footer className="mt-20 bg-n100" />
    </main>
  );
};

export default CartPage;
