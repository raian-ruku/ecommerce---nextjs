"use client";

import React, { useEffect, useState } from "react"; // Import the useCart hook
import { useCart } from "@/context/cartContext";
import { IoIosClose } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Footer } from "../components/footer";
import CustomTop from "../components/customTop";
import QuantitySelector from "../components/quantitySelector";
import Link from "next/link";
import Image from "next/image";

import { MdDeleteForever } from "react-icons/md";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getItemMinQuantity } =
    useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRemoveFromCart = (id: number) => {
    removeFromCart(id);
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const calculateTotalPrice = () => {
    // Calculate total price from cart items
    const totalPrice: number = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    return totalPrice.toFixed(2);
  };

  const calculateFinalPrice = () => {
    const totalPrice: number = Number(calculateTotalPrice());
    let tax: number; // Get cart items and removeFromCart from the context
    const shipping =
      cartItems.length === 0 ? 0.0 : totalPrice > 100 ? 0.0 : 9.99;

    cartItems.length === 0 ? (tax = 0.0) : (tax = totalPrice * 0.1);
    const finalPrice = totalPrice + shipping + tax;
    return {
      finalPrice: finalPrice.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
    };
  };
  if (!isClient) return null;

  let isDisabled: boolean = cartItems.length === 0;

  return (
    <main className="flex flex-col items-center justify-center">
      <CustomTop classname="bg-n100" />
      <div className="my-20 flex w-container flex-row justify-between">
        <div className="w-[600px]">
          <h1 className="mb-2 text-xl">Your Cart</h1>
          <hr />
          <div className="mt-10">
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="my-5 flex flex-row items-center justify-between"
                >
                  <Image
                    src={item.image}
                    alt=""
                    height={80}
                    width={80}
                    className="h-20 w-20 rounded-md bg-n100"
                  />

                  <div className="flex-col">
                    <Link href={`/products/${item.id}`}>
                      <p className="w-40">{item.title}</p>
                    </Link>
                  </div>
                  <p className="w-24">${item.price}</p>
                  <QuantitySelector
                    quantity={item.quantity}
                    onQuantityChange={(newQuantity) =>
                      handleQuantityChange(item.id, newQuantity)
                    }
                    minQuantity={getItemMinQuantity(item.id)}
                  />
                  <div
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border-[1px] border-red-600 bg-transparent text-red-600 transition-colors duration-300 ease-in-out hover:bg-red-600 hover:text-white"
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    <MdDeleteForever size={25} />
                    {/* <IoIosClose size={30} /> */}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <form className="flex h-1/3 w-96 flex-col rounded-md border-[1px] border-neutral-200 p-5">
          <h1 className="text-xl font-bold text-b900">Order Summary</h1>
          <div className="mt-10 flex w-full flex-col gap-5">
            <div className="flex w-full justify-between">
              <p>Subtotal</p>
              <p>${calculateTotalPrice()}</p>
            </div>
            <div className="flex w-full justify-between">
              <p>Shipping</p>
              <p>${calculateFinalPrice().shipping}</p>
            </div>
            <div className="flex w-full justify-between">
              <p>Tax</p>
              <p>${calculateFinalPrice().tax}</p>
            </div>
            <hr />
            <div className="flex w-full justify-between">
              <p>Total</p>
              <p>${calculateFinalPrice().finalPrice}</p>
            </div>
            {isDisabled === true ? (
              <Button
                className="mt-5 w-full disabled:bg-red-900"
                disabled={isDisabled}
              >
                Checkout
              </Button>
            ) : (
              <Link href="/checkout">
                <Button
                  className="mt-5 w-full disabled:bg-red-900"
                  disabled={isDisabled}
                >
                  Checkout
                </Button>
              </Link>
            )}

            <p className="mb-10 flex items-center justify-center text-n300 underline">
              <Link href="/">Continue Shopping</Link>
            </p>
          </div>
        </form>
      </div>
      <Footer className="mt-20 bg-n100" />
    </main>
  );
};

export default CartPage;
