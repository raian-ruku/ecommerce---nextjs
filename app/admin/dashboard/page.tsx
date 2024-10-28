import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { FaBoxArchive } from "react-icons/fa6";
import { MdPeopleAlt } from "react-icons/md";
import { MdReviews } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { FaCartArrowDown } from "react-icons/fa6";
import { BiSolidBadgeDollar } from "react-icons/bi";

import Logo from "@/public/images/admin.png";
import Image from "next/image";
import ProductsPage from "./_components/products";
import DashboardPage from "./_components/dashboard";
import OrdersPage from "./_components/orders";
import CustomersPage from "./_components/customers";
import AdminSettings from "./_components/adminSettings";
import SalesPage from "./_components/sales";
import ReviewsPage from "./_components/reviews";

const AdminDashboard = () => {
  return (
    <main className="flex h-screen w-full items-center justify-center p-5">
      <Tabs
        defaultValue="dashboard"
        orientation="vertical"
        className="flex h-full w-full"
      >
        <TabsList className="flex h-full w-[250px] flex-col items-start justify-start gap-5 bg-transparent text-[20px]">
          <Image
            src={Logo}
            alt="admin logo"
            height={250}
            width={250}
            className="mx-16 mb-20 h-auto w-32 items-center"
          />
          <TabsTrigger
            value="dashboard"
            className="flex items-center gap-1 transition-all duration-300 ease-in-out data-[state=active]:w-[200px] data-[state=inactive]:w-[200px] data-[state=active]:items-start data-[state=inactive]:items-start data-[state=active]:justify-start data-[state=inactive]:justify-start data-[state=active]:bg-red-500 data-[state=active]:text-[20px] data-[state=inactive]:text-[15px] data-[state=active]:text-white data-[state=active]:drop-shadow-xl"
          >
            <div className="flex items-center justify-center gap-2">
              <MdDashboard />
              Dashboard
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="products"
            className="flex items-center gap-1 transition-all duration-300 ease-in-out data-[state=active]:w-[200px] data-[state=inactive]:w-[200px] data-[state=active]:items-start data-[state=inactive]:items-start data-[state=active]:justify-start data-[state=inactive]:justify-start data-[state=active]:bg-red-500 data-[state=active]:text-[20px] data-[state=inactive]:text-[15px] data-[state=active]:text-white data-[state=active]:drop-shadow-xl"
          >
            <div className="flex items-center justify-center gap-2">
              <FaBoxArchive />
              Products
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="sales"
            className="flex items-center gap-1 transition-all duration-300 ease-in-out data-[state=active]:w-[200px] data-[state=inactive]:w-[200px] data-[state=active]:items-start data-[state=inactive]:items-start data-[state=active]:justify-start data-[state=inactive]:justify-start data-[state=active]:bg-red-500 data-[state=active]:text-[20px] data-[state=inactive]:text-[15px] data-[state=active]:text-white data-[state=active]:drop-shadow-xl"
          >
            <div className="flex items-center justify-center gap-2">
              <BiSolidBadgeDollar />
              Sales
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="flex items-center gap-1 transition-all duration-300 ease-in-out data-[state=active]:w-[200px] data-[state=inactive]:w-[200px] data-[state=active]:items-start data-[state=inactive]:items-start data-[state=active]:justify-start data-[state=inactive]:justify-start data-[state=active]:bg-red-500 data-[state=active]:text-[20px] data-[state=inactive]:text-[15px] data-[state=active]:text-white data-[state=active]:drop-shadow-xl"
          >
            <div className="flex items-center justify-center gap-2">
              <FaCartArrowDown />
              Orders
            </div>
          </TabsTrigger>

          <TabsTrigger
            value="customers"
            className="flex items-center gap-1 transition-all duration-300 ease-in-out data-[state=active]:w-[200px] data-[state=inactive]:w-[200px] data-[state=active]:items-start data-[state=inactive]:items-start data-[state=active]:justify-start data-[state=inactive]:justify-start data-[state=active]:bg-red-500 data-[state=active]:text-[20px] data-[state=inactive]:text-[15px] data-[state=active]:text-white data-[state=active]:drop-shadow-xl"
          >
            <div className="flex items-center justify-center gap-2">
              <MdPeopleAlt />
              Customers
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="flex items-center gap-1 transition-all duration-300 ease-in-out data-[state=active]:w-[200px] data-[state=inactive]:w-[200px] data-[state=active]:items-start data-[state=inactive]:items-start data-[state=active]:justify-start data-[state=inactive]:justify-start data-[state=active]:bg-red-500 data-[state=active]:text-[20px] data-[state=inactive]:text-[15px] data-[state=active]:text-white data-[state=active]:drop-shadow-xl"
          >
            <div className="flex items-center justify-center gap-2">
              <MdReviews />
              Reviews
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="flex items-center gap-1 transition-all duration-300 ease-in-out data-[state=active]:w-[200px] data-[state=inactive]:w-[200px] data-[state=active]:items-start data-[state=inactive]:items-start data-[state=active]:justify-start data-[state=inactive]:justify-start data-[state=active]:bg-red-500 data-[state=active]:text-[20px] data-[state=inactive]:text-[15px] data-[state=active]:text-white data-[state=active]:drop-shadow-xl"
          >
            <div className="flex items-center justify-center gap-2">
              <IoSettingsSharp />
              Settings
            </div>
          </TabsTrigger>
        </TabsList>
        {/* Vertical separator */}
        <div className="mx-8 h-auto w-[1px] bg-neutral-200"></div>
        <div className="h-full flex-1 px-4">
          <TabsContent value="dashboard">
            <DashboardPage />
          </TabsContent>
          <TabsContent value="products">
            <ProductsPage />
          </TabsContent>
          <TabsContent value="sales">
            <SalesPage />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersPage />
          </TabsContent>
          <TabsContent value="customers">
            <CustomersPage />
          </TabsContent>
          <TabsContent value="reviews">
            <ReviewsPage />
          </TabsContent>
          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
};

export default AdminDashboard;
