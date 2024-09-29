"use client";

import React, { useState } from "react";
import CustomTop from "../components/customTop";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CiShoppingCart } from "react-icons/ci";
import { FaRegHeart } from "react-icons/fa";
import { BsTruck } from "react-icons/bs";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoPersonOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import ProfileInfo from "./_components/profileInfo";

const ProfilePage = () => {
  const [selectedTab, setSelectedTab] = useState("details");

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
              className="flex items-center gap-1 data-[state=active]:bg-b900 data-[state=active]:text-white"
            >
              <CiShoppingCart size={20} />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="flex items-center gap-1 data-[state=active]:bg-b900 data-[state=active]:text-white"
            >
              <FaRegHeart size={15} />
              Wishlist
            </TabsTrigger>
            <TabsTrigger
              value="address"
              className="flex items-center gap-1 data-[state=active]:bg-b900 data-[state=active]:text-white"
            >
              <BsTruck size={15} />
              Address
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="flex items-center gap-1 data-[state=active]:bg-b900 data-[state=active]:text-white"
            >
              <RiLockPasswordLine size={15} />
              Password
            </TabsTrigger>
            <TabsTrigger
              value="accountDetail"
              className="flex flex-row items-center gap-1 data-[state=active]:bg-b900 data-[state=active]:text-white"
            >
              <IoPersonOutline size={15} />
              Account Detail
            </TabsTrigger>
            <TabsTrigger
              value="logout"
              className="flex items-center gap-1 data-[state=active]:bg-b900 data-[state=active]:text-white"
            >
              <CiLogout size={15} />
              Logout
            </TabsTrigger>
          </TabsList>
          {/* Vertical separator */}
          <div className="mx-8 h-[400px] w-[1px] bg-neutral-200"></div>
          <div className="h-full flex-1 p-4">
            <TabsContent value="orders">Orders content here...</TabsContent>
            <TabsContent value="wishlist">
              <div className="p-4">Wishlist content here...</div>
            </TabsContent>
            <TabsContent value="address">
              <div className="p-4">Address content here...</div>
            </TabsContent>
            <TabsContent value="password">
              <div className="p-4">Password content here...</div>
            </TabsContent>
            <TabsContent value="accountDetail">
              <div className="p-4">
                <ProfileInfo />
              </div>
            </TabsContent>
            <TabsContent value="logout">
              <div className="p-4">Logout content here...</div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
};

export default ProfilePage;
