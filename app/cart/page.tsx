// "use client";

// import React, { useEffect, useState } from "react"; // Import the useCart hook
// import { useCart } from "@/context/cartContext";
// import { IoIosClose } from "react-icons/io";
// import { Button } from "@/components/ui/button";
// import { Footer } from "../components/footer";
// import CustomTop from "../components/customTop";
// import QuantitySelector from "../components/quantitySelector";
// import Link from "next/link";
// import Image from "next/image";

// import { MdDeleteForever } from "react-icons/md";

// const CartPage = () => {
//   const { cartItems, removeFromCart, updateQuantity, getItemMinQuantity } =
//     useCart();
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const handleRemoveFromCart = (id: number) => {
//     removeFromCart(id);
//   };

//   const handleQuantityChange = (id: number, newQuantity: number) => {
//     updateQuantity(id, newQuantity);
//   };

//   const calculateTotalPrice = () => {
//     // Calculate total price from cart items
//     const totalPrice: number = cartItems.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0,
//     );
//     return totalPrice.toFixed(2);
//   };

//   const calculateFinalPrice = () => {
//     const totalPrice: number = Number(calculateTotalPrice());
//     let tax: number; // Get cart items and removeFromCart from the context
//     const shipping =
//       cartItems.length === 0 ? 0.0 : totalPrice > 100 ? 0.0 : 9.99;

//     cartItems.length === 0 ? (tax = 0.0) : (tax = totalPrice * 0.1);
//     const finalPrice = totalPrice + shipping + tax;
//     return {
//       finalPrice: finalPrice.toFixed(2),
//       tax: tax.toFixed(2),
//       shipping: shipping.toFixed(2),
//     };
//   };
//   if (!isClient) return null;

//   let isDisabled: boolean = cartItems.length === 0;

//   return (
//     <main className="flex flex-col items-center justify-center">
//       <CustomTop classname="bg-n100" />
//       <div className="my-20 flex w-container flex-row justify-between">
//         <div className="w-[600px]">
//           <h1 className="mb-2 text-xl">Your Cart</h1>
//           <hr />
//           <div className="mt-10">
//             {cartItems.length === 0 ? (
//               <p>Your cart is empty.</p>
//             ) : (
//               cartItems.map((item) => (
//                 <div
//                   key={item.id}
//                   className="my-5 flex flex-row items-center justify-between"
//                 >
//                   <Image
//                     src={item.image}
//                     alt=""
//                     height={80}
//                     width={80}
//                     className="h-20 w-20 rounded-md bg-n100"
//                   />

//                   <div className="flex-col">
//                     <Link href={`/products/${item.id}`}>
//                       <p className="w-40">{item.title}</p>
//                     </Link>
//                   </div>
//                   <p className="w-24">${item.price}</p>
//                   <QuantitySelector
//                     quantity={item.quantity}
//                     onQuantityChange={(newQuantity) =>
//                       handleQuantityChange(item.id, newQuantity)
//                     }
//                     minQuantity={getItemMinQuantity(item.id)}
//                   />
//                   <div
//                     className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border-[1px] border-red-600 bg-transparent text-red-600 transition-colors duration-300 ease-in-out hover:bg-red-600 hover:text-white"
//                     onClick={() => handleRemoveFromCart(item.id)}
//                   >
//                     <MdDeleteForever size={25} />
//                     {/* <IoIosClose size={30} /> */}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//         <form className="flex h-1/3 w-96 flex-col rounded-md border-[1px] border-neutral-200 p-5">
//           <h1 className="text-xl font-bold text-b900">Order Summary</h1>
//           <div className="mt-10 flex w-full flex-col gap-5">
//             <div className="flex w-full justify-between">
//               <p>Subtotal</p>
//               <p>${calculateTotalPrice()}</p>
//             </div>
//             <div className="flex w-full justify-between">
//               <p>Shipping</p>
//               <p>${calculateFinalPrice().shipping}</p>
//             </div>
//             <div className="flex w-full justify-between">
//               <p>Tax</p>
//               <p>${calculateFinalPrice().tax}</p>
//             </div>
//             <hr />
//             <div className="flex w-full justify-between">
//               <p>Total</p>
//               <p>${calculateFinalPrice().finalPrice}</p>
//             </div>
//             {isDisabled === true ? (
//               <Button
//                 className="mt-5 w-full disabled:bg-red-900"
//                 disabled={isDisabled}
//               >
//                 Checkout
//               </Button>
//             ) : (
//               <Link href="/checkout">
//                 <Button
//                   className="mt-5 w-full disabled:bg-red-900"
//                   disabled={isDisabled}
//                 >
//                   Checkout
//                 </Button>
//               </Link>
//             )}

//             <p className="mb-10 flex items-center justify-center text-n300 underline">
//               <Link href="/">Continue Shopping</Link>
//             </p>
//           </div>
//         </form>
//       </div>
//       <Footer className="mt-20 bg-n100" />
//     </main>
//   );
// };

// export default CartPage;

"use client";

import React, { useEffect, useState } from "react";
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
    const totalPrice: number = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    return totalPrice.toFixed(2);
  };

  const calculateFinalPrice = () => {
    const totalPrice: number = Number(calculateTotalPrice());
    let tax: number;
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
      <div className="my-8 w-full px-4 sm:my-12 sm:px-6 lg:my-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:mx-auto lg:w-container lg:flex-row lg:justify-between">
            <div className="mb-8 w-full lg:mb-0 lg:w-[600px]">
              <h1 className="mb-2 text-xl font-bold">Your Cart</h1>
              <hr className="mb-6" />
              <div className="space-y-6">
                {cartItems.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col items-start justify-between space-y-4 border-b pb-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0"
                    >
                      <div className="flex items-center space-x-4">
                        <Image
                          src={item.image}
                          alt=""
                          height={80}
                          width={80}
                          className="h-20 w-20 rounded-md bg-n100 object-cover"
                        />
                        <div>
                          <Link href={`/products/${item.id}`}>
                            <p className="font-medium hover:underline">
                              {item.title}
                            </p>
                          </Link>
                          <p className="mt-1 text-sm text-gray-500">
                            ${item.price}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <QuantitySelector
                          quantity={item.quantity}
                          onQuantityChange={(newQuantity) =>
                            handleQuantityChange(item.id, newQuantity)
                          }
                          minQuantity={getItemMinQuantity(item.id)}
                        />
                        <button
                          className="flex h-9 w-9 items-center justify-center rounded-md border border-red-600 bg-transparent text-red-600 transition-colors duration-300 ease-in-out hover:bg-red-600 hover:text-white"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          <MdDeleteForever size={25} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="mt-8 h-1/3 w-full lg:mt-0 lg:w-96">
              <form className="flex flex-col rounded-md border border-neutral-200 p-5">
                <h2 className="mb-6 text-xl font-bold text-b900">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>${calculateTotalPrice()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Shipping</p>
                    <p>${calculateFinalPrice().shipping}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Tax</p>
                    <p>${calculateFinalPrice().tax}</p>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold">
                    <p>Total</p>
                    <p>${calculateFinalPrice().finalPrice}</p>
                  </div>
                </div>
                {isDisabled ? (
                  <Button
                    className="mt-6 w-full disabled:bg-red-900"
                    disabled={isDisabled}
                  >
                    Checkout
                  </Button>
                ) : (
                  <Link href="/checkout" className="mt-6 w-full">
                    <Button
                      className="w-full disabled:bg-red-900"
                      disabled={isDisabled}
                    >
                      Checkout
                    </Button>
                  </Link>
                )}
                <Link href="/" className="mt-4 text-center text-n300 underline">
                  Continue Shopping
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer className="mt-20 bg-n100" />
    </main>
  );
};

export default CartPage;
