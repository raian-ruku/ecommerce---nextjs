import React, { useState } from "react";
import CustomTop from "../components/customTop";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PiListHeartBold } from "react-icons/pi";
import { FaMapPin } from "react-icons/fa";
import { PiPasswordFill } from "react-icons/pi";
import { IoPersonCircle } from "react-icons/io5";

import ProfileInfo from "./_components/profileInfo";
import { Footer } from "../components/footer";
import WishList from "./_components/wishlist";
import { FaShoppingCart } from "react-icons/fa";
import ShippingAddress from "./_components/shippingAddress";
import PlacedOrders from "./_components/placedOrders";
import PasswordPage from "./_components/password";

const ProfilePage = () => {
  return (
    <main className="flex w-full flex-col items-center justify-center">
      <CustomTop classname="bg-n100" />
      <div className="my-32 flex h-full w-container">
        <Tabs
          defaultValue="orders"
          orientation="vertical"
          className="flex h-full w-full"
        >
          <TabsList className="flex h-full w-[250px] flex-col items-start justify-start gap-5 bg-transparent text-[20px]">
            <TabsTrigger
              value="orders"
              className="flex items-center gap-1 transition-all duration-300 ease-in-out data-[state=active]:w-[250px] data-[state=inactive]:w-[200px] data-[state=active]:items-start data-[state=inactive]:items-start data-[state=active]:justify-start data-[state=inactive]:justify-start data-[state=active]:bg-b900 data-[state=active]:text-[20px] data-[state=inactive]:text-[15px] data-[state=active]:text-white"
            >
              <div className="flex items-center justify-center gap-2">
                <FaShoppingCart />
                Orders
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="flex items-center gap-1 transition-all duration-300 ease-in-out data-[state=active]:w-[250px] data-[state=inactive]:w-[200px] data-[state=active]:items-start data-[state=inactive]:items-start data-[state=active]:justify-start data-[state=inactive]:justify-start data-[state=active]:bg-b900 data-[state=active]:text-[20px] data-[state=inactive]:text-[15px] data-[state=active]:text-white"
            >
              <div className="flex items-center justify-center gap-2">
                <PiListHeartBold />
                Wishlist
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="address"
              className="flex items-center gap-1 transition-all duration-300 ease-in-out data-[state=active]:w-[250px] data-[state=inactive]:w-[200px] data-[state=active]:items-start data-[state=inactive]:items-start data-[state=active]:justify-start data-[state=inactive]:justify-start data-[state=active]:bg-b900 data-[state=active]:text-[20px] data-[state=inactive]:text-[15px] data-[state=active]:text-white"
            >
              <div className="flex items-center justify-center gap-2">
                <FaMapPin />
                Addresses
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="flex items-center gap-1 transition-all duration-300 ease-in-out data-[state=active]:w-[250px] data-[state=inactive]:w-[200px] data-[state=active]:items-start data-[state=inactive]:items-start data-[state=active]:justify-start data-[state=inactive]:justify-start data-[state=active]:bg-b900 data-[state=active]:text-[20px] data-[state=inactive]:text-[15px] data-[state=active]:text-white"
            >
              <div className="flex items-center justify-center gap-2">
                <PiPasswordFill />
                Password
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="accountDetail"
              className="flex items-center gap-1 transition-all duration-300 ease-in-out data-[state=active]:w-[250px] data-[state=inactive]:w-[200px] data-[state=active]:items-start data-[state=inactive]:items-start data-[state=active]:justify-start data-[state=inactive]:justify-start data-[state=active]:bg-b900 data-[state=active]:text-[20px] data-[state=inactive]:text-[15px] data-[state=active]:text-white"
            >
              <div className="flex items-center justify-center gap-2">
                <IoPersonCircle />
                Account Details
              </div>
            </TabsTrigger>
          </TabsList>
          {/* Vertical separator */}
          <div className="mx-8 h-auto w-[1px] bg-neutral-200"></div>
          <div className="h-full flex-1 px-4">
            <TabsContent value="orders">
              <PlacedOrders />
            </TabsContent>
            <TabsContent value="wishlist">
              <div className="px-4">
                <WishList />
              </div>
            </TabsContent>
            <TabsContent value="address">
              <div className="px-4">
                <ShippingAddress />
              </div>
            </TabsContent>
            <TabsContent value="password">
              <div className="px-4">
                <PasswordPage />
              </div>
            </TabsContent>
            <TabsContent value="accountDetail">
              <div className="px-4">
                <ProfileInfo />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <Footer className="mt-32 bg-n100" />
    </main>
  );
};

export default ProfilePage;
